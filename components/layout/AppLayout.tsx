import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      <MobileHeader />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto md:pl-60">
          <div className="max-w-[1320px] mx-auto px-8 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
