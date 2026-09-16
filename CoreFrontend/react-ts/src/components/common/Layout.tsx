import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#F6F1E4] text-[#1B2A2F] overflow-hidden">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent, transparent 35px, rgba(11,114,69,0.14) 35px, rgba(11,114,69,0.14) 36px)',
        }}
      />
      
      <TopBar />
      
      <main className="relative z-10 flex-1 pb-20 pt-4 overflow-y-auto w-full max-w-md mx-auto px-4 scrollbar-hide">
        <Outlet />
      </main>
      
      <BottomNav />
    </div>
  );
}


