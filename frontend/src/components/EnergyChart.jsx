// Energy chart component
import { useEffect, useRef } from 'react'
import {
  Chart,
  LineController, BarController,
  LineElement, BarElement,
  PointElement, CategoryScale, LinearScale,
  Filler, Tooltip, Legend
} from 'chart.js'

// Register only what we need
Chart.register(
  LineController, BarController,
  LineElement, BarElement,
  PointElement, CategoryScale, LinearScale,
  Filler, Tooltip, Legend
)

/**
 * EnergyChart - renders a line or bar chart.
 * Props:
 *   type: 'line' | 'bar'
 *   labels: string[]
 *   datasets: Chart.js dataset objects
 *   height: number (px)
 */
// Chart display section
export default function EnergyChart({ type = 'bar', labels = [], datasets = [], height = 200 }) {
  // canvasRef section
  const canvasRef = useRef(null)
  // chartRef section
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Destroy existing chart before creating a new one
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    chartRef.current = new Chart(canvasRef.current, {
      type,
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: datasets.length > 1 },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
        },
      },
    })

    return () => {
      if (chartRef.current) chartRef.current.destroy()
    }
  }, [type, labels, datasets])

  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
