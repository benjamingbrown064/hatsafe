'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard',  href: '/dashboard' },
  { name: 'People',     href: '/people' },
  { name: 'Vehicles',   href: '/vehicles' },
  { name: 'Assets',     href: '/assets' },
  { name: 'Documents',  href: '/documents' },
  { name: 'Calendar',   href: '/calendar' },
  { name: 'Reports',    href: '/reports' },
  { name: 'Settings',   href: '/settings' },
];

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <div className="sticky top-0 z-40 flex h-14 items-center gap-4 px-4" style={{ backgroundColor: '#F3F3F3', borderBottom: '1px solid rgba(198,198,198,0.4)' }}>
        <button type="button" onClick={() => setOpen(true)} className="p-1.5" style={{ color: '#474747' }}>
          <Bars3Icon className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center" style={{ backgroundColor: '#FFC107', borderRadius: '4px' }}>
            <span className="font-bold text-xs" style={{ color: '#1A1C1C' }}>H</span>
          </div>
          <span className="font-semibold text-sm" style={{ color: '#1A1C1C' }}>HatSafe</span>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/20" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-60 overflow-y-auto px-4 pb-4" style={{ backgroundColor: '#F3F3F3' }}>
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 flex items-center justify-center" style={{ backgroundColor: '#FFC107', borderRadius: '4px' }}>
                  <span className="font-bold text-xs" style={{ color: '#1A1C1C' }}>H</span>
                </div>
                <span className="font-semibold text-sm" style={{ color: '#1A1C1C' }}>HatSafe</span>
              </div>
              <button onClick={() => setOpen(false)} style={{ color: '#474747' }}>
                <XMarkIcon className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="mt-2 space-y-0.5">
              {navigation.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href} onClick={() => setOpen(false)}
                    className="nav-item"
                    style={active ? { backgroundColor: '#FFC107', color: '#1A1C1C', fontWeight: 600 } : {}}>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
