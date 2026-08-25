import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import BottomNav from '../components/BottomNav';

const MIN_SECONDS = 15;
const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('home');
  const [adSessionId, setAdSessionId] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [message, setMessage] = useState('');
  const [redeemDesc, setRedeemDesc] = useState('');
  const [redeemPoints, setRedeemPoints] = useState('');
  const [bump, setBump] = useState(false);
  const bumpTimeout = useRef(null);
  const [referral, setReferral] = useState(null);
  const [copied, setCopied] = useState(false);

  const loadUser = useCallback(async () => {
    const res = await fetch('/api/user/me');
    if (!res.ok) {
      router.replace('/login');
      return;
    }
    const data = await res.json();
    setUser(data.user);
    setTransactions(data.transactions);
    setLoading(false);
  }, [router]);

  useEffect(() => { loadUser(); }, [loadUser]);

  const loadReferral = useCallback(async () => {
    const res = await fetch('/api/user/referrals');
    if (!res.ok) return;
    const data = await res.json();
    setReferral(data);
  }, []);

  useEffect(() => {
    if (tab === 'referidos' && !referral) loadReferral();
  }, [tab, referral, loadReferral]);

  function copyReferralLink() {
    if (!referral) return;
    const link = `${window.location.origin}/register?ref=${referral.referralId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  async function startAd() {
    setMessage('');
    const res = await fetch('/api/ad/start', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Error al iniciar el anuncio.');
      return;
    }
    setAdSessionId(data.adSessionId);
    setSecondsLeft(MIN_SECONDS);
  }

  async function claimAd() {
    if (!adSessionId) return;
    setMessage('');
    const res = await fetch('/api/ad/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adSessionId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'No se pudo reclamar.');
      return;
    }
    setMessage(`¡Ganaste ${data.pointsAwarded} puntos!`);
    setAdSessionId(null);
    setBump(true);
    clearTimeout(bumpTimeout.current);
    bumpTimeout.current = setTimeout(() => setBump(false), 400);
    loadUser();
  }

  async function handleRedeem(e) {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: redeemPoints, description: redeemDesc }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Error al canjear.');
      return;
    }
    setMessage('¡Canje realizado!');
    setRedeemDesc('');
    setRedeemPoints('');
    loadUser();
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  }

  if (loading) return <div className="container"><p>Cargando...</p></div>;

  const ready = adSessionId && secondsLeft <= 0;
  const progress = adSessionId ? (MIN_SECONDS - secondsLeft) / MIN_SECONDS : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="container with-bottom-nav">
      <div className="app-header">
        <div>
          <span className="app-header-eyebrow">Bienvenido</span>
          <h1>Hola, {user.username}</h1>
        </div>
        <span className="points-pill">★ {user.points}</span>
      </div>

      {tab === 'home' && (
        <div className="card hero-card">
          <p className="points-label" style={{ marginBottom: 4 }}>Balance total</p>
          <p className="points">{user.points}</p>
          <p className="points-label">puntos</p>

          <div className="quick-grid">
            <button className="quick-item" onClick={() => setTab('ganar')}>
              <span className="quick-icon quick-icon-gold">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 4 19 12 6 20Z" fill="#1a1305" /></svg>
              </span>
              Ganar
            </button>
            <button className="quick-item" onClick={() => setTab('referidos')}>
              <span className="quick-icon quick-icon-violet">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="8" r="3" fill="#fff" /><path d="M3.5 19c0-3.3 2.5-5.6 5.5-5.6s5.5 2.3 5.5 5.6" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              Referidos
            </button>
            <button className="quick-item" onClick={() => setTab('ranking')}>
              <span className="quick-icon quick-icon-coral">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3.5" y="12" width="4.5" height="8" fill="#fff" /><rect x="9.75" y="7" width="4.5" height="13" fill="#fff" /><rect x="16" y="3" width="4.5" height="17" fill="#fff" />
                </svg>
              </span>
              Ranking
            </button>
            <button className="quick-item" onClick={() => setTab('perfil')}>
              <span className="quick-icon quick-icon-green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="3.4" fill="#fff" /><path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" fill="#fff" />
                </svg>
              </span>
              Perfil
            </button>
          </div>
        </div>
      )}

      {tab === 'ganar' && (
        <div className="card hero-card">
          <div className="hero-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" fill="#ffb100" />
              <text x="12" y="16.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1a1305">$</text>
            </svg>
          </div>
          <p className={`points${bump ? ' bump' : ''}`}>{user.points}</p>
          <p className="points-label">puntos acumulados</p>
          <span className="reward-pill">+10 puntos por anuncio visto</span>

          <div className="ad-ring-wrap">
            <div className="ad-ring">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle className="ad-ring-track" cx="80" cy="80" r={RADIUS} strokeWidth="10" fill="none" />
                <circle
                  className={`ad-ring-progress${ready ? ' ready' : ''}`}
                  cx="80" cy="80" r={RADIUS} strokeWidth="10" fill="none"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={adSessionId ? dashOffset : CIRCUMFERENCE}
                />
              </svg>
              <div className="ad-ring-center">
                {adSessionId && !ready && (
                  <>
                    <span className="ad-ring-number">{secondsLeft}</span>
                    <span className="ad-ring-sub">segundos</span>
                  </>
                )}
                {ready && (
                  <>
                    <span className="ad-ring-number">✓</span>
                    <span className="ad-ring-sub">listo</span>
                  </>
                )}
                {!adSessionId && (
                  <>
                    <span className="ad-ring-number">▶</span>
                    <span className="ad-ring-sub">anuncio</span>
                  </>
                )}
              </div>
            </div>

            {!adSessionId && (
              <button className="ad-cta gold-pill" onClick={startAd}>▶ Ver anuncio</button>
            )}
            {ready && (
              <div className="ad-cta pulse">
                <button className="gold-pill" onClick={claimAd}>Reclamar puntos</button>
              </div>
            )}
          </div>

          {message && <p className="message">{message}</p>}
        </div>
      )}

      {tab === 'referidos' && (
        <>
          <div className="card">
            <h2>Invitá amigos</h2>
            <p className="placeholder-text">
              Ganás {' '}<strong>5 puntos</strong> cuando la persona que invitaste
              ve su primer anuncio.
            </p>
            {referral && (
              <>
                <div className="ref-link-box">
                  <span>{`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${referral.referralId}`}</span>
                </div>
                <button onClick={copyReferralLink}>{copied ? '¡Copiado!' : 'Copiar link'}</button>
              </>
            )}
          </div>

          {referral && (
            <div className="card">
              <h2>Tus invitados</h2>
              <div className="ref-stats">
                <div className="ref-stat">
                  <span className="ref-stat-number">{referral.totalInvited}</span>
                  <span className="ref-stat-label">Invitados</span>
                </div>
                <div className="ref-stat">
                  <span className="ref-stat-number ref-active">{referral.totalActive}</span>
                  <span className="ref-stat-label">Activos</span>
                </div>
                <div className="ref-stat">
                  <span className="ref-stat-number ref-inactive">{referral.totalInactive}</span>
                  <span className="ref-stat-label">Inactivos</span>
                </div>
              </div>
              <ul className="tx-list">
                {referral.invited.map((r, i) => (
                  <li key={i} className={r.active ? 'positive' : 'negative'}>
                    <span>{r.username}</span>
                    <span>{r.active ? 'Activo' : 'Inactivo'}</span>
                  </li>
                ))}
                {referral.invited.length === 0 && <li>Todavía no invitaste a nadie.</li>}
              </ul>
            </div>
          )}
        </>
      )}

      {tab === 'ranking' && (
        <div className="card placeholder-card">
          <div className="placeholder-icon">🏆</div>
          <h2>Ranking</h2>
          <p className="placeholder-text">
            Pronto vas a poder ver la tabla de los usuarios con más puntos
            del día, la semana y el mes.
          </p>
          <span className="soon-badge">Próximamente</span>
        </div>
      )}

      {tab === 'perfil' && (
        <>
          <div className="card profile-card">
            <div className="profile-avatar">{user.username.slice(0, 1).toUpperCase()}</div>
            <h1 className="profile-name">{user.username}</h1>
            <p className="profile-points">★ {user.points} puntos</p>
            <button onClick={handleLogout} className="secondary">Cerrar sesión</button>
          </div>

          <div className="card">
            <h2>Canjear puntos</h2>
            <form onSubmit={handleRedeem}>
              <label>Puntos a canjear</label>
              <input type="number" min="1" value={redeemPoints} onChange={(e) => setRedeemPoints(e.target.value)} required />
              <label>Descripción del premio</label>
              <input value={redeemDesc} onChange={(e) => setRedeemDesc(e.target.value)} required />
              <button type="submit">Canjear</button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>

          <div className="card">
            <h2>Historial</h2>
            <ul className="tx-list">
              {transactions.map((t) => (
                <li key={t.id} className={t.delta >= 0 ? 'positive' : 'negative'}>
                  <span>{t.reason}</span>
                  <span>{t.delta > 0 ? '+' : ''}{t.delta}</span>
                </li>
              ))}
              {transactions.length === 0 && <li>Sin movimientos todavía.</li>}
            </ul>
          </div>
        </>
      )}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
