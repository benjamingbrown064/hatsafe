'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  UserIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  ArrowUpRightIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';

// ── Route config ─────────────────────────────────────────────────────────────
const routeConfig: Record<string, {
  label: string;
  title: string;
  action?: { label: string; href: string };
}> = {
  '/dashboard':  { label: 'OVERVIEW',              title: 'Compliance Ledger' },
  '/people':     { label: 'WORKFORCE',              title: 'People',     action: { label: 'Add Person',      href: '/people/new'       } },
  '/vehicles':   { label: 'FLEET MANAGEMENT',       title: 'Vehicles',   action: { label: 'Add Vehicle',     href: '/vehicles/new'     } },
  '/assets':     { label: 'EQUIPMENT & MACHINERY',  title: 'Assets',     action: { label: 'Add Asset',       href: '/assets/new'       } },
  '/documents':  { label: 'COMPLIANCE REGISTRY',    title: 'Documents',  action: { label: 'Upload Document', href: '/documents/upload' } },
  '/calendar':   { label: 'EXPIRY TRACKING',        title: 'Calendar'   },
  '/reports':    { label: 'COMPLIANCE',             title: 'Reports'    },
  '/settings':   { label: 'SYSTEM',                 title: 'Settings'   },
};

// ── Search data ───────────────────────────────────────────────────────────────
const mockResults = [
  { type: 'person',  label: 'John Smith',     sub: 'Carpenter · Site A',       href: '/people/1',   tags: ['john smith', 'carpenter'] },
  { type: 'person',  label: 'Sarah Johnson',  sub: 'Electrician · Site B',     href: '/people/2',   tags: ['sarah johnson', 'electrician'] },
  { type: 'person',  label: 'Mike Davies',    sub: 'Site Manager · Site A',    href: '/people/3',   tags: ['mike davies', 'site manager'] },
  { type: 'person',  label: 'Emma Wilson',    sub: 'Labourer · Site C',        href: '/people/4',   tags: ['emma wilson', 'labourer'] },
  { type: 'person',  label: 'James Brown',    sub: 'Scaffolder · Site B',      href: '/people/5',   tags: ['james brown', 'scaffolder'] },
  { type: 'vehicle', label: 'AB12 CDE',       sub: 'Ford Transit · Van',       href: '/vehicles/1', tags: ['ab12 cde', 'ford', 'transit'] },
  { type: 'vehicle', label: 'FG34 HIJ',       sub: 'VW Caddy · Van',           href: '/vehicles/2', tags: ['fg34 hij', 'volkswagen', 'caddy'] },
  { type: 'vehicle', label: 'KL56 MNO',       sub: 'Mercedes Sprinter · Van',  href: '/vehicles/3', tags: ['kl56 mno', 'mercedes', 'sprinter'] },
  { type: 'asset',   label: 'SCAF-001',       sub: 'Aluminium Tower Scaffold', href: '/assets/1',   tags: ['scaf', 'scaffold'] },
  { type: 'asset',   label: 'COMP-023',       sub: 'Air Compressor 50L',       href: '/assets/2',   tags: ['comp', 'compressor'] },
  { type: 'asset',   label: 'LIFT-008',       sub: 'Scissor Lift 8m',          href: '/assets/4',   tags: ['lift', 'scissor'] },
  { type: 'doc',     label: 'CSCS Card – John Smith',       sub: 'Valid · Expires 2029', href: '/documents', tags: ['cscs'] },
  { type: 'doc',     label: 'MOT Certificate – AB12 CDE',   sub: 'Expiring · 7 days',   href: '/documents', tags: ['mot'] },
  { type: 'doc',     label: 'IPAF – Sarah Johnson',         sub: 'Expired',              href: '/documents', tags: ['ipaf'] },
  { type: 'doc',     label: 'LOLER Inspection – SCAF-001',  sub: 'Expiring · 12 days',  href: '/documents', tags: ['loler'] },
];

const typeOrder = ['person', 'vehicle', 'asset', 'doc'];
const typeLabel: Record<string, string> = { person: 'PEOPLE', vehicle: 'VEHICLES', asset: 'ASSETS', doc: 'DOCUMENTS' };

