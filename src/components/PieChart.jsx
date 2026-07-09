import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { formatSize } from '../utils/analyzeFolder';

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = [
  '#1A56DB', // blue
  '#7C3AED', // purple
  '#059669', // emerald
  '#EA580C', // orange
  '#DC2626', // red
  '#0891B2', // cyan
  '#CA8A04', // yellow
  '#DB2777', // pink
];

export default function PieChart({ data }) {
  if (!data || !data.extensions || data.extensions.length === 0) return null;

  const top5 = data.extensions.slice(0, 5);
  const otherCount = data.extensions.slice(5).reduce((sum, e) => sum + e.count, 0);
  const otherSize = data.extensions.slice(5).reduce((sum, e) => sum + e.size, 0);

  let labels = top5.map((e) => `.${e.ext}`);
  let sizes = top5.map((e) => e.size);
  let colors = top5.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  if (otherCount > 0) {
    labels.push('Altre');
    sizes.push(otherSize);
    colors.push('#9CA3AF');
  }

  const chartData = {
    labels,
    datasets: [
      {
        data: sizes,
        backgroundColor: colors,
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverBorderColor: '#F5F7FA',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
          pointStyleHeight: 10,
          font: {
            family: "'Inter', system-ui, sans-serif",
            size: 13,
          },
          color: '#374151',
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => ({
              text: `${label}  —  ${formatSize(dataset.data[i])}`,
              fillStyle: dataset.backgroundColor[i],
              strokeStyle: dataset.backgroundColor[i],
              lineWidth: 0,
              hidden: false,
              index: i,
              pointStyle: 'circle',
              rotation: 0,
            }));
          },
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        titleFont: { family: "'Inter', system-ui, sans-serif", size: 14, weight: '600' },
        bodyFont: { family: "'JetBrains Mono', monospace", size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: (ctx) => {
            const pct = ((ctx.parsed / ctx.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
            return ` ${formatSize(ctx.parsed)} (${pct}%)`;
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 500,
    },
  };

  return (
    <div className="pie-section">
      <h2 className="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
        </svg>
        Distribuzione per tipo di file
      </h2>
      <div className="pie-wrapper" role="img" aria-label="Grafico a torta della distribuzione dei file per estensione">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
