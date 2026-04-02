'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  SparklesIcon,
  BellAlertIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UsersIcon,
  TruckIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowDownTrayIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

// ── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    Icon: SparklesIcon,
    title: 'AI Document Extraction',
    desc: 'Upload any certificate and our AI reads it instantly — expiry dates, cert numbers, issuing bodies. Extracted automatically and filed in the right place. No data entry.',
  },
  {
    Icon: UsersIcon,
    title: 'People, Vehicles & Equipment',
    desc: 'Track compliance across your entire operation. Workers, fleet vehicles, plant and equipment all managed from a single dashboard.',
  },
  {
    Icon: BellAlertIcon,
    title: 'Proactive Expiry Alerts',
    desc: 'Automated email reminders at 30, 14, and 7 days before anything expires. Your team gets notified. Renewals get booked.',
  },
  {
    Icon: ChartBarIcon,
    title: 'Live Compliance Dashboard',
    desc: "See your compliance status at a glance. Instant view of what's current, expiring, and overdue across your whole organisation.",
  },
  {
    Icon: CalendarDaysIcon,
    title: 'Compliance Calendar',
    desc: 'Every upcoming renewal in one calendar. Export to CSV or sync with Google Calendar, Outlook, or Apple Calendar.',
  },
  {
    Icon: DocumentTextIcon,
    title: 'Document Versioning',
    desc: 'Full audit history of every certificate — who uploaded it, when, and what replaced what. Audit-ready at any time.',
  },
  {
    Icon: ShieldCheckIcon,
    title: 'Built for Construction',
    desc: 'Pre-configured for CSCS, IPAF, PASMA, LOLER, MOT, Insurance, First Aid, SMSTS, and more. Works across all trades.',
  },
];

const stats = [
  { value: '94%',   label: 'reduction in missed renewals in first 3 months' },
  { value: '4.2h',  label: 'saved per week on compliance admin, per manager' },
  { value: '£1,200+', label: 'average annual saving per business' },
  { value: 'Zero',  label: 'HSE compliance notices received by customers' },
];

