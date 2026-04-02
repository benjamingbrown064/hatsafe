'use client';

import { useState, useRef, useEffect } from 'react';
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
} from '@heroicons/react/24/outline';

// ── Route config ─────────────────────────────────────────────────────────────
const routeConfig: Record<string, {
  label: string;
  title: string;
  action?: { label: string; href: string };
}> = {
  '/dashboard':  { label: 'OVERVIEW',              title: 'Compliance Ledger' },
  '/people':     { label: 'WORKFORCE',              title: 'People',     action: { label: 'Add Person',    href: '/people/new'    } },
  '/vehicles':   { label: 'FLEET MANAGEMENT',       title: 'Vehicles',   action: { label: 'Add Vehicle',   href: '/vehicles/new'  } },
  '/assets':     { label: 'EQUIPMENT & MACHINERY',  title: 'Assets',     action: { label: 'Add Asset',     href: '/assets/new'    } },
  '/documents':  { label: 'COMPLIANCE REGISTRY',    title: 'Documents',  action: { label: 'Upload Document', href: '/documents/upload' } },
  '/calendar':   { label: 'EXPIRY TRACKING',        title: 'Calendar'   },
  '/reports':    { label: 'COMPLIANCE',             title: 'Reports'    },
  '/settings':   { label: 'SYSTEM',                 title: 'Settings'   },
};

// ── Mock search results ───────────────────────────────────────────────────────
const mockResults = [
  { type: 'person',  label: 'John Smith',               sub: 'Carpenter · Site A',    href: '/people/1' },
  { type: 'person',  label: 'Sarah Johnson',            sub: 'Electrician · Site B',  href: '/people/2' },
  { type: 'vehicle', label: 'AB12 CDE',                 sub: 'Ford Transit · Van',    href: '/vehicles/1' },
  { type: 'vehicle', label: 'FG34 HIJ',                 sub: 'VW Caddy · Van',        href: '/vehicles/2' },
  { type: 'asset',   label: 'SCAF-001',                 sub: 'Aluminium Scaffold',     href: '/assets/1' },
  { type: 'asset',   label: 'LIFT-008',                 sub: 'Scissor Lift 8m',        href: '/assets/4' },
  { type: 'doc',     label: 'CSCS Card – John Smith',  sub: 'Valid · Expires 2029',   href: '/documents' },
  { type: 'doc',     label: 'MOT Certificate – AB12 CDE', sub: 'Expiring · 7 days',  href: '/documents' },
  { type: 'doc',     label: 'IPAF – Sarah Johnson',    sub: 'Expired',                href: '/documents' },
];

function ResultIcon({ type }: { type: string }) {
  const cls = 'w-3.5 h-3.5 flex-shrink-0';
  const s = { color: '#A3A3A3' };
  if (type === 'vehicle') return <TruckIcon className={cls} style={s} strokeWidth={1.5} />;
  if (type === 'asset')   return <WrenchScrewdriverIcon className={cls} style={s} strokeWidth={1.5} />;
  if (type === 'doc')     return <DocumentTextIcon className={cls} style={s} strokeWidth={1.5} />;
  return <UserIcon className={cls} style={s} strokeWidth={1.5} />;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TopBar() {
  const pathname = usePathname();
  const router   = useRouter();

  // Match route (handle sub-routes like /people/1 → /people)
  const routeKey = Object.keys(routeConfig).find(k => pathname === k || pathname.startsWith(k + '/')) ?? '/dashboard';
  const config   = routeConfig[routeKey];

  const [query,   setQuery]   = useState('');
  const [open,    setOpen]    = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 0
    ? mockResults.filter(r =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.sub.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const showDropdown = focused && query.trim().length > 0;

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function clear() { setQuery(''); inputRef.current?.focus(); }

  function handleSelect(href: string) {
    setQuery('');
    setFocused(false);
    router.push(href);
  }

  return (
    <div
      className="sticky top-0 z-30 flex items-center gap-4 px-8"
      style={{
        height: '56px',
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
            <span className="label-sm hidden sm:block"
              style={{ color: '#C6C6C6', fontSize: '9px' }}>
              {config.label}
            </span>
          )}
        </div>
      </div>

      {/* Global search */}
      <div ref={wrapRef} className="relative" style={{ width: '280px' }}>
        <div
          className="flex items-center gap-2 px-3"
          style={{
            height: '34px',
            backgroundColor: '#F3F3F3',
            borderRadius: '4px',
            border: focused ? '1px solid #1A1C1C' : '1px solid transparent',
            transition: 'border-color 150ms',
          }}
        >
          <MagnifyingGlassIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#A3A3A3' }} strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search people, vehicles, documents…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '13px',
              color: '#1A1C1C',
              padding: 0,
              width: '100%',
            }}
          />
          {query && (
            <button onClick={clear} style={{ color: '#A3A3A3', flexShrink: 0 }}>
              <XMarkIcon className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div
            className="absolute top-full mt-1 left-0 right-0 overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              boxShadow: '0px 20px 40px rgba(0,0,0,0.08)',
              border: '1px solid rgba(198,198,198,0.4)',
              zIndex: 50,
              maxHeight: '320px',
              overflowY: 'auto',
            }}
          >
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="label-sm">NO RESULTS FOR "{query}"</p>
              </div>
            ) : (
              <>
                <div className="px-4 pt-3 pb-2">
                  <span className="label-sm">{results.length} RESULT{results.length !== 1 ? 'S' : ''}</span>
                </div>
                {results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(r.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{ borderTop: i > 0 ? '1px solid #F3F3F3' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9F9F9')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                      <ResultIcon type={r.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: '#1A1C1C' }}>{r.label}</div>
                      <div className="text-xs truncate" style={{ color: '#A3A3A3' }}>{r.sub}</div>
                    </div>
                    <ArrowUpRightIcon className="w-3 h-3 flex-shrink-0" style={{ color: '#C6C6C6' }} strokeWidth={2} />
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Primary action button */}
      {config?.action && (
        <Link href={config.action.href}>
          <button className="btn btn-primary flex items-center gap-1.5" style={{ padding: '7px 14px', fontSize: '13px', whiteSpace: 'nowrap' }}>
            <PlusIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
            {config.action.label}
          </button>
        </Link>
      )}
    </div>
  );
}
