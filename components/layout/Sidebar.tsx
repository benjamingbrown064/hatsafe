'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardBody, Avatar } from '@heroui/react';
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
    <aside className="hidden md:flex md:flex-col md:w-60 md:fixed md:inset-y-0 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-black font-semibold text-sm">H</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">HatSafe</span>
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
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                ${
                  active
                    ? 'bg-yellow-50 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <Card shadow="none" className="bg-gray-50">
          <CardBody className="p-3">
            <div className="flex items-center gap-3">
              <Avatar
                name="BB"
                size="sm"
                classNames={{
                  base: "bg-gray-200",
                  name: "text-gray-600 text-xs font-medium"
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">Ben Brown</div>
                <div className="text-xs text-gray-500">View profile</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </aside>
  );
}
