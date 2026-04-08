'use client';

export default function HomePage() {
  return (
    <>
      <style>{`
        :root {
          --cream: #f5f0e8;
          --charcoal: #1a1c1c;
          --amber: #ffc107;
          --amber-dim: #fabd00;
          --warm-grey: #4f4632;
          --muted: #827660;
        }
        .bg-cream { background-color: var(--cream); }
        .bg-charcoal { background-color: var(--charcoal); }
        .bg-amber { background-color: var(--amber); }
        .text-cream { color: var(--cream); }
        .text-amber { color: var(--amber); }
        .text-warm-grey { color: var(--warm-grey); }
        .border-amber { border-color: var(--amber); }
        .step-number { color: var(--amber); font-size: 2.5rem; font-weight: 900; line-height: 1; }
        .glass-card {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
      {/* Nav */}
      <header className="fixed top-0 w-full z-50" style={{backgroundColor: 'var(--cream)'}}>
        <nav className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined" style={{color: 'var(--amber)', fontVariationSettings: "'FILL' 1"}}>security</span>
            <span className="text-xl font-black tracking-tighter" style={{color: 'var(--charcoal)'}}>Hatsafe</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#" className="text-sm font-medium" style={{color: 'var(--charcoal)', opacity: 0.7}}>Products</a>
            <a href="#" className="text-sm font-medium" style={{color: 'var(--charcoal)', opacity: 0.7}}>Compliance</a>
            <a href="#" className="text-sm font-medium" style={{color: 'var(--charcoal)', opacity: 0.7}}>Pricing</a>
            <a href="#" className="text-sm font-medium" style={{color: 'var(--charcoal)', opacity: 0.7}}>Sign in</a>
          </div>
          <a href="#" className="px-5 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-transform" style={{backgroundColor: 'var(--amber)', color: 'var(--charcoal)'}}>
            Get started
          </a>
        </nav>
      </header>
      <main className="pt-20" style={{backgroundColor: 'var(--cream)'}}>
        {/* Hero */}
        <section className="px-6 md:px-12 pt-20 pb-16 max-w-7xl mx-auto text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{backgroundColor: 'rgba(255,193,7,0.15)', color: 'var(--warm-grey)'}}>
            Safety Compliance Reimagined
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 max-w-4xl mx-auto leading-tight" style={{color: 'var(--charcoal)'}}>
            Stop chasing certificates in{' '}
            <em>spreadsheets</em>{' '}
            and inboxes
          </h1>
          <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{color: 'var(--warm-grey)'}}>
            HatSafe centralises your compliance documents, automates renewal tracking, and keeps your workforce audit-ready at all times.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="#" className="px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-95" style={{backgroundColor: 'var(--amber)', color: 'var(--charcoal)'}}>
              Get Started Free
            </a>
            <a href="#" className="px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all" style={{borderColor: 'var(--charcoal)', color: 'var(--charcoal)'}}>
              Book a Demo
            </a>
          </div>
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4" style={{borderColor: 'rgba(26,28,28,0.1)'}}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyRpK3wA0hEhKr27PYtd7C9oFg5sXorxP7QDMgHxUI_np3f_kPMyjemTj-Wm_KWXMa-nd5oUTkGsOvcXLl0KbhxVEo_o0HpEnygmXEKEH3Mq0Z0mHBj1jINd7ZEutobwUfLzmRxjehxMFZ6Q8-xuzOtZT3Y5QAWUzVzdVhjIg0P5U9THAeZ1yAE7ECyCL8W6mG-UvVWMFawb8Ul0rYabSpoyXtM5VgHf3RM1CAC0KfFDvJFwSJylLGUvPYzLYv5UOR8vLa9kpQiVI"
                alt="HatSafe compliance dashboard"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden md:block glass-card p-5 rounded-xl shadow-xl border" style={{borderColor: 'rgba(255,255,255,0.3)', maxWidth: '220px'}}>
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined" style={{color: 'var(--amber)', fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-tight" style={{color: 'var(--warm-grey)'}}>Status</p>
                  <p className="font-bold text-sm" style={{color: 'var(--charcoal)'}}>100% Audit Ready</p>
                </div>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{backgroundColor: 'rgba(26,28,28,0.1)'}}>
                <div className="h-full w-full rounded-full" style={{backgroundColor: 'var(--amber)'}}></div>
              </div>
            </div>
          </div>
        </section>
        {/* Social Proof */}
        <section className="py-12 px-6" style={{backgroundColor: 'rgba(26,28,28,0.04)'}}>
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs font-bold uppercase tracking-widest mb-8" style={{color: 'var(--muted)'}}>Trusted by 500+ industrial leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16" style={{opacity: 0.4, filter: 'grayscale(1)'}}>
              <span className="text-xl font-black italic tracking-tighter" style={{color: 'var(--charcoal)'}}>CONSTRUCTO</span>
              <span className="text-xl font-black tracking-widest" style={{color: 'var(--charcoal)'}}>SAFETYFIRST</span>
              <span className="text-xl font-black" style={{color: 'var(--charcoal)'}}>IRONWORKS</span>
              <span className="text-xl font-black tracking-tight" style={{color: 'var(--charcoal)'}}>BUILD-TECH</span>
              <span className="text-xl font-black italic" style={{color: 'var(--charcoal)'}}>INDUS-CORP</span>
            </div>
          </div>
        </section>
        {/* Problem — dark */}
        <section className="py-24 px-6 bg-charcoal">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-cream leading-tight">
                Compliance gets messy fast when<br className="hidden md:block" /> everything lives in different places
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Fragmented Data', desc: 'Certificates lost in personal email inboxes and disparate local drives. No single source of truth.' },
                { title: 'Silent Expirations', desc: 'Missing a renewal date leads to costly site closures, fines, and legal liability.' },
                { title: 'Admin Fatigue', desc: 'Hours wasted manually updating spreadsheets instead of managing sites and teams.' },
              ].map((item) => (
                <div key={item.title} className="p-8 rounded-xl border" style={{backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}>
                  <span className="material-symbols-outlined mb-4 block" style={{color: '#ba1a1a'}}>cancel</span>
                  <h3 className="text-xl font-bold mb-2 text-cream">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color: 'rgba(245,240,232,0.6)'}}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Solution */}
        <section className="py-24 px-6 bg-cream">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{color: 'var(--warm-grey)'}}>A simpler way to stay compliant</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6" style={{color: 'var(--charcoal)'}}>
                One place to see current status, expiring documents, and missing records.
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{color: 'var(--warm-grey)'}}>
                Stop chasing documents across email threads, shared drives, and spreadsheets. HatSafe gives every team a single, searchable compliance record.
              </p>
              <a href="#" className="inline-flex items-center gap-2 font-bold" style={{color: 'var(--charcoal)'}}>
                See how it works <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl border" style={{borderColor: 'rgba(26,28,28,0.1)'}}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQDzCNSijJ87hb7qJGXqlpvR_fk5V4BepX8RbZ4fjHxqYQRCvoQLumFJj8RZ7NySVc31q7WmgVoSr5yayDqwpG2MHjd-dT3HGqoOG0fbN4dZAsaQiIF1Jy7OviBrC4alqYmIjdgqqLScQYjaWliEsx0GkVO5L_zw_GnD1F_FBDyS2vi0eb52LHvKu_QOS5UDwz6rVUzScVc7AUebhJPV-HQTUhYu2ar4xChVBDdfX6PgookHmaPOIsF2OI5NMZVuTWnVA769rLUQA"
                alt="HatSafe document management"
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>
        {/* Steps — dark */}
        <section className="py-24 px-6 bg-charcoal">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-cream">
                Four steps from incoming paperwork<br className="hidden md:block" /> to controlled compliance
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { n: '01', title: 'Upload', desc: 'Drag and drop any certificate or document. AI extracts the key data automatically.' },
                { n: '02', title: 'Organise', desc: 'Automated tagging groups documents by worker, project, site, or equipment type.' },
                { n: '03', title: 'Track', desc: 'Smart alerts notify you and your workers 90, 60, and 30 days before expiry.' },
                { n: '04', title: 'Act', desc: 'Generate one-click audit reports for site inspections, tenders, and regulators.' },
              ].map((step) => (
                <div key={step.n} className="p-8 rounded-xl border" style={{backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}>
                  <div className="step-number mb-4">{step.n}</div>
                  <h3 className="text-xl font-bold mb-2 text-cream">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color: 'rgba(245,240,232,0.6)'}}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Benefits */}
        <section className="py-24 px-6 bg-cream">
          <div className="max-w-7xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{color: 'var(--warm-grey)'}}>Better visibility, less admin, stronger control</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-12" style={{color: 'var(--charcoal)'}}>Built for the architect, the site manager, and the auditor.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: 'hub', title: 'One source of truth', desc: 'Every document, every worker, every certificate in one searchable place. No more hunting through folders and inboxes.' },
                { icon: 'notifications_active', title: 'Expiry visibility', desc: 'Never get caught off guard. Automated alerts reach the right people weeks before anything expires.' },
                { icon: 'schedule', title: 'Less admin time', desc: 'AI extracts data from uploaded documents automatically. Stop manually keying in dates and names.' },
                { icon: 'security', title: 'Better operations control', desc: 'Real-time compliance scores and audit-ready reports mean you are always prepared for inspections.' },
              ].map((b) => (
                <div key={b.title} className="p-8 rounded-xl border" style={{backgroundColor: 'rgba(26,28,28,0.04)', borderColor: 'rgba(26,28,28,0.08)'}}>
                  <span className="material-symbols-outlined text-3xl mb-4 block" style={{color: 'var(--amber)'}}>{b.icon}</span>
                  <h3 className="text-xl font-bold mb-2" style={{color: 'var(--charcoal)'}}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color: 'var(--warm-grey)'}}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Testimonials */}
        <section className="py-24 px-6 bg-cream">
          <div className="max-w-7xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{color: 'var(--warm-grey)'}}>Early customer language, presented with restraint</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { quote: 'HatSafe reduced our administrative overhead by 60%. We no longer worry about site inspections because we know we are compliant.', name: 'Mark Stevenson', role: 'Site Director, BuildCorp UK' },
                { quote: 'The automated alerts are a game changer. We went from 12% expired documents to 0% in just three months.', name: 'Sarah Jenkins', role: 'Compliance Manager, IronWorks' },
                { quote: 'Elegant and powerful. It is the first safety software our site managers actually enjoy using. Highly recommended.', name: 'David Chen', role: 'Operations Lead, SafetyFirst' },
              ].map((t) => (
                <div key={t.name} className="p-8 rounded-xl border flex flex-col gap-6" style={{backgroundColor: 'rgba(26,28,28,0.04)', borderColor: 'rgba(26,28,28,0.08)'}}>
                  <p className="text-base leading-relaxed italic flex-1" style={{color: 'var(--charcoal)'}}>"{t.quote}"</p>
                  <div>
                    <p className="font-bold text-sm" style={{color: 'var(--charcoal)'}}>{t.name}</p>
                    <p className="text-xs" style={{color: 'var(--warm-grey)'}}>{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Pricing */}
        <section className="py-24 px-6 bg-cream">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2" style={{color: 'var(--charcoal)'}}>Simple pricing from £49 per month</h2>
              <p style={{color: 'var(--warm-grey)'}}>One pricing model for entire teams. No per-seat surprises.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              <div className="p-8 rounded-xl border flex flex-col gap-6" style={{borderColor: 'rgba(26,28,28,0.12)'}}>
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{color: 'var(--charcoal)'}}>Starter</h3>
                  <div className="text-4xl font-black mb-1" style={{color: 'var(--charcoal)'}}>£49<span className="text-base font-normal" style={{color: 'var(--warm-grey)'}}>/mo</span></div>
                  <p className="text-sm" style={{color: 'var(--warm-grey)'}}>For small teams getting started.</p>
                </div>
                <ul className="flex flex-col gap-3 text-sm flex-1" style={{color: 'var(--charcoal)'}}>
                  {['Up to 25 workers', 'Basic expiry alerts', 'Email support', 'Document storage'].map(f => (
                    <li key={f} className="flex items-center gap-2"><span className="material-symbols-outlined text-sm" style={{color: 'var(--amber)'}}>check</span>{f}</li>
                  ))}
                </ul>
                <a href="#" className="mt-auto w-full py-3 rounded-xl font-bold text-center border-2" style={{borderColor: 'var(--charcoal)', color: 'var(--charcoal)'}}>Choose Starter</a>
              </div>
              <div className="p-8 rounded-xl flex flex-col gap-6 relative" style={{backgroundColor: 'var(--charcoal)', transform: 'scale(1.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'}}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest" style={{backgroundColor: 'var(--amber)', color: 'var(--charcoal)'}}>Most Popular</div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-cream">Professional</h3>
                  <div className="text-4xl font-black mb-1 text-cream">£99<span className="text-base font-normal" style={{color: 'rgba(245,240,232,0.5)'}}>/mo</span></div>
                  <p className="text-sm" style={{color: 'rgba(245,240,232,0.6)'}}>For growing teams and site managers.</p>
                </div>
                <ul className="flex flex-col gap-3 text-sm flex-1 text-cream">
                  {['Up to 100 workers', 'SMS + Email alerts', 'AI document extraction', 'Advanced analytics', 'Priority support'].map(f => (
                    <li key={f} className="flex items-center gap-2"><span className="material-symbols-outlined text-sm" style={{color: 'var(--amber)'}}>check</span>{f}</li>
                  ))}
                </ul>
                <a href="#" className="mt-auto w-full py-3 rounded-xl font-bold text-center" style={{backgroundColor: 'var(--amber)', color: 'var(--charcoal)'}}>Choose Professional</a>
              </div>
              <div className="p-8 rounded-xl border flex flex-col gap-6" style={{borderColor: 'rgba(26,28,28,0.12)'}}>
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{color: 'var(--charcoal)'}}>Enterprise</h3>
                  <div className="text-4xl font-black mb-1" style={{color: 'var(--charcoal)'}}>Custom</div>
                  <p className="text-sm" style={{color: 'var(--warm-grey)'}}>For large-scale operations.</p>
                </div>
                <ul className="flex flex-col gap-3 text-sm flex-1" style={{color: 'var(--charcoal)'}}>
                  {['Unlimited workers', 'Dedicated account manager', 'Custom API integrations', 'SSO & advanced security', 'SLA guarantee'].map(f => (
                    <li key={f} className="flex items-center gap-2"><span className="material-symbols-outlined text-sm" style={{color: 'var(--amber)'}}>check</span>{f}</li>
                  ))}
                </ul>
                <a href="#" className="mt-auto w-full py-3 rounded-xl font-bold text-center border-2" style={{borderColor: 'var(--charcoal)', color: 'var(--charcoal)'}}>Contact Sales</a>
              </div>
            </div>
          </div>
        </section>
        {/* CTA — dark */}
        <section className="py-24 px-6 bg-charcoal">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-cream">Book a demo and talk through your setup</h2>
            <p className="text-lg mb-10" style={{color: 'rgba(245,240,232,0.6)'}}>We will walk you through how HatSafe fits your team, your certifications, and your compliance requirements.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="px-8 py-4 rounded-xl font-bold text-lg" style={{backgroundColor: 'var(--amber)', color: 'var(--charcoal)'}}>Book a Demo</a>
              <a href="#" className="px-8 py-4 rounded-xl font-bold text-lg border-2 text-cream" style={{borderColor: 'rgba(245,240,232,0.3)'}}>Start Free</a>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="py-16 px-6 md:px-12 bg-charcoal border-t" style={{borderColor: 'rgba(255,255,255,0.08)'}}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined" style={{color: 'var(--amber)', fontVariationSettings: "'FILL' 1"}}>security</span>
              <span className="text-lg font-black text-cream tracking-tighter">Hatsafe</span>
            </div>
            <p className="text-xs uppercase tracking-widest" style={{color: 'rgba(245,240,232,0.4)'}}>Industrial Safety &amp; Compliance Operating System</p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm text-cream">Product</h4>
            <a href="#" className="text-xs uppercase tracking-widest" style={{color: 'rgba(245,240,232,0.4)'}}>Platform</a>
            <a href="#" className="text-xs uppercase tracking-widest" style={{color: 'rgba(245,240,232,0.4)'}}>Safety Standards</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm text-cream">Legal</h4>
            <a href="#" className="text-xs uppercase tracking-widest" style={{color: 'rgba(245,240,232,0.4)'}}>Privacy Policy</a>
            <a href="#" className="text-xs uppercase tracking-widest" style={{color: 'rgba(245,240,232,0.4)'}}>Terms of Service</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm text-cream">Support</h4>
            <a href="#" className="text-xs uppercase tracking-widest" style={{color: 'rgba(245,240,232,0.4)'}}>Contact Support</a>
            <p className="text-xs uppercase tracking-widest mt-4" style={{color: 'rgba(245,240,232,0.3)'}}>© 2025 HatSafe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
