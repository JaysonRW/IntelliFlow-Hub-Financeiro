import React from 'react';
import { UserRole } from '../types';
import { ManagerIcon, FinanceIcon, HomeIcon } from './icons';

interface SidebarProps {
  activeView: UserRole.MANAGER | UserRole.FINANCE;
  setActiveView: (view: UserRole.MANAGER | UserRole.FINANCE) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  // Fix: Specify a more precise type for navItems to ensure item.role is assignable to setActiveView.
  const navItems: { role: UserRole.MANAGER | UserRole.FINANCE; label: string; icon: JSX.Element }[] = [
    { role: UserRole.MANAGER, label: 'Gestor', icon: <ManagerIcon className="w-5 h-5"/> },
    { role: UserRole.FINANCE, label: 'Financeiro', icon: <FinanceIcon className="w-5 h-5"/> },
  ];

  return (
    <aside className="w-64 bg-neutral-900 text-neutral-300 flex flex-col flex-shrink-0">
      <div className="flex items-center justify-center h-20 border-b border-neutral-800">
        <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
           <HomeIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white ml-3">IntelliFlow</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <p className="px-2 mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">PAINÉIS ADMIN</p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.role}>
              <button
                onClick={() => setActiveView(item.role)}
                className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeView === item.role
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'hover:bg-neutral-800 text-neutral-300'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-neutral-800">
        <p className="text-xs text-center text-neutral-500">&copy; 2024 IntelliFlow Inc.</p>
      </div>
    </aside>
  );
};

export default Sidebar;