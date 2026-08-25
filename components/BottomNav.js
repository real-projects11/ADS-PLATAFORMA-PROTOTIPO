const TABS = [
  {
    key: 'ganar',
    label: 'Ganar',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 L14.5 9 L22 9 L16 13.5 L18 21 L12 16.5 L6 21 L8 13.5 L2 9 L9.5 9 Z"
          fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'referidos',
    label: 'Referidos',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" fill={active ? 'currentColor' : 'none'} />
        <path d="M3.5 20c0-3.6 2.6-6 5.5-6s5.5 2.4 5.5 6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M16 4.5c1.6.4 2.8 1.9 2.8 3.6 0 1.7-1.2 3.2-2.8 3.6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M17.5 14.3c2.3.5 4 2.6 4 5.2" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'ranking',
    label: 'Ranking',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="12.5" width="4.5" height="8" rx="1" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" />
        <rect x="9.75" y="8" width="4.5" height="12.5" rx="1" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" />
        <rect x="16" y="4" width="4.5" height="16.5" rx="1" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    key: 'perfil',
    label: 'Perfil',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" fill={active ? 'currentColor' : 'none'} />
        <path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`bottom-nav-item${active === tab.key ? ' active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.icon(active === tab.key)}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
