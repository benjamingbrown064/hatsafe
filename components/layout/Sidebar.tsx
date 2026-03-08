'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  UsersIcon, 
  TruckIcon, 
  WrenchIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'People', href: '/people', icon: UsersIcon },
  { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
  { name: 'Assets', href: '/assets', icon: WrenchIcon },
  { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center space-x-3">
          <div className="w-10 h-10 bg-primary-400 rounded-lg flex items-center justify-center">
            <span className="text-xl">🦺</span>
          </div>
          <div>
            <div className="text-xl font-bold text-secondary-800">HatSafe</div>
            <div className="text-xs text-gray-500">Compliance made simple</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium
                          ${isActive 
                            ? 'bg-primary-50 text-primary-600' 
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'}`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            {/* Bottom section - User menu */}
            <li className="mt-auto">
              <div className="border-t border-gray-200 pt-4">
                <Link
                  href="/settings/profile"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                    U
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Your Name</div>
                    <div className="text-xs text-gray-500">Admin</div>
                  </div>
                </Link>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
