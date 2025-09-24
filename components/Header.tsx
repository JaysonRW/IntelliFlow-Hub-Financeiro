import React from 'react';
import { User } from '../types';
import { ArrowPathIcon } from './icons';

interface HeaderProps {
    user: User;
    portal: 'collaborator' | 'admin';
    setPortal: (portal: 'collaborator' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ user, portal, setPortal }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom Dia';
    if (hour < 18) return 'Boa Tarde';
    return 'Boa Noite';
  }

  const togglePortal = () => {
    setPortal(portal === 'collaborator' ? 'admin' : 'collaborator');
  }

  const portalName = portal === 'collaborator' ? 'Portal do Colaborador' : 'Portal Admin';

  return (
    <header className="flex items-center justify-between h-20 px-8 bg-white shadow-sm flex-shrink-0">
      <div>
        <h2 className="text-2xl font-bold text-neutral-800">{getGreeting()}, {user.name.split(' ')[0]}!</h2>
        <p className="text-neutral-500">Você está no <span className="font-semibold text-primary">{portalName}</span>.</p>
      </div>
      <div className="flex items-center gap-4">
        <button 
            onClick={togglePortal}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-md hover:bg-neutral-200 transition-colors"
        >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Mudar para {portal === 'collaborator' ? 'Portal Admin' : 'Portal do Colaborador'}</span>
        </button>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-xl ring-4 ring-white">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Header;