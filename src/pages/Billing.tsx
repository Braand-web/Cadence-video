import { Icon } from '../components/Icon';
import { USAGE, PLANS, INVOICES } from '../data/mock';
import { useAuth } from '../lib/AuthContext';

export function Billing() {
  const { profile } = useAuth();
  const planName = profile?.plan ? profile.plan[0].toUpperCase() + profile.plan.slice(1) : 'Creator';

  return (
    <div style={{ animation: 'fadeUp .35s ease both', maxWidth: 960 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 26 }}>
        <div style={{ border: '1px solid rgba(124,92,255,.3)', borderRadius: 18, padding: 22, background: 'linear-gradient(135deg,rgba(124,92,255,.14),rgba(124,92,255,.06))' }}>
          <div style={{ fontSize: 12, color: '#A78BFA', fontWeight: 700, letterSpacing: '.04em' }}>PLAN ACTUEL</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
            <span style={{ fontFamily: 'Manrope', fontSize: 26, fontWeight: 600 }}>{planName}</span>
            <span style={{ color: '#8A8A9C', fontSize: 13 }}>· 19€/mois</span>
          </div>
          <div style={{ fontSize: 12.5, color: '#8A8A9C', marginTop: 6 }}>Renouvellement le 1ᵉʳ août 2026</div>
          <button style={{ marginTop: 16, background: 'rgba(255,255,255,.08)', color: '#F3F3F6', border: '1px solid rgba(255,255,255,.15)', padding: '10px 18px', borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            Gérer l'abonnement
          </button>
        </div>
        <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 22, background: 'rgba(255,255,255,.02)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Consommation ce mois</div>
          {USAGE.map((u) => (
            <div key={u.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
                <span style={{ color: '#B9B9C8', fontWeight: 600 }}>{u.label}</span>
                <span style={{ color: '#8A8A9C' }}>{u.val}</span>
              </div>
              <div style={{ height: 7, borderRadius: 8, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 8, background: u.color, width: u.pct }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 17, fontWeight: 600, margin: '0 0 16px' }}>Changer de plan</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 30 }}>
        {PLANS.map((p) => (
          <div key={p.id} style={{ position: 'relative', borderRadius: 18, padding: 24, background: p.cur ? 'linear-gradient(180deg,rgba(124,92,255,.12),rgba(255,255,255,.02))' : 'rgba(255,255,255,.02)', border: `1px solid ${p.cur ? 'rgba(124,92,255,.5)' : 'rgba(255,255,255,.09)'}` }}>
            {p.popular && (
              <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#7C5CFF,#9D6BFF)', color: '#fff', fontSize: 10.5, fontWeight: 700, padding: '3px 12px', borderRadius: 20 }}>
                POPULAIRE
              </span>
            )}
            <div style={{ fontFamily: 'Manrope', fontSize: 17, fontWeight: 600 }}>{p.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '10px 0 16px' }}>
              <span style={{ fontFamily: 'Manrope', fontSize: 32, fontWeight: 600 }}>{p.price}</span>
              <span style={{ color: '#8A8A9C', fontSize: 13 }}>{p.period}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 18 }}>
              {p.feats.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#B9B9C8' }}>
                  <span style={{ display: 'flex', color: '#34D399', flex: 'none' }}>
                    <Icon name="check" size={15} strokeWidth={2.4} />
                  </span>
                  {f}
                </div>
              ))}
            </div>
            <button
              disabled={p.cur}
              style={
                p.cur
                  ? { width: '100%', background: 'rgba(124,92,255,.16)', color: '#A78BFA', border: '1px solid rgba(124,92,255,.4)', padding: 11, borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, cursor: 'default' }
                  : { width: '100%', background: 'rgba(255,255,255,.06)', color: '#F3F3F6', border: '1px solid rgba(255,255,255,.14)', padding: 11, borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }
              }
            >
              {p.cur ? 'Plan actuel' : 'Choisir'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 22, background: 'rgba(255,255,255,.02)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Moyen de paiement</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 14 }}>
            <div style={{ width: 46, height: 30, borderRadius: 6, background: 'linear-gradient(135deg,#1a1a2e,#16213e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 11, fontStyle: 'italic', flex: 'none' }}>VISA</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>•••• •••• •••• 4242</div>
              <div style={{ fontSize: 11.5, color: '#8A8A9C' }}>Expire 08/27</div>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#A78BFA', fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Modifier</button>
          </div>
        </div>
        <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 22, background: 'rgba(255,255,255,.02)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Factures</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {INVOICES.map((i) => (
              <div key={i.date} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                <span style={{ flex: 1, fontSize: 13, color: '#B9B9C8' }}>{i.date}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{i.amount}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399', background: 'rgba(52,211,153,.14)', padding: '2px 9px', borderRadius: 20 }}>{i.status}</span>
                <button style={{ background: 'none', border: 'none', color: '#7E7E92', cursor: 'pointer', display: 'flex' }}>
                  <Icon name="download" size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
