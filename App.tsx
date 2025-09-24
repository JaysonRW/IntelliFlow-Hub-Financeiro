import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EmployeeView from './views/EmployeeView';
import ManagerView from './views/ManagerView';
import FinanceView from './views/FinanceView';
import { useFinancialData } from './hooks/useFinancialData';
import { UserRole } from './types';

type Portal = 'collaborator' | 'admin';

const App: React.FC = () => {
  const [portal, setPortal] = useState<Portal>('collaborator');
  const [adminView, setAdminView] = useState<UserRole.MANAGER | UserRole.FINANCE>(UserRole.MANAGER);
  const financialDataContext = useFinancialData();

  const activeView = portal === 'collaborator' ? UserRole.EMPLOYEE : adminView;

  const renderAdminView = () => {
    switch (adminView) {
      case UserRole.MANAGER:
        return <ManagerView context={financialDataContext} />;
      case UserRole.FINANCE:
        return <FinanceView context={financialDataContext} />;
      default:
        return <ManagerView context={financialDataContext} />;
    }
  };
  
  const currentUser = {
      [UserRole.EMPLOYEE]: { name: "Alex Johnson", role: "Colaborador" },
      [UserRole.MANAGER]: { name: "Samantha Carter", role: "Gestora" },
      [UserRole.FINANCE]: { name: "Daniel Jackson", role: "Analista Financeiro" },
  }[activeView];


  return (
    <div className="flex h-screen bg-neutral-100 text-neutral-800 font-sans">
      {portal === 'admin' && <Sidebar activeView={adminView} setActiveView={setAdminView} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={currentUser} portal={portal} setPortal={setPortal} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-6 md:p-8">
          {portal === 'collaborator' ? <EmployeeView context={financialDataContext} /> : renderAdminView()}
        </main>
      </div>
    </div>
  );
};

export default App;