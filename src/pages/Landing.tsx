import { Link } from 'react-router-dom';
import { Icon, YoutubeIcon, TiktokIcon } from '../components/Icon';
import { LogoBadge } from '../components/Logo';
import { STAGES } from '../data/niches';
import { PLANS } from '../data/mock';
import '../styles/landing.css';

const HERO_HOOKS = ['Personne ne viendra te sauver.', 'Ton cerveau brûle 20% de tes calories.', 'La règle des 2 minutes qui change tout.'];

const FEATURES: { icon: string; title: string; desc: string }[] = [
  { icon: 'bulb', title: 'Niches & idées IA', desc: "Pars d'une niche prête à l'emploi ou décris ton idée en texte libre : Cadence l'associe à un hook et un script complet." },
  { icon: 'caption', title: 'Sous-titres qui collent', desc: 'Karaoké, bold, néon ou pilule — générés et synchronisés automatiquement, dans ta police et tes couleurs.' },
  { icon: 'mic', title: 'Voix & musique', desc: 'Quatre voix multilingues, réglables en vitesse et tonalité, avec musique de fond et fondus automatiques.' },
  { icon: 'check', title: 'Validation avant publication', desc: 'Active le mode validation pour approuver chaque vidéo, ou laisse Cadence publier seule, à ton heure.' },
  { icon: 'cal', title: "Calendrier & file d'attente", desc: 'Visualise tout ton planning de publication et ajuste les horaires en un clic.' },
  { icon: 'trend', title: 'Analytics claires', desc: "Vues, likes, meilleurs horaires : sais ce qui marche sans ouvrir cinq tableaux de bord." },
];

const STATS = [
  { value: '< 1 min', label: 'pour générer une vidéo prête à publier' },
  { value: '2 réseaux', label: 'YouTube Shorts et TikTok connectés automatiquement' },
  { value: '0', label: 'minute passée dans un logiciel de montage' },
];

export function Landing() {
  return (
    <div className="lp">
      <nav className="lp-nav">
        <div className="lp-shell lp-nav-row">
          <div className="lp-footer-brand">
            <LogoBadge size={30} />
            Cadence
          </div>
          <div className="lp-nav-links">
            <a href="#pipeline">Comment ça marche</a>
            <a href="#features">Fonctionnalités</a>
            <a href="#pricing">Tarifs</a>
          </div>
          <div className="lp-nav-actions">
            <Link to="/app" className="lp-btn lp-btn-ghost">
              Se connecter
            </Link>
            <Link to="/app" className="lp-btn lp-btn-primary">
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      <header className="lp-hero">
        <div className="lp-shell lp-hero-grid">
          <div>
            <span className="lp-eyebrow">Contenu quotidien, en pilote automatique</span>
            <h1 className="lp-h1">
              Publie tous les jours.
              <br />
              <em>N'ouvre jamais</em> de logiciel de montage.
            </h1>
            <p className="lp-lead">
              Cadence choisit un sujet dans ta niche, écrit le script, génère la voix et les visuels, monte les sous-titres — et programme la publication. Toi, tu valides ou tu laisses filer.
            </p>
            <div className="lp-hero-actions">
              <Link to="/app" className="lp-btn lp-btn-primary" style={{ padding: '15px 28px', fontSize: 15 }}>
                Essayer gratuitement →
              </Link>
              <a href="#pipeline" className="lp-btn lp-btn-outline">
                Voir comment ça marche
              </a>
            </div>
            <div className="lp-hero-note" style={{ marginBottom: 22 }}>
              Aucune carte bancaire nécessaire · Studio configuré en 2 minutes
            </div>
            <div className="lp-platform-row">
              Publie directement sur
              <span className="lp-platform-chip">
                <YoutubeIcon size={13} /> YouTube Shorts
              </span>
              <span className="lp-platform-chip">
                <TiktokIcon size={12} /> TikTok
              </span>
            </div>
          </div>

          <div className="lp-device-wrap">
            <div className="lp-device-glow" />
            <div className="lp-device">
              <div className="lp-device-chrome">
                <span className="lp-device-tag">Motivation</span>
                <span className="lp-device-tag">9:16</span>
              </div>
              <div className="lp-device-hooks">
                {HERO_HOOKS.map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>
              <div className="lp-device-wave">
                {Array.from({ length: 11 }).map((_, i) => (
                  <i key={i} style={{ height: 20, animationDelay: `${i * 0.08}s` }} />
                ))}
              </div>
              <div className="lp-device-caption">
                <span>sans effort.</span>
              </div>
              <div className="lp-device-badge">
                <span className="lp-badge-dot" style={{ background: '#FF0033' }}>
                  <YoutubeIcon size={12} />
                </span>
                <span className="lp-badge-dot" style={{ background: '#000', border: '1px solid rgba(255,255,255,.25)' }}>
                  <TiktokIcon size={11} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="lp-section" id="pipeline">
        <div className="lp-shell">
          <div className="lp-section-head">
            <p className="lp-eyebrow-sm">Le pipeline</p>
            <h2 className="lp-h2">Cinq étapes, une seule commande.</h2>
            <p className="lp-section-sub">Tu choisis une niche ou tapes une idée. Cadence s'occupe du reste, du script au fichier prêt à publier.</p>
          </div>
          <div className="lp-pipeline">
            {STAGES.map((s) => (
              <div className="lp-pipeline-step" key={s.key}>
                <div className="lp-pipeline-icon">
                  <Icon name={s.icon as any} size={20} />
                </div>
                <div className="lp-pipeline-name">{s.name}</div>
                <div className="lp-pipeline-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section" id="features">
        <div className="lp-shell">
          <div className="lp-section-head">
            <p className="lp-eyebrow-sm">Sous le capot</p>
            <h2 className="lp-h2">Pensé pour publier sans y penser.</h2>
            <p className="lp-section-sub">Chaque réglage existe pour une raison : garder ta voix, ton style, et ton rythme — sans que tu aies à y toucher chaque jour.</p>
          </div>
          <div className="lp-features">
            {FEATURES.map((f) => (
              <div className="lp-feature" key={f.title}>
                <div className="lp-feature-icon">
                  <Icon name={f.icon as any} size={18} />
                </div>
                <div className="lp-feature-title">{f.title}</div>
                <div className="lp-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-shell">
          <div className="lp-stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="lp-stat-value">{s.value}</div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section" id="pricing">
        <div className="lp-shell">
          <div className="lp-section-head">
            <p className="lp-eyebrow-sm">Tarifs</p>
            <h2 className="lp-h2">Commence gratuitement, monte en cadence.</h2>
            <p className="lp-section-sub">Change de plan à tout moment. Aucun engagement.</p>
          </div>
          <div className="lp-pricing">
            {PLANS.map((p) => (
              <div key={p.id} className={`lp-plan${p.popular ? ' lp-plan-popular' : ''}`}>
                {p.popular && <span className="lp-plan-badge">POPULAIRE</span>}
                <div className="lp-plan-name">{p.name}</div>
                <div className="lp-plan-price">
                  <strong>{p.price}</strong>
                  <span>{p.period}</span>
                </div>
                <div className="lp-plan-feats">
                  {p.feats.map((f) => (
                    <div className="lp-plan-feat" key={f}>
                      <Icon name="check" size={14} strokeWidth={2.4} />
                      {f}
                    </div>
                  ))}
                </div>
                <Link to="/app" className={`lp-btn ${p.popular ? 'lp-btn-primary' : 'lp-btn-outline'}`} style={{ width: '100%' }}>
                  Choisir {p.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-cta">
        <div className="lp-cta-glow" />
        <div className="lp-shell">
          <h2>Ta prochaine vidéo se génère pendant que tu lis ceci.</h2>
          <p>Rejoins Cadence et publie ta première vidéo en moins d'une minute.</p>
          <Link to="/app" className="lp-btn lp-btn-primary" style={{ padding: '15px 30px', fontSize: 15 }}>
            Essayer gratuitement →
          </Link>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-shell lp-footer-row">
          <div className="lp-footer-brand">
            <LogoBadge size={26} />
            Cadence
          </div>
          <div className="lp-footer-links">
            <a href="#pipeline">Comment ça marche</a>
            <a href="#features">Fonctionnalités</a>
            <a href="#pricing">Tarifs</a>
            <Link to="/app">Connexion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
