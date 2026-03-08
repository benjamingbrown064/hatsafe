import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Desktop Layout */}
      <div className="flex h-screen">
        {/* Sidebar - Hidden on mobile */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto md:pl-64">
          <div className="max-w-[1400px] mx-auto px-8 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
