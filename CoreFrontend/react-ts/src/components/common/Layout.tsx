import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="flex-1 pb-16 overflow-y-auto w-full max-w-md mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
