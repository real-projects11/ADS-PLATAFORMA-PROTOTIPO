const SIDE_TABS = [
  {
    key: 'referidos',
    label: 'Referidos',
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
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
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
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
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" fill={active ? 'currentColor' : 'none'} />
        <path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav({ active, onChange }) {
  const [left, right] = [SIDE_TABS.slice(0, 1), SIDE_TABS.slice(1)];

  return (
    <nav className="bottom-nav">
      {left.map((tab) => (
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

      <button
        type="button"
        className={`bottom-nav-fab${active === 'ganar' ? ' active' : ''}`}
        onClick={() => onChange('ganar')}
      >
        <span className="bottom-nav-fab-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" fill="#1a1305" opacity="0.15" />
            <circle cx="12" cy="9.5" r="6.5" fill="#1a1305" />
            <text x="12" y="13" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffb100">$</text>
          </svg>
        </span>
        <span>Ganar</span>
      </button>

      {right.map((tab) => (
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
