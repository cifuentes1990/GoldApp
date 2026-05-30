import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import api from '../../utils/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function GoldChart() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPrice, setCurrentPrice] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/prices/history'),
      api.get('/prices/gold'),
    ]).then(([histRes, priceRes]) => {
      setHistory(histRes.data.history)
      setCurrentPrice(priceRes.data.price)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="h-64 shimmer-bg rounded-2xl" />

  const labels = history.map(h => {
    const d = new Date(h.date)
    return d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
  })

  const prices = history.map(h => h.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const startPrice = prices[0]
  const endPrice = prices[prices.length - 1]
  const change = ((endPrice - startPrice) / startPrice * 100).toFixed(2)

  const data = {
    labels,
    datasets: [{
      label: 'Precio XAU/USD',
      data: prices,
      borderColor: '#F5B042',
      borderWidth: 2,
      backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height)
        gradient.addColorStop(0, 'rgba(245,176,66,0.3)')
        gradient.addColorStop(1, 'rgba(245,176,66,0.0)')
        return gradient
      },
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#F5B042',
      pointBorderColor: '#0A0A0A',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A1A1A',
        borderColor: 'rgba(245,176,66,0.3)',
        borderWidth: 1,
        titleColor: '#F5B042',
        bodyColor: '#A0A0A0',
        callbacks: { label: (ctx) => ` $${ctx.raw.toFixed(2)} USD/oz` },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#555', font: { family: 'JetBrains Mono', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#555', font: { family: 'JetBrains Mono', size: 11 }, callback: v => `$${v}` },
        min: Math.floor(minPrice * 0.97),
      },
    },
  }

  return (
    <div className="glass-card p-6 border border-white/8">
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Precio Actual</p>
          <p className="text-3xl font-mono font-bold text-gold-400">${currentPrice?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">12 meses</p>
          <p className={`text-lg font-mono font-semibold ${Number(change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {Number(change) >= 0 ? '▲' : '▼'} {Math.abs(change)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Mín / Máx</p>
          <p className="text-sm font-mono text-gray-400">${minPrice.toFixed(0)} / ${maxPrice.toFixed(0)}</p>
        </div>
      </div>
      <div style={{ height: '240px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
