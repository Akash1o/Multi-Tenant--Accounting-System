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
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-bold text-primary truncate max-w-[200px]">
          {selectedOrganization?.name || 'MultiTenantAccounting'}
        </h1>
      </div>
      <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Logout">
        <LogOut className="w-5 h-5" />
      </button>
    </header>
  );
}
