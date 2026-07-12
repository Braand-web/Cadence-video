import { useEffect, useState } from 'react';
import { Icon, GoogleIcon, YoutubeIcon, TiktokIcon } from '../components/Icon';
import { LogoBadge } from '../components/Logo';
import { useAuth } from '../lib/AuthContext';

type ConnKey = 'yt' | 'tt';

export function Onboarding({ onEnterApp }: { onEnterApp: () => void }) {
  const { session, profile, signUp, signIn, signInWithGoogle, updateProfile, enterDemoMode } = useAuth();
  const [authStep, setAuthStep] = useState(0);
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [connecting, setConnecting] = useState<ConnKey | null>(null);
  const [connected, setConnected] = useState<{ yt: boolean; tt: boolean }>({ yt: false, tt: false });

  // Once a session exists (fresh signup/login, or returning from a Google OAuth
  // redirect), decide whether to resume onboarding or skip straight into the app.
  useEffect(() => {
    if (!session) return;
    if (profile?.onboarded) {
      onEnterApp();
      return;
    }
    if (profile) {
      setConnected(profile.connected_networks ?? { yt: false, tt: false });
      setAuthStep((s) => (s === 0 ? 1 : s));
    }
  }, [session, profile]);

  const submitAuth = async () => {
    setError(null);
    if (!email || !password) {
      setError('Renseigne un e-mail et un mot de passe.');
      return;
    }
    setSubmitting(true);
    const res = authTab === 'signup' ? await signUp(email, password) : await signIn(email, password);
    setSubmitting(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    // If the Supabase project requires email confirmation, no session exists
    // yet — tell the user instead of silently doing nothing. Otherwise the
    // session effect above picks up the new session and advances the flow.
    if (authTab === 'signup') setCheckEmail(true);
  };

  const connect = (net: ConnKey) => {
    setConnecting(net);
    setTimeout(() => {
      setConnecting(null);
      setConnected((c) => {
        const next = { ...c, [net]: true };
        updateProfile({ connected_networks: next });
        return next;
      });
    }, 1100);
  };

  const anyConn = connected.yt || connected.tt;

  const finish = async () => {
    await updateProfile({ onboarded: true });
    onEnterApp();
  };

  const netBtnStyle = (state: 'idle' | 'connecting' | 'connected') => {
    if (state === 'connected') return { background: 'rgba(52,211,153,.14)', color: '#34D399', border: '1px solid rgba(52,211,153,.3)', padding: '9px 15px', borderRadius: 9999, fontFamily: 'Hanken Grotesk', fontWeight: 700, fontSize: 12.5, cursor: 'default', flex: 'none' } as const;
    if (state === 'connecting') return { background: 'rgba(255,255,255,.06)', color: '#8B8B92', border: '1px solid rgba(255,255,255,.12)', padding: '9px 15px', borderRadius: 9999, fontFamily: 'Hanken Grotesk', fontWeight: 700, fontSize: 12.5, flex: 'none' } as const;
    return { background: '#fff', color: '#17171B', border: 'none', padding: '9px 15px', borderRadius: 9999, fontFamily: 'Hanken Grotesk', fontWeight: 700, fontSize: 12.5, cursor: 'pointer', flex: 'none' } as const;
  };
  const cardStyle = (on: boolean) => ({ display: 'flex', alignItems: 'center', gap: 14, border: `1px solid ${on ? 'rgba(52,211,153,.3)' : 'rgba(255,255,255,.1)'}`, borderRadius: 14, padding: 14, background: on ? 'rgba(52,211,153,.06)' : 'rgba(255,255,255,.02)' } as const);

  const ytState = connected.yt ? 'connected' : connecting === 'yt' ? 'connecting' : 'idle';
  const ttState = connected.tt ? 'connected' : connecting === 'tt' ? 'connecting' : 'idle';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        background:
          'radial-gradient(1000px 600px at 80% -10%, rgba(240,90,40,.22), transparent 60%),radial-gradient(800px 500px at -5% 110%, rgba(240,90,40,.16), transparent 55%),#101012',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440, animation: 'fadeUp .4s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 26 }}>
          <LogoBadge size={40} />
          <span style={{ fontFamily: 'Hanken Grotesk,sans-serif', fontWeight: 700, fontSize: 24, letterSpacing: '-.01em' }}>Cadence</span>
        </div>

        <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginBottom: 24 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: i === authStep ? 22 : 7, height: 7, borderRadius: 20, transition: '.2s', background: i <= authStep ? '#F05A28' : 'rgba(255,255,255,.15)' }} />
          ))}
        </div>

        <div style={{ border: '1px solid rgba(255,255,255,.09)', borderRadius: 22, padding: 30, background: 'linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015))', boxShadow: '0 30px 80px rgba(0,0,0,.45)' }}>
          {authStep === 0 && (
            <div style={{ animation: 'fadeUp .3s ease both' }}>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: 4, marginBottom: 22 }}>
                <button onClick={() => setAuthTab('signup')} style={{ flex: 1, padding: 9, borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'Hanken Grotesk', fontWeight: 700, fontSize: 13, background: authTab === 'signup' ? '#fff' : 'transparent', color: authTab === 'signup' ? '#17171B' : '#8B8B92' }}>
                  Créer un compte
                </button>
                <button onClick={() => setAuthTab('login')} style={{ flex: 1, padding: 9, borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'Hanken Grotesk', fontWeight: 700, fontSize: 13, background: authTab === 'login' ? '#fff' : 'transparent', color: authTab === 'login' ? '#17171B' : '#8B8B92' }}>
                  Se connecter
                </button>
              </div>
              <h1 style={{ fontFamily: 'Hanken Grotesk,sans-serif', fontWeight: 600, fontSize: 22, margin: '0 0 6px', textAlign: 'center' }}>{authTab === 'signup' ? 'Crée ton studio' : 'Bon retour'}</h1>
              <p style={{ color: '#8B8B92', fontSize: 13.5, textAlign: 'center', margin: '0 0 22px' }}>Contenu quotidien, en pilote automatique.</p>

              <button onClick={() => signInWithGoogle()} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11, background: '#fff', color: '#17171B', border: 'none', padding: 13, borderRadius: 12, fontFamily: 'Hanken Grotesk', fontWeight: 700, fontSize: 14.5, cursor: 'pointer', marginBottom: 16 }}>
                <GoogleIcon /> Continuer avec Google
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 16px', color: '#504F55', fontSize: 12 }}>
                <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.1)' }} />
                OU
                <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.1)' }} />
              </div>

              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#D8D5CE', marginBottom: 7 }}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@studio.co"
                style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 9999, padding: '13px 20px', color: '#F7F4EF', fontSize: 14, marginBottom: 14 }}
              />
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#D8D5CE', marginBottom: 7 }}>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 9999, padding: '13px 20px', color: '#F7F4EF', fontSize: 14, marginBottom: 20 }}
              />
              {error && <p style={{ color: '#FF9A9A', fontSize: 12.5, margin: '0 0 14px' }}>{error}</p>}
              {checkEmail && !error && (
                <p style={{ color: '#FF8A5C', fontSize: 12.5, margin: '0 0 14px' }}>Compte créé — vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.</p>
              )}

              <button
                onClick={submitAuth}
                disabled={submitting}
                style={{ width: '100%', background: '#fff', color: '#101012', border: 'none', padding: 13, borderRadius: 9999, fontFamily: 'Hanken Grotesk', fontWeight: 500, fontSize: 14.5, cursor: submitting ? 'default' : 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,.3)', opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Un instant…' : authTab === 'signup' ? "S'inscrire par e-mail" : 'Se connecter'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 11.5, color: '#504F55', margin: '16px 0 0', lineHeight: 1.5 }}>
                En continuant, tu acceptes les <a href="#">Conditions</a> et la <a href="#">Politique de confidentialité</a>.
              </p>
            </div>
          )}

          {authStep === 1 && (
            <div style={{ animation: 'fadeUp .3s ease both' }}>
              <h1 style={{ fontFamily: 'Hanken Grotesk,sans-serif', fontWeight: 600, fontSize: 21, margin: '0 0 6px', textAlign: 'center' }}>Connecte un réseau</h1>
              <p style={{ color: '#8B8B92', fontSize: 13.5, textAlign: 'center', margin: '0 0 22px' }}>Cadence publiera directement sur ce compte. Tu peux en ajouter d'autres plus tard.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={cardStyle(connected.yt)}>
                  <span style={{ width: 42, height: 42, borderRadius: 11, background: '#FF0033', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <YoutubeIcon />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>YouTube Shorts</div>
                    <div style={{ fontSize: 12, color: '#8B8B92' }}>{connected.yt ? '@cadence.daily · connecté' : 'Publier des Shorts automatiquement'}</div>
                  </div>
                  <button onClick={() => !connected.yt && connect('yt')} style={netBtnStyle(ytState)}>
                    {ytState === 'connected' ? '✓ Connecté' : ytState === 'connecting' ? 'Connexion…' : 'Connecter'}
                  </button>
                </div>
                <div style={cardStyle(connected.tt)}>
                  <span style={{ width: 42, height: 42, borderRadius: 11, background: '#000', border: '1px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <TiktokIcon />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>TikTok</div>
                    <div style={{ fontSize: 12, color: '#8B8B92' }}>{connected.tt ? '@cadence.daily · connecté' : 'Publier des vidéos automatiquement'}</div>
                  </div>
                  <button onClick={() => !connected.tt && connect('tt')} style={netBtnStyle(ttState)}>
                    {ttState === 'connected' ? '✓ Connecté' : ttState === 'connecting' ? 'Connexion…' : 'Connecter'}
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 16, fontSize: 11.5, color: '#504F55', display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center' }}>
                <Icon name="lock" size={13} /> Connexion sécurisée via OAuth · aucun mot de passe stocké
              </div>
              <button
                onClick={() => anyConn && setAuthStep(2)}
                style={{
                  width: '100%',
                  marginTop: 20,
                  background: anyConn ? '#fff' : 'rgba(255,255,255,.08)',
                  color: anyConn ? '#101012' : '#6E6E74',
                  border: 'none',
                  padding: 13,
                  borderRadius: 9999,
                  fontFamily: 'Hanken Grotesk',
                  fontWeight: 500,
                  fontSize: 14.5,
                  cursor: anyConn ? 'pointer' : 'default',
                  boxShadow: anyConn ? '0 4px 16px rgba(0,0,0,.3)' : 'none',
                }}
              >
                {anyConn ? 'Continuer →' : 'Connecte un réseau pour continuer'}
              </button>
            </div>
          )}

          {authStep === 2 && (
            <div style={{ textAlign: 'center', animation: 'fadeUp .3s ease both', padding: '8px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: '#34D399', color: '#04160E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 12px 30px rgba(52,211,153,.4)' }}>
                <Icon name="check" size={30} strokeWidth={2.6} />
              </div>
              <h1 style={{ fontFamily: 'Hanken Grotesk,sans-serif', fontWeight: 600, fontSize: 22, margin: '0 0 8px' }}>Tout est prêt 🎬</h1>
              <p style={{ color: '#8B8B92', fontSize: 14, margin: '0 0 24px', lineHeight: 1.5 }}>Ton studio est configuré. Choisis une niche et Cadence produira ta première vidéo en moins d'une minute.</p>
              <button onClick={finish} style={{ width: '100%', background: '#fff', color: '#101012', border: 'none', padding: 14, borderRadius: 9999, fontFamily: 'Hanken Grotesk', fontWeight: 500, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,.3)' }}>
                Accéder au tableau de bord →
              </button>
            </div>
          )}
        </div>

        {authStep === 0 && (
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <button onClick={() => { enterDemoMode(); onEnterApp(); }} style={{ background: 'none', border: 'none', color: '#6E6E74', fontFamily: 'Hanken Grotesk', fontSize: 12.5, cursor: 'pointer' }}>
              Voir la démo sans compte →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
