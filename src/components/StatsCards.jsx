import { formatSize } from '../utils/analyzeFolder';

export default function StatsCards({ data }) {
  if (!data) return null;

  const { folderName, totalFiles, totalSize } = data;

  const cards = [
    {
      label: 'Cartella',
      value: folderName,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      mono: false,
    },
    {
      label: 'File totali',
      value: totalFiles.toLocaleString('it-IT'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
        </svg>
      ),
      mono: true,
    },
    {
      label: 'Dimensione totale',
      value: formatSize(totalSize),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>
      ),
      mono: true,
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div key={card.label} className="stat-card">
          <div className="stat-card__icon" aria-hidden="true">
            {card.icon}
          </div>
          <div className="stat-card__body">
            <span className="stat-card__label">{card.label}</span>
            <span className={`stat-card__value${card.mono ? ' stat-card__value--mono' : ''}`}>
              {card.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
