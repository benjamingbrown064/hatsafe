import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import TopBar from './TopBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      <MobileHeader />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col md:pl-60">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1320px] mx-auto px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