function ResultIcon({ type }: { type: string }) {
  const cls = 'w-3.5 h-3.5 flex-shrink-0';
  const s = { color: '#A3A3A3' };
  if (type === 'vehicle') return <TruckIcon className={cls} style={s} strokeWidth={1.5} />;
  if (type === 'asset')   return <WrenchScrewdriverIcon className={cls} style={s} strokeWidth={1.5} />;
  if (type === 'doc')     return <DocumentTextIcon className={cls} style={s} strokeWidth={1.5} />;
  return <UserIcon className={cls} style={s} strokeWidth={1.5} />;
}

// ── Icon button ───────────────────────────────────────────────────────────────
function IconBtn({
  onClick, title, children, active,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center transition-colors"
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: active ? '#F3F3F3' : 'transparent',
        color: active ? '#1A1C1C' : '#474747',
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F3F3F3'; e.currentTarget.style.color = '#1A1C1C'; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = active ? '#F3F3F3' : 'transparent'; e.currentTarget.style.color = active ? '#1A1C1C' : '#474747'; }}
    >
      {children}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TopBar() {
  const pathname = usePathname();
  const router   = useRouter();

  const routeKey = Object.keys(routeConfig).find(k => pathname === k || pathname.startsWith(k + '/')) ?? '/dashboard';
  const config   = routeConfig[routeKey];

  // Search modal
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [query,       setQuery]       = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Logout modal
  const [logoutOpen,  setLogoutOpen]  = useState(false);
  const [loggingOut,  setLoggingOut]  = useState(false);

  // Open search with keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setLogoutOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  // Search results
  const results = query.trim().length > 0
    ? mockResults.filter(r => {
        const q = query.toLowerCase();
        return [r.label, r.sub, ...r.tags].join(' ').toLowerCase().includes(q);
      })
    : [];

  // Group by type
  const grouped = typeOrder
    .map(t => ({ type: t, items: results.filter(r => r.type === t) }))
    .filter(g => g.items.length > 0);

  function handleSelect(href: string) {
    setSearchOpen(false);
    router.push(href);
  }

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }, [router]);

  return (
    <>
      {/* ── Top bar ── */}
      <div
        className="sticky top-0 z-30 flex items-center gap-4 px-8"
        style={{
          height: '64px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(198,198,198,0.4)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Page title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold truncate" style={{ fontSize: '15px', color: '#1A1C1C', letterSpacing: '-0.01em' }}>
              {config?.title ?? 'HatSafe'}
            </h2>
            {config?.label && (
              <span className="label-sm hidden sm:block" style={{ color: '#C6C6C6', fontSize: '9px' }}>
                {config.label}
              </span>
            )}
          </div>
        </div>

        {/* Right side: primary action + icon group */}
        <div className="flex items-center gap-2">
          {config?.action && (
            <Link href={config.action.href}>
              <button className="btn btn-primary flex items-center gap-1.5" style={{ padding: '7px 14px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                <PlusIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                {config.action.label}
              </button>
            </Link>
          )}

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(198,198,198,0.5)', margin: '0 4px' }} />

          {/* Search icon */}
          <IconBtn onClick={() => setSearchOpen(true)} title="Search (⌘K)">
            <MagnifyingGlassIcon className="w-4 h-4" strokeWidth={1.75} />
          </IconBtn>

          {/* Settings cog */}
          <IconBtn
            onClick={() => router.push('/settings')}
            title="Settings"
            active={pathname.startsWith('/settings')}
          >
            <Cog6ToothIcon className="w-4 h-4" strokeWidth={1.75} />
          </IconBtn>

          {/* Logout */}
          <IconBtn onClick={() => setLogoutOpen(true)} title="Log out">
            <ArrowRightOnRectangleIcon className="w-4 h-4" strokeWidth={1.75} />
          </IconBtn>
        </div>
      </div>

      {/* ── Search modal ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div
            className="w-full overflow-hidden"
            style={{
              maxWidth: '560px',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0px 32px 64px rgba(0,0,0,0.14)',
              border: '1px solid rgba(198,198,198,0.4)',
              margin: '0 16px',
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4" style={{ borderBottom: '1px solid #F3F3F3', height: '52px' }}>
              <MagnifyingGlassIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#A3A3A3' }} strokeWidth={1.75} />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search people, vehicles, assets, documents…"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  color: '#1A1C1C',
                  background: 'transparent',
                }}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ color: '#A3A3A3', flexShrink: 0 }}>
                  <XMarkIcon className="w-4 h-4" strokeWidth={2} />
                </button>
              )}
              <div className="flex-shrink-0 px-2 py-1 text-[10px] font-medium"
                style={{ backgroundColor: '#F3F3F3', borderRadius: '4px', color: '#A3A3A3', letterSpacing: '0.04em' }}>
                ESC
              </div>
            </div>

            {/* Results */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {query.trim().length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="label-sm mb-1">GLOBAL SEARCH</p>
                  <p className="text-sm" style={{ color: '#A3A3A3' }}>Search across people, vehicles, assets and documents</p>
                </div>
              )}
              {query.trim().length > 0 && grouped.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="label-sm mb-1">NO RESULTS</p>
                  <p className="text-sm" style={{ color: '#A3A3A3' }}>Nothing matched &ldquo;{query}&rdquo;</p>
                </div>
              )}
              {grouped.map((group, gi) => (
                <div key={group.type}>
                  <div className="px-4 py-2" style={{ borderTop: gi > 0 ? '1px solid #F3F3F3' : 'none' }}>
                    <span className="label-sm">{typeLabel[group.type]}</span>
                  </div>
                  {group.items.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(r.href)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                      style={{ borderTop: '1px solid #F9F9F9' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9F9F9')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                        <ResultIcon type={r.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: '#1A1C1C' }}>{r.label}</div>
                        <div className="text-xs truncate" style={{ color: '#A3A3A3' }}>{r.sub}</div>
                      </div>
                      <ArrowUpRightIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C6C6C6' }} strokeWidth={2} />
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 flex items-center gap-4" style={{ borderTop: '1px solid #F3F3F3' }}>
              <span className="label-sm">↵ SELECT</span>
              <span className="label-sm">ESC CLOSE</span>
              <span className="label-sm">⌘K TOGGLE</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Logout confirmation modal ── */}
      {logoutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget && !loggingOut) setLogoutOpen(false); }}
        >
          <div
            className="w-full"
            style={{
              maxWidth: '400px',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0px 32px 64px rgba(0,0,0,0.14)',
              border: '1px solid rgba(198,198,198,0.4)',
              margin: '0 16px',
              padding: '28px',
            }}
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-11 h-11 mb-5"
              style={{ backgroundColor: '#F3F3F3', borderRadius: '8px' }}>
              <ArrowRightOnRectangleIcon className="w-5 h-5" style={{ color: '#1A1C1C' }} strokeWidth={1.75} />
            </div>

            <h3 className="font-semibold mb-2" style={{ fontSize: '16px', color: '#1A1C1C' }}>
              Log out of HatSafe?
            </h3>
            <p className="text-sm mb-6" style={{ color: '#474747', lineHeight: 1.6 }}>
              You&apos;ll be taken back to the login screen. Any unsaved changes will be lost.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setLogoutOpen(false)}
                disabled={loggingOut}
                className="flex-1 py-2.5 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: '#F3F3F3',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: loggingOut ? 'not-allowed' : 'pointer',
                  color: '#1A1C1C',
                }}
                onMouseEnter={e => { if (!loggingOut) e.currentTarget.style.backgroundColor = '#E8E8E8'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F3F3F3'; }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 py-2.5 text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: loggingOut ? 'not-allowed' : 'pointer',
                  opacity: loggingOut ? 0.6 : 1,
                }}
                onMouseEnter={e => { if (!loggingOut) e.currentTarget.style.backgroundColor = '#1A1C1C'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#000000'; }}
              >
                {loggingOut ? 'Logging out…' : 'Log out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
