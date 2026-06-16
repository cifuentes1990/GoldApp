const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');

// El probador con IA es costoso por llamada — límite estricto por IP
const tryonLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,            // 1 hora
  max: 15,                             // 15 montajes por hora por IP
  message: { error: 'Has alcanzado el límite de pruebas por hora. Intenta más tarde.' },
});

// ─── Prompt según la categoría de la joya ────────────────────────────────────
function buildPrompt(category, productName) {
  const placement = {
    collar:  'around the person\'s neck, resting naturally on the collarbone/chest',
    cadena:  'around the person\'s neck, lying flat against the skin',
    dije:    'as a pendant hanging from a chain around the person\'s neck, centered on the chest',
    aretes:  'on the person\'s earlobes, one on each visible ear',
    anillo:  'on a finger of the person\'s hand if visible',
    pulsera: 'around the person\'s wrist if visible',
  }[category] || 'naturally on the person where this type of jewelry is normally worn';

  return [
    `You are a professional virtual jewelry try-on assistant.`,
    `The FIRST image is a photo of a real person (the customer).`,
    `The SECOND image is a piece of gold jewelry called "${productName}".`,
    `Edit the FIRST image so the person is realistically wearing this exact jewelry, placed ${placement}.`,
    `Match the jewelry's perspective, lighting, scale and shadows to the photo so it looks naturally worn.`,
    `Keep the person's face, pose, skin and background completely unchanged.`,
    `Do not add any other objects, text or watermarks. Output only the edited photo.`,
  ].join(' ');
}

// ─── Descarga la imagen del producto y la pasa a base64 ──────────────────────
async function urlToInlineData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo descargar la imagen del producto');
  const buf = await res.buffer();
  const mimeType = res.headers.get('content-type') || 'image/jpeg';
  return { mimeType, data: buf.toString('base64') };
}

// ─── Llama a Gemini (Google AI Studio) ───────────────────────────────────────
async function generateWithGemini({ personImage, productImage, prompt }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    const err = new Error('El probador virtual estará disponible muy pronto. Estamos afinando los últimos detalles. 💫');
    err.status = 503;
    err.demo = true;
    throw err;
  }
  const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType: personImage.mimeType, data: personImage.data } },
        { inlineData: { mimeType: productImage.mimeType, data: productImage.data } },
      ],
    }],
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) {
    const rawMsg = json?.error?.message || 'Error del servicio de IA';
    // Cuota agotada o billing no activado en Google → modo demo
    const isQuota = res.status === 429 || /quota|billing|limit: 0/i.test(rawMsg);
    if (isQuota) {
      const err = new Error('El probador virtual estará disponible muy pronto. Estamos afinando los últimos detalles. 💫');
      err.status = 503;
      err.demo = true;
      throw err;
    }
    const err = new Error(rawMsg);
    err.status = 502;
    throw err;
  }

  // Busca la primera parte que contenga una imagen (camelCase o snake_case)
  const parts = json?.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    const inline = part.inlineData || part.inline_data;
    if (inline?.data) {
      const mime = inline.mimeType || inline.mime_type || 'image/png';
      return `data:${mime};base64,${inline.data}`;
    }
  }
  throw new Error('La IA no devolvió una imagen. Intenta con otra foto.');
}

// ─── POST /api/tryon ─────────────────────────────────────────────────────────
router.post('/', protect, tryonLimiter, async (req, res) => {
  try {
    const { userImage, productImage, productName = 'joya', category = '' } = req.body;

    if (!userImage || !productImage) {
      return res.status(400).json({ error: 'Falta la foto del cliente o de la joya.' });
    }

    // userImage llega como data URL: data:image/jpeg;base64,XXXX
    const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(userImage);
    if (!match) {
      return res.status(400).json({ error: 'Formato de foto inválido. Sube una imagen JPG o PNG.' });
    }
    const personImage = { mimeType: match[1], data: match[2] };

    // Límite de tamaño (~6MB en base64 ≈ 4.5MB de imagen)
    if (personImage.data.length > 8_000_000) {
      return res.status(413).json({ error: 'La foto es muy grande. Usa una imagen de menos de 5MB.' });
    }

    const productInline = await urlToInlineData(productImage);
    const prompt = buildPrompt(category, productName);

    const provider = process.env.AI_PROVIDER || 'gemini';
    let resultImage;
    if (provider === 'gemini') {
      resultImage = await generateWithGemini({ personImage, productImage: productInline, prompt });
    } else {
      return res.status(503).json({ error: `Proveedor de IA no soportado: ${provider}` });
    }

    res.json({ image: resultImage });
  } catch (err) {
    console.error('Try-on error:', err.message);
    res.status(err.status || 500).json({
      error: err.message || 'Error al generar el montaje',
      ...(err.demo ? { demo: true } : {}),
    });
  }
});

module.exports = router;
