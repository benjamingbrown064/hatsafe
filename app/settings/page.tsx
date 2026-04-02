'use client';

import AppLayout from '@/components/layout/AppLayout';
import {
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const settingsSections = [
  { Icon: BuildingOfficeIcon, title: 'Organisation',    desc: 'Company name, logo, and basic details' },
  { Icon: UsersIcon,          title: 'Users & Teams',   desc: 'Manage users, roles, and team structure' },
  { Icon: DocumentTextIcon,   title: 'Document Types',  desc: 'Configure certificate and licence types' },
  { Icon: BellIcon,           title: 'Notifications',   desc: 'Email alerts and reminder settings' },
  { Icon: ShieldCheckIcon,    title: 'Security',         desc: 'Password, 2FA, and audit logs' },
  { Icon: CreditCardIcon,     title: 'Billing',          desc: 'Subscription, invoices, and plan' },
];

const usageStats = [
  { label: 'PEOPLE',    used: 142, limit: 200 },
  { label: 'VEHICLES',  used: 48,  limit: 100 },
  { label: 'DOCUMENTS', used: 487, limit: 2000 },
];

const notificationPrefs = [
  { label: 'Email alerts for expiring documents', desc: '30, 14, and 7 days before expiry',    enabled: true },
  { label: 'Daily urgent digest',                  desc: 'Expiring in next 7 days + overdue',   enabled: true },
  { label: 'Weekly upcoming expiries',             desc: 'Sent every Monday at 9:00 AM',         enabled: true },
  { label: 'Document upload notifications',        desc: 'When new documents are uploaded',      enabled: false },
  { label: 'Review queue alerts',                  desc: 'When documents need AI approval',      enabled: true },
];

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Section nav cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {settingsSections.map((s) => (
            <button key={s.title}
              className="card text-left transition-all"
              style={{ cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0px 20px 40px rgba(0,0,0,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0px 20px 40px rgba(0,0,0,0.04)')}>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                  <s.Icon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ color: '#1A1C1C' }}>{s.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#A3A3A3' }}>{s.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Organisation details */}
        <div className="card-flush">
          <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
            <div className="label-sm mb-1">ORGANISATION</div>
            <h2 style={{ fontSize: '1rem' }}>Organisation Details</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label>COMPANY NAME</label>
                <input type="text" defaultValue="Acme Construction Ltd" />
              </div>
              <div>
                <label>SUBDOMAIN</label>
                <div className="flex">
                  <input type="text" defaultValue="acme"
                    style={{ borderRadius: '4px 0 0 4px', borderRight: 'none', flex: 1 }} />
                  <span className="flex items-center px-3 text-xs"
                    style={{
                      backgroundColor: '#F3F3F3',
                      border: '1px solid #C6C6C6',
                      borderRadius: '0 4px 4px 0',
                      color: '#A3A3A3',
                      whiteSpace: 'nowrap',
                    }}>
                    .hatsafe.com
                  </span>
                </div>
              </div>
              <div>
                <label>INDUSTRY</label>
                <select defaultValue="Construction">
                  <option>Construction</option>
                  <option>Facilities Management</option>
                  <option>Logistics</option>
                  <option>Events</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label>COMPANY SIZE</label>
                <select>
                  <option>1–10 employees</option>
                  <option>11–50 employees</option>
                  <option selected>51–200 employees</option>
                  <option>201–500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn btn-black flex items-center gap-2">
                <CheckIcon className="w-4 h-4" strokeWidth={2.5} />
                Save Changes
              </button>
              <button className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>

        {/* Subscription & usage */}
        <div className="card-flush">
          <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
            <div className="label-sm mb-1">BILLING</div>
            <h2 style={{ fontSize: '1rem' }}>Subscription & Usage</h2>
          </div>
          <div className="p-6 space-y-6">

            {/* Plan banner */}
            <div className="flex items-center justify-between p-4"
              style={{ backgroundColor: '#FFF8E1', border: '1px solid #FFC107', borderRadius: '4px' }}>
              <div>
                <div className="font-semibold text-sm" style={{ color: '#1A1C1C' }}>Professional Plan</div>
                <div className="text-xs mt-0.5" style={{ color: '#474747' }}>£99/month · Renews 1 May 2026</div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-secondary text-xs">Change Plan</button>
                <button className="btn btn-black text-xs flex items-center gap-1.5">
                  <CreditCardIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Manage Billing
                </button>
              </div>
            </div>

            {/* Usage bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {usageStats.map((u) => {
                const pct = Math.round((u.used / u.limit) * 100);
                const warn = pct > 80;
                return (
                  <div key={u.label} className="card" style={{ padding: '16px 20px' }}>
                    <div className="label-sm mb-1">{u.label}</div>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1C1C' }}>{u.used}</span>
                      <span style={{ fontSize: '13px', color: '#A3A3A3' }}>/ {u.limit}</span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#F3F3F3', borderRadius: '2px' }}>
                      <div style={{
                        height: '4px',
                        width: `${pct}%`,
                        backgroundColor: warn ? '#FFC107' : '#1A1C1C',
                        borderRadius: '2px',
                        transition: 'width 300ms',
                      }} />
                    </div>
                    <div className="label-sm mt-2" style={{ color: warn ? '#92400E' : '#A3A3A3' }}>
                      {pct}% USED
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Notification preferences */}
        <div className="card-flush">
          <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
            <div className="label-sm mb-1">ALERTS</div>
            <h2 style={{ fontSize: '1rem' }}>Notification Preferences</h2>
          </div>
          <div>
            {notificationPrefs.map((pref, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: i < notificationPrefs.length - 1 ? '1px solid #F3F3F3' : 'none' }}>
                <div>
                  <div className="font-medium text-sm" style={{ color: '#1A1C1C' }}>{pref.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#A3A3A3' }}>{pref.desc}</div>
                </div>
                {/* Toggle */}
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-6">
                  <input type="checkbox" className="sr-only peer" defaultChecked={pref.enabled} />
                  <div style={{
                    width: '40px', height: '22px',
                    backgroundColor: '#F3F3F3',
                    borderRadius: '11px',
                    border: '1px solid #C6C6C6',
                    position: 'relative',
                    transition: 'background-color 150ms',
                  }}
                    className="peer peer-checked:bg-black peer-checked:border-black">
                    <div style={{
                      position: 'absolute',
                      top: '2px', left: '2px',
                      width: '16px', height: '16px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      transition: 'transform 150ms',
                    }}
                      className="peer-checked:translate-x-[18px]" />
                  </div>
                </label>
              </div>
            ))}
          </div>
          <div className="px-6 py-5" style={{ borderTop: '1px solid #F3F3F3' }}>
            <button className="btn btn-black flex items-center gap-2">
              <CheckIcon className="w-4 h-4" strokeWidth={2.5} />
              Save Preferences
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card-flush" style={{ border: '1px solid rgba(198,198,198,0.4)' }}>
          <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
            <div className="label-sm mb-1" style={{ color: '#A3A3A3' }}>IRREVERSIBLE ACTIONS</div>
            <h2 style={{ fontSize: '1rem' }}>Danger Zone</h2>
          </div>
          <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <div className="font-medium text-sm" style={{ color: '#1A1C1C' }}>Export All Data</div>
                <div className="text-xs mt-0.5" style={{ color: '#A3A3A3' }}>Download a complete backup of all your data</div>
              </div>
              <button className="btn btn-secondary flex items-center gap-2 text-xs">
                <ArrowDownTrayIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                Export
              </button>
            </div>
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <div className="font-medium text-sm" style={{ color: '#1A1C1C' }}>Delete Organisation</div>
                <div className="text-xs mt-0.5" style={{ color: '#A3A3A3' }}>Permanently delete your organisation and all data. This cannot be undone.</div>
              </div>
              <button className="btn flex items-center gap-2 text-xs"
                style={{ backgroundColor: '#000000', color: '#FFFFFF', border: 'none' }}>
                <TrashIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                Delete
              </button>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
