'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  TruckIcon,
  WrenchIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard',  href: '/dashboard',  icon: HomeIcon },
  { name: 'Documents',  href: '/documents',  icon: DocumentTextIcon },
  { name: 'People',     href: '/people',     icon: UsersIcon },
  { name: 'Vehicles',   href: '/vehicles',   icon: TruckIcon },
  { name: 'Assets',     href: '/assets',     icon: WrenchIcon },
  { name: 'Calendar',   href: '/calendar',   icon: CalendarIcon },
  { name: 'Reports',    href: '/reports',    icon: ChartBarIcon },
];

const bottom = [
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Support',  href: '/support',  icon: QuestionMarkCircleIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside
      className="hidden md:flex md:flex-col md:w-60 md:fixed md:inset-y-0"
      style={{ backgroundColor: '#F3F3F3' }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-5 gap-3" style={{ borderBottom: '1px solid rgba(198,198,198,0.4)' }}>
        <div
          className="w-8 h-8 flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#FFC107', borderRadius: '4px' }}
        >
          <span className="font-bold text-sm" style={{ color: '#1A1C1C' }}>H</span>
        </div>
        <div>
          <div className="font-semibold text-sm" style={{ color: '#1A1C1C', letterSpacing: '-0.01em' }}>HatSafe</div>
          <div className="label-sm" style={{ fontSize: '9px' }}>COMPLIANCE PLATFORM</div>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.name} href={item.href} className="nav-item" data-active={active || undefined}
              style={active ? {
                backgroundColor: '#FFC107',
                color: '#1A1C1C',
                fontWeight: 600,
              } : {}}>
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.5} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(198,198,198,0.4)', paddingTop: '12px' }}>
        {bottom.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.name} href={item.href} className="nav-item"
              style={active ? { backgroundColor: '#FFC107', color: '#1A1C1C', fontWeight: 600 } : {}}>
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.5} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* User pill */}
        <div className="flex items-center gap-3 px-3 py-2.5 mt-3 cursor-pointer hover:bg-white/60 transition-colors"
          style={{ borderRadius: '4px' }}>
          <div className="w-7 h-7 flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#1A1C1C', borderRadius: '4px' }}>
            <span className="text-white text-[11px] font-semibold">BB</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: '#1A1C1C' }}>Ben Brown</div>
            <div className="label-sm truncate" style={{ fontSize: '9px' }}>ADMINISTRATOR</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
