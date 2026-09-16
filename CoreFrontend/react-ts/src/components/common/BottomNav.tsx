import { NavLink } from 'react-router-dom';
import { Home, Users, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/parties', icon: Users, label: 'Parties' },
    { to: '/transactions', icon: ArrowRightLeft, label: 'Transactions' },
  ];

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center">
      <div className="flex justify-around items-center h-16 bg-white/90 backdrop-blur-xl border border-[#DFD9C6] shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl w-full max-w-[400px] pointer-events-auto px-2 relative">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
                isActive ? 'text-primary scale-105' : 'text-[#8A9490] hover:text-[#5B6660]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-1 w-12 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(11,114,69,0.5)]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className={`text-[10px] font-medium transition-all ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

