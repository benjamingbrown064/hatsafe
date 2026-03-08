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
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
    { name: 'People', href: '/people', icon: UsersIcon },
    { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
    { name: 'Assets', href: '/assets', icon: WrenchIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex items-center h-20 px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-900 rounded-[10px] flex items-center justify-center">
            <span className="text-white font-semibold text-[15px]">H</span>
          </div>
          <span className="text-[17px] font-semibold text-gray-900">HatSafe</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[15px] font-medium transition-all
                ${
                  active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-[13px] font-medium">BB</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-medium text-gray-900 truncate">Ben Brown</div>
            <div className="text-[12px] text-gray-500">View profile</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
