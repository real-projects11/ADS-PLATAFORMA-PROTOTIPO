const TABS = [
  {
    key: 'home',
    label: 'Home',
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10.5V20h12v-9.5" stroke="currentColor" strokeWidth="1.7" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.18 : 0} strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'referidos',
    label: 'Referidos',
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.18 : 0} />
        <path d="M3.5 20c0-3.6 2.6-6 5.5-6s5.5 2.4 5.5 6" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" />
        <path d="M16 4.5c1.6.4 2.8 1.9 2.8 3.6 0 1.7-1.2 3.2-2.8 3.6" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" />
        <path d="M17.5 14.3c2.3.5 4 2.6 4 5.2" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'ganar',
    label: 'Ganar',
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.18 : 0} />
        <text x="12" y="16" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="currentColor" stroke="none">$</text>
      </svg>
    ),
  },
  {
    key: 'ranking',
    label: 'Ranking',
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="12.5" width="4.5" height="8" rx="1" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.18 : 0} stroke="currentColor" strokeWidth="1.7" />
        <rect x="9.75" y="8" width="4.5" height="12.5" rx="1" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.18 : 0} stroke="currentColor" strokeWidth="1.7" />
        <rect x="16" y="4" width="4.5" height="16.5" rx="1" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.18 : 0} stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    key: 'perfil',
    label: 'Perfil',
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.18 : 0} />
        <path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" />
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
