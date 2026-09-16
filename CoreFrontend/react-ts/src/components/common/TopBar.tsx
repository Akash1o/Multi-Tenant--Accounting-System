import { useAuthStore } from '../../store/authStore';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const { selectedOrganization, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 h-16 bg-[#F6F1E4]/80 backdrop-blur-md border-b border-[#DFD9C6]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border border-dashed border-primary/50 flex items-center justify-center bg-[#F6F1E4] rotate-[-6deg]">
          <span
            className="text-primary font-black text-[10px] tracking-tight"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            MTA
          </span>
        </div>
        <h1 
          className="text-lg font-bold text-[#1B2A2F] truncate max-w-[200px]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {selectedOrganization?.name || 'MultiTenant Ledger'}
        </h1>
      </div>
      <button 
        onClick={handleLogout} 
        className="p-2 rounded-full text-[#8A9490] hover:text-primary hover:bg-primary/10 transition-all active:scale-95" 
        aria-label="Logout"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </header>
  );
}