const testimonials = [
  {
    quote: 'We had a subcontractor on site for three weeks before anyone noticed his IPAF card had expired. With HatSafe, that conversation happens before they even arrive.',
    name: 'Site Manager',
    company: '£8m civil engineering business',
  },
  {
    quote: 'The AI reads the documents better than I do. It picked up a renewal date buried in small print on an insurance certificate — I would have missed it completely.',
    name: 'Fleet & Compliance Manager',
    company: 'Plant hire company',
  },
  {
    quote: 'I used to spend a full day every month chasing certificates. Now I spend 20 minutes reviewing what HatSafe has flagged. That time goes back into actual work.',
    name: 'Operations Manager',
    company: 'Specialist groundworks contractor',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '£49',
    period: '/month',
    desc: 'For small teams getting started',
    features: ['50 people', '20 vehicles', '10 assets', '500 documents', 'Email support'],
    cta: 'Start Free Trial',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '£99',
    period: '/month',
    desc: 'Most popular for growing businesses',
    features: ['200 people', '100 vehicles', '50 assets', '2,000 documents', 'Priority support', 'Scheduled reports'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Business',
    price: '£199',
    period: '/month',
    desc: 'For large or multi-site operations',
    features: ['Unlimited people & vehicles', 'Unlimited assets & documents', 'API access', 'Dedicated account manager', 'Custom reporting'],
    cta: 'Start Free Trial',
    highlight: false,
  },
];

const comparison = [
  { feature: 'Automatic expiry alerts',    spreadsheet: false, hatsafe: true },
  { feature: 'AI document reading',        spreadsheet: false, hatsafe: true },
  { feature: 'Works on mobile',            spreadsheet: false, hatsafe: true },
  { feature: 'Audit-ready reports',        spreadsheet: false, hatsafe: true },
  { feature: 'Document version history',   spreadsheet: false, hatsafe: true },
  { feature: 'Multi-user access',          spreadsheet: false, hatsafe: true },
  { feature: 'Calendar integration',       spreadsheet: false, hatsafe: true },
  { feature: 'Minutes to set up',          spreadsheet: false, hatsafe: true },
];

const faqs = [
  {
    q: 'Do I need to be technical to use it?',
    a: 'No. If you can use email, you can use HatSafe. Upload a document, and the AI handles everything else. Most customers are fully set up within an hour.',
  },
  {
    q: 'What types of documents does it support?',
    a: 'Any document with an expiry date. CSCS cards, IPAF, PASMA, SMSTS, LOLER inspections, MOT certificates, vehicle insurance, road tax, first aid, working at height — if it has an expiry date, we track it.',
  },
  {
    q: 'We already have a system. Can we import our data?',
    a: 'Yes. You can import existing records via CSV. Our team will help you migrate if needed — Professional and Business customers get hands-on onboarding support.',
  },
  {
    q: 'How does the AI extraction actually work?',
    a: 'When you upload a document, our AI reads the text, identifies the document type, and extracts key fields — expiry date, certificate number, issuing body, and entity name. It then matches this to the relevant person, vehicle, or asset. Confidence scores flag anything uncertain for manual review.',
  },
  {
    q: 'Is our data secure?',
    a: 'Yes. All data is encrypted in transit and at rest, with UK data residency and full row-level security. We take compliance seriously — it would be embarrassing if we didn\'t.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Month-to-month billing, no lock-in. Cancel with one click from your settings page.',
  },
];

const playbook = [
  'The true cost of compliance failures in UK construction',
  'Why spreadsheets are the single biggest risk in your process',
  'How AI document extraction works — and what it means for your admin team',
  'A step-by-step framework for auditing your current compliance gaps',
  'How to build a renewal schedule that actually works',
  'Real examples from businesses that eliminated missed renewals entirely',
  'A readiness checklist you can act on today',
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #F3F3F3' }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left"
        onClick={() => setOpen(o => !o)}>
        <span className="font-medium text-sm" style={{ color: '#1A1C1C', paddingRight: '24px' }}>{q}</span>
        <ChevronDownIcon
          className="w-4 h-4 flex-shrink-0 transition-transform"
          style={{ color: '#A3A3A3', transform: open ? 'rotate(180deg)' : 'none' }}
          strokeWidth={2} />
      </button>
      {open && (
        <p className="pb-5" style={{ fontSize: '14px', color: '#474747', lineHeight: 1.7 }}>{a}</p>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MarketingPage() {
  return (
    <div style={{ backgroundColor: '#F9F9F9', color: '#1A1C1C', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── NAV ── */}
      <nav style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid rgba(198,198,198,0.4)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', height: '64px', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#FFC107', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#1A1C1C' }}>H</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.01em' }}>HatSafe</span>
          </div>
          <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            <a href="#features" style={{ fontSize: '14px', color: '#474747', textDecoration: 'none' }}>Features</a>
            <a href="#pricing" style={{ fontSize: '14px', color: '#474747', textDecoration: 'none' }}>Pricing</a>
            <a href="#faq" style={{ fontSize: '14px', color: '#474747', textDecoration: 'none' }}>FAQ</a>
            <Link href="/login" style={{ fontSize: '14px', color: '#474747', textDecoration: 'none' }}>Sign in</Link>
            <Link href="/signup" style={{ backgroundColor: '#FFC107', color: '#1A1C1C', fontWeight: 600, fontSize: '13px', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 32px 80px' }}>
        <div style={{ maxWidth: '760px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFF8E1', border: '1px solid #FFC107', borderRadius: '4px', padding: '6px 12px', marginBottom: '32px' }}>
            <SparklesIcon style={{ width: '14px', height: '14px', color: '#92400E' }} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', color: '#92400E' }}>AI-POWERED COMPLIANCE MANAGEMENT</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#1A1C1C', marginBottom: '24px' }}>
            Your team shouldn't be on site without the right certificates.
            <span style={{ color: '#474747' }}> Most of them probably are.</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#474747', lineHeight: 1.7, marginBottom: '40px', maxWidth: '600px' }}>
            HatSafe automatically tracks every training certificate, licence, and inspection across your workforce, vehicles, and equipment. AI reads the documents. You stay compliant.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '48px' }}>
            <Link href="/signup" style={{ backgroundColor: '#FFC107', color: '#1A1C1C', fontWeight: 700, fontSize: '15px', padding: '14px 28px', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Start Free Trial — 14 days free
              <ArrowRightIcon style={{ width: '16px', height: '16px' }} strokeWidth={2.5} />
            </Link>
            <a href="#playbook" style={{ color: '#1A1C1C', fontWeight: 500, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '14px 4px' }}>
              <ArrowDownTrayIcon style={{ width: '15px', height: '15px', color: '#474747' }} strokeWidth={2} />
              Download the Free Playbook
            </a>
          </div>
          <p style={{ fontSize: '13px', color: '#A3A3A3' }}>
            No credit card required · Cancel anytime · Used by construction businesses across the UK
          </p>
        </div>

        {/* Hero image */}
        <div style={{ marginTop: '64px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0px 40px 80px rgba(0,0,0,0.12)', position: 'relative', aspectRatio: '16/9', maxHeight: '520px' }}>
          <Image src="/img-hero.png" alt="Site manager reviewing compliance on tablet at construction site" fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: '28px', left: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,193,7,0.95)', borderRadius: '4px', padding: '8px 14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A1C1C' }}>94% fewer missed renewals in the first 3 months</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ backgroundColor: '#000000', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '20px' }}>THE COST OF GETTING IT WRONG</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '24px', maxWidth: '700px' }}>
            One expired card. One HSE visit. One prosecution.
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '640px', marginBottom: '48px' }}>
            Construction businesses face a compliance burden that's growing every year. CSCS cards, IPAF licences, LOLER inspections, MOTs, insurance certificates — tracked across dozens of people, vehicles, and pieces of equipment. Usually on spreadsheets. Often on paper. Occasionally in someone's head.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
            {[
              'Workers on site with expired certifications',
              'Vehicles driven past their MOT date',
              'Equipment in use without a current inspection',
              'Managers finding out about problems after the client does',
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: '#111', padding: '28px 24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: '#FFC107', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <XMarkIcon style={{ width: '12px', height: '12px', color: '#1A1C1C' }} strokeWidth={3} />
                </div>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '32px', fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
            The average construction business has 47 compliance documents that need active renewal management. Most businesses miss at least six renewals a year.
          </p>

          {/* Team image */}
          <div style={{ marginTop: '48px', borderRadius: '6px', overflow: 'hidden', position: 'relative', height: '320px' }}>
            <Image src="/img-team.png" alt="Construction professionals reviewing compliance on site" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', color: '#A3A3A3', textTransform: 'uppercase', marginBottom: '16px' }}>HOW HATSAFE WORKS</p>
        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '64px', maxWidth: '600px' }}>
          Upload a certificate. AI does the rest.
        </h2>
        {/* Compliance image */}
        <div style={{ borderRadius: '6px', overflow: 'hidden', position: 'relative', height: '280px', marginBottom: '48px', boxShadow: '0px 20px 40px rgba(0,0,0,0.08)' }}>
          <Image src="/img-compliance.png" alt="Compliance manager reviewing certificates" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(249,249,249,0.7) 0%, transparent 60%)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px' }}>
          {[
            { step: '01', title: 'Upload', desc: 'Drag and drop a certificate, snap a photo, or email it in. HatSafe accepts PDFs, images, and scanned documents.' },
            { step: '02', title: 'AI extracts and tracks', desc: 'Our AI identifies the document type, reads the expiry date, and links it to the correct person, vehicle, or asset. No manual entry.' },
            { step: '03', title: 'Get ahead of renewals', desc: "Alerts at 30, 14, and 7 days before anything expires. Your dashboard shows exactly what's current, expiring, and overdue." },
          ].map((s) => (
            <div key={s.step} style={{ backgroundColor: '#FFFFFF', borderRadius: '6px', padding: '40px 36px', boxShadow: '0px 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(198,198,198,0.25)' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', color: '#FFC107', backgroundColor: '#FFF8E1', border: '1px solid #FFC107', borderRadius: '4px', display: 'inline-block', padding: '3px 8px', marginBottom: '20px' }}>
                STEP {s.step}
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1A1C1C', marginBottom: '12px' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: '#474747', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ backgroundColor: '#F3F3F3', padding: '96px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', color: '#A3A3A3', textTransform: 'uppercase', marginBottom: '16px' }}>BUILT FOR THE WAY YOU WORK</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '56px', maxWidth: '540px' }}>
            Everything your compliance process needs. Nothing it doesn't.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {features.map((f) => (
              <div key={f.title} style={{ backgroundColor: '#FFFFFF', borderRadius: '6px', padding: '28px', boxShadow: '0px 20px 40px rgba(0,0,0,0.03)', border: '1px solid rgba(198,198,198,0.25)', display: 'flex', gap: '16px' }}>
                <div style={{ width: '36px', height: '36px', backgroundColor: '#F9F9F9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.Icon style={{ width: '16px', height: '16px', color: '#474747' }} strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1C1C', marginBottom: '6px' }}>{f.title}</div>
                  <div style={{ fontSize: '13px', color: '#474747', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLAYBOOK ── */}
      <section id="playbook" style={{ backgroundColor: '#FFC107', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', marginBottom: '16px' }}>FREE RESOURCE</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#1A1C1C', marginBottom: '16px', lineHeight: 1.2 }}>
              The Construction Leader's Guide to AI Compliance Management
            </h2>
            <p style={{ fontSize: '15px', color: '#474747', lineHeight: 1.7, marginBottom: '28px' }}>
              A practical, no-fluff guide to transforming your compliance process using AI. Everything you need to know to get ahead — and stay ahead — of renewals.
            </p>
            <a href="#" style={{ backgroundColor: '#000000', color: '#FFFFFF', fontWeight: 700, fontSize: '14px', padding: '14px 24px', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ArrowDownTrayIcon style={{ width: '16px', height: '16px' }} strokeWidth={2} />
              Download Free Playbook
            </a>
            <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', marginTop: '12px' }}>Free. No sales calls. No drip emails.</p>
          </div>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '6px', padding: '32px' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', marginBottom: '20px' }}>WHAT'S INSIDE</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {playbook.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '18px', height: '18px', backgroundColor: '#000000', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    <CheckIcon style={{ width: '11px', height: '11px', color: '#FFC107' }} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '13px', color: '#1A1C1C', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', color: '#A3A3A3', textTransform: 'uppercase', marginBottom: '48px', textAlign: 'center' }}>WHAT BUSINESSES ARE SEEING</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2px', backgroundColor: '#F3F3F3', borderRadius: '6px', overflow: 'hidden' }}>
            {stats.map((s) => (
              <div key={s.value} style={{ backgroundColor: '#FFFFFF', padding: '40px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: '#1A1C1C', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: '#474747', marginTop: '10px', lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ backgroundColor: '#F9F9F9', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Worker + fleet images side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '48px', borderRadius: '6px', overflow: 'hidden', height: '280px' }}>
            <div style={{ position: 'relative', height: '280px' }}>
              <Image src="/img-worker.png" alt="Construction worker on site with smartphone" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} />
            </div>
            <div style={{ position: 'relative', height: '280px' }}>
              <Image src="/img-fleet.png" alt="Fleet of construction vehicles at depot" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, transparent 40%, rgba(249,249,249,0.4))' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '6px', padding: '32px', boxShadow: '0px 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(198,198,198,0.25)' }}>
                <div style={{ fontSize: '28px', color: '#FFC107', fontWeight: 700, lineHeight: 1, marginBottom: '16px' }}>"</div>
                <p style={{ fontSize: '14px', color: '#1A1C1C', lineHeight: 1.75, marginBottom: '24px', fontStyle: 'italic' }}>{t.quote}</p>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1C1C' }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: '#A3A3A3', marginTop: '2px' }}>{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '80px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', color: '#A3A3A3', textTransform: 'uppercase', marginBottom: '16px' }}>WHY NOT JUST USE A SPREADSHEET?</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '40px' }}>
            Spreadsheets don't send alerts. They don't read documents. They don't update themselves.
          </h2>
          <div style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid #F3F3F3' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', backgroundColor: '#F3F3F3', padding: '12px 24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', color: '#A3A3A3' }}>CAPABILITY</div>
              <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', color: '#A3A3A3', textAlign: 'center' }}>SPREADSHEET</div>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', color: '#1A1C1C', textAlign: 'center' }}>HATSAFE</div>
            </div>
            {comparison.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', padding: '14px 24px', borderTop: '1px solid #F3F3F3', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                <span style={{ fontSize: '14px', color: '#474747' }}>{row.feature}</span>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <XMarkIcon style={{ width: '16px', height: '16px', color: '#C6C6C6' }} strokeWidth={2} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CheckIcon style={{ width: '16px', height: '16px', color: '#1A1C1C' }} strokeWidth={2.5} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ backgroundColor: '#F3F3F3', padding: '96px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', color: '#A3A3A3', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>PRICING</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px', textAlign: 'center' }}>
            Priced for the size of your business.
          </h2>
          <p style={{ fontSize: '16px', color: '#474747', textAlign: 'center', marginBottom: '56px' }}>
            14-day free trial on every plan. No credit card required.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {plans.map((p) => (
              <div key={p.name} style={{
                backgroundColor: p.highlight ? '#000000' : '#FFFFFF',
                borderRadius: '6px',
                padding: '36px 32px',
                border: p.highlight ? 'none' : '1px solid rgba(198,198,198,0.25)',
                boxShadow: '0px 20px 40px rgba(0,0,0,0.04)',
                position: 'relative',
              }}>
                {p.highlight && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#FFC107', color: '#1A1C1C', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', padding: '4px 12px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', color: p.highlight ? 'rgba(255,255,255,0.5)' : '#A3A3A3', textTransform: 'uppercase', marginBottom: '12px' }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 700, color: p.highlight ? '#FFFFFF' : '#1A1C1C', letterSpacing: '-0.02em' }}>{p.price}</span>
                  <span style={{ fontSize: '14px', color: p.highlight ? 'rgba(255,255,255,0.5)' : '#A3A3A3' }}>{p.period}</span>
                </div>
                <p style={{ fontSize: '13px', color: p.highlight ? 'rgba(255,255,255,0.6)' : '#474747', marginBottom: '28px' }}>{p.desc}</p>
                <div style={{ borderTop: `1px solid ${p.highlight ? 'rgba(255,255,255,0.1)' : '#F3F3F3'}`, paddingTop: '24px', marginBottom: '28px' }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <CheckIcon style={{ width: '14px', height: '14px', color: p.highlight ? '#FFC107' : '#1A1C1C', flexShrink: 0 }} strokeWidth={2.5} />
                      <span style={{ fontSize: '13px', color: p.highlight ? 'rgba(255,255,255,0.8)' : '#474747' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/signup" style={{
                  display: 'block', textAlign: 'center',
                  backgroundColor: p.highlight ? '#FFC107' : '#000000',
                  color: p.highlight ? '#1A1C1C' : '#FFFFFF',
                  fontWeight: 700, fontSize: '14px', padding: '12px',
                  borderRadius: '4px', textDecoration: 'none',
                }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ backgroundColor: '#FFFFFF', padding: '96px 32px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', color: '#A3A3A3', textTransform: 'uppercase', marginBottom: '16px' }}>FAQ</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '40px' }}>
            Questions we get asked
          </h2>
          <div>
            {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ backgroundColor: '#1A1C1C', padding: '96px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '20px' }}>
            Stop finding out about compliance problems after they happen.
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '40px' }}>
            Join the construction and trades businesses that have already replaced their spreadsheets with something that actually works.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ backgroundColor: '#FFC107', color: '#1A1C1C', fontWeight: 700, fontSize: '15px', padding: '14px 28px', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Start Free Trial
              <ArrowRightIcon style={{ width: '16px', height: '16px' }} strokeWidth={2.5} />
            </Link>
            <a href="#playbook" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontWeight: 500, fontSize: '14px', padding: '14px 24px', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ArrowDownTrayIcon style={{ width: '15px', height: '15px' }} strokeWidth={2} />
              Download the Free Playbook
            </a>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '20px' }}>
            14-day free trial · No credit card · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: '#111111', padding: '40px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '26px', height: '26px', backgroundColor: '#FFC107', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '12px', color: '#1A1C1C' }}>H</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>HatSafe</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service', 'support@hatsafe.com'].map((item) => (
              <span key={item} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{item}</span>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            © 2026 HatSafe · Built for UK construction and trades · UK GDPR compliant
          </p>
        </div>
      </footer>

    </div>
  );
}
