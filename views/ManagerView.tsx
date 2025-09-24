
import React, { useState, useMemo } from 'react';
import { FinancialDataContextType } from '../hooks/useFinancialData';
import { FinancialRequest, ExpenseRequest, PurchaseRequest, PaymentRequest, ExpenseStatus, PurchaseStatus, PaymentStatus, FinancialRequestStatus } from '../types';
import DashboardCard from '../components/DashboardCard';
import RequestListItem from '../components/RequestListItem';
import Modal from '../components/Modal';
import { ClockIcon, CheckCircleIcon, XCircleIcon, SearchIcon, ArrowPathIcon } from '../components/icons';

interface ManagerViewProps {
  context: FinancialDataContextType;
}

type RequestType = 'expense' | 'purchase' | 'payment';

const RequestDetails: React.FC<{request: FinancialRequest}> = ({ request }) => {
    if (request.requestType === 'expense') {
        const req = request as ExpenseRequest;
        return (
             <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div><strong className="text-neutral-500 block">Funcionário</strong> {req.employeeName}</div>
                    <div><strong className="text-neutral-500 block">Departamento</strong> {req.department}</div>
                    <div><strong className="text-neutral-500 block">Enviado em</strong> {new Date(req.submittedDate).toLocaleDateString()}</div>
                    <div><strong className="text-neutral-500 block">Data da Despesa</strong> {new Date(req.date).toLocaleDateString()}</div>
                    <div><strong className="text-neutral-500 block">Tipo</strong> {req.type}</div>
                    <div className="text-lg"><strong className="text-neutral-500 block">Valor</strong> <span className="font-bold text-primary">R${req.amount.toFixed(2)}</span></div>
                </div>
                <div><strong className="text-neutral-500 block">Descrição</strong><p className="mt-1 text-neutral-700 bg-neutral-50 p-3 rounded-lg">{req.description}</p></div>
                {req.policyViolated && <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg"><strong className="font-bold">Alerta de Política:</strong> Excede o limite de despesas.</div>}
                {req.receiptUrl && <div className="pt-4 text-center"><strong className="text-neutral-500 block mb-2">Comprovante</strong><a href={req.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-block border rounded-lg overflow-hidden transition-shadow hover:shadow-lg"><img src={req.receiptUrl} alt="Receipt" className="object-cover h-96 w-auto" /></a></div>}
            </div>
        );
    } else if (request.requestType === 'purchase') {
        const req = request as PurchaseRequest;
        return (
             <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div><strong className="text-neutral-500 block">Funcionário</strong> {req.employeeName}</div>
                    <div><strong className="text-neutral-500 block">Departamento</strong> {req.department}</div>
                    <div><strong className="text-neutral-500 block">Enviado em</strong> {new Date(req.submittedDate).toLocaleDateString()}</div>
                    <div><strong className="text-neutral-500 block">Fornecedor</strong> {req.supplier}</div>
                    <div><strong className="text-neutral-500 block">Centro de Custo</strong> {req.costCenter}</div>
                    <div className="text-lg"><strong className="text-neutral-500 block">Valor Total</strong> <span className="font-bold text-primary">R${req.totalAmount.toFixed(2)}</span></div>
                </div>
                <div>
                    <strong className="text-neutral-500 block mb-2">Itens Solicitados</strong>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-100 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-2 font-semibold">Item</th>
                                    <th className="px-4 py-2 font-semibold text-center">Qtd</th>
                                    <th className="px-4 py-2 font-semibold text-right">Preço Unit.</th>
                                    <th className="px-4 py-2 font-semibold text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {req.items.map((item, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-2">{item.name}</td>
                                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                                        <td className="px-4 py-2 text-right">R${item.price.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right font-medium">R${(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    } else if (request.requestType === 'payment') {
        const req = request as PaymentRequest;
        return (
             <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div><strong className="text-neutral-500 block">Funcionário</strong> {req.employeeName}</div>
                    <div><strong className="text-neutral-500 block">Departamento</strong> {req.department}</div>
                    <div><strong className="text-neutral-500 block">Enviado em</strong> {new Date(req.submittedDate).toLocaleDateString()}</div>
                    <div><strong className="text-neutral-500 block">Fornecedor</strong> {req.supplier}</div>
                    <div><strong className="text-neutral-500 block">Nº da Fatura</strong> {req.invoiceNumber}</div>
                    <div><strong className="text-neutral-500 block">Vencimento</strong> {new Date(req.dueDate).toLocaleDateString()}</div>
                    <div className="col-span-3 text-lg"><strong className="text-neutral-500 block">Valor da Fatura</strong> <span className="font-bold text-primary">R${req.amount.toFixed(2)}</span></div>
                </div>
                {req.invoiceUrl && <div className="pt-4 text-center"><strong className="text-neutral-500 block mb-2">Fatura Anexada</strong><a href={req.invoiceUrl} target="_blank" rel="noopener noreferrer" className="inline-block border rounded-lg overflow-hidden transition-shadow hover:shadow-lg"><img src={req.invoiceUrl} alt="Invoice" className="object-cover h-96 w-auto" /></a></div>}
            </div>
        );
    }
    return null;
};


const ManagerView: React.FC<ManagerViewProps> = ({ context }) => {
  const { requests, updateRequestStatus, resetData } = context;
  const [selectedRequest, setSelectedRequest] = useState<FinancialRequest | null>(null);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<RequestType>('expense');

  const pendingRequests = useMemo(() => {
    const allPending = requests.filter(r => {
        if (r.requestType === 'expense') return r.status === ExpenseStatus.PENDING_MANAGER;
        if (r.requestType === 'purchase') return r.status === PurchaseStatus.PENDING_MANAGER;
        if (r.requestType === 'payment') return r.status === PaymentStatus.PENDING_MANAGER;
        return false;
    }).filter(r => r.requestType === activeTab);

    if (!searchTerm.trim()) return allPending;
    
    const lowercasedFilter = searchTerm.toLowerCase();
    return allPending.filter(req => 
        req.title.toLowerCase().includes(lowercasedFilter) ||
        req.employeeName.toLowerCase().includes(lowercasedFilter)
    );
  }, [requests, searchTerm, activeTab]);

  const stats = useMemo(() => ({
    pending: requests.filter(r => [ExpenseStatus.PENDING_MANAGER, PurchaseStatus.PENDING_MANAGER, PaymentStatus.PENDING_MANAGER].includes(r.status as any)).length,
    approved: requests.filter(r => [ExpenseStatus.APPROVED, PurchaseStatus.APPROVED, PaymentStatus.APPROVED].includes(r.status as any)).length,
    rejected: requests.filter(r => [ExpenseStatus.REJECTED, PurchaseStatus.REJECTED, PaymentStatus.REJECTED].includes(r.status as any)).length,
  }), [requests]);

  const handleOpenDetails = (request: FinancialRequest) => setSelectedRequest(request);
  const handleCloseDetails = () => setSelectedRequest(null);
  
  const handleApprove = () => {
      if(!selectedRequest) return;
      let nextStatus: FinancialRequestStatus = selectedRequest.status;
      if (selectedRequest.requestType === 'expense') {
        nextStatus = selectedRequest.amount > 500 ? ExpenseStatus.PENDING_FINANCE : ExpenseStatus.APPROVED;
      } else if (selectedRequest.requestType === 'purchase') {
        nextStatus = selectedRequest.totalAmount > 5000 ? PurchaseStatus.PENDING_FINANCE : PurchaseStatus.APPROVED;
      } else if (selectedRequest.requestType === 'payment') {
        nextStatus = PaymentStatus.PENDING_FINANCE;
      }
      updateRequestStatus(selectedRequest.id, nextStatus);
      handleCloseDetails();
  }
  
  const handleOpenRejectModal = () => setRejectModalOpen(true);
  
  const handleConfirmReject = () => {
      if(!selectedRequest || !rejectionReason) return;
      let rejectedStatus: FinancialRequestStatus = selectedRequest.status;
      if (selectedRequest.requestType === 'expense') rejectedStatus = ExpenseStatus.REJECTED;
      if (selectedRequest.requestType === 'purchase') rejectedStatus = PurchaseStatus.REJECTED;
      if (selectedRequest.requestType === 'payment') rejectedStatus = PaymentStatus.REJECTED;

      updateRequestStatus(selectedRequest.id, rejectedStatus, rejectionReason);
      setRejectModalOpen(false);
      setRejectionReason('');
      handleCloseDetails();
  }

  const getApproveButtonText = () => {
    if (!selectedRequest) return 'Aprovar';
    if (selectedRequest.requestType === 'expense' && selectedRequest.amount > 500) return 'Encaminhar para Financeiro';
    if (selectedRequest.requestType === 'purchase' && selectedRequest.totalAmount > 5000) return 'Encaminhar para Financeiro';
    if (selectedRequest.requestType === 'payment') return 'Encaminhar para Financeiro';
    return 'Aprovar';
  }

  const tabs: {id: RequestType, label: string}[] = [
      { id: 'expense', label: 'Reembolsos' },
      { id: 'purchase', label: 'Compras' },
      { id: 'payment', label: 'Pagamentos' },
  ];

  return (
    <div className="animate-slide-in-left">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-neutral-800">Painel de Aprovação do Gestor</h2>
        <button onClick={resetData} className="flex items-center text-sm text-neutral-500 hover:text-primary transition-colors"><ArrowPathIcon className="w-4 h-4 mr-1"/> Redefinir Dados</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total Pendente (Sua Ação)" value={stats.pending} icon={<ClockIcon className="w-10 h-10" />} borderColor="border-warning" />
        <DashboardCard title="Total Aprovado (Equipe)" value={stats.approved} icon={<CheckCircleIcon className="w-10 h-10" />} borderColor="border-success" />
        <DashboardCard title="Total Rejeitado (Equipe)" value={stats.rejected} icon={<XCircleIcon className="w-10 h-10" />} borderColor="border-danger" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200">
         <div className="border-b border-neutral-200 mb-4">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${
                            activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h3 className="text-xl font-semibold text-neutral-800">Solicitações Aguardando Sua Ação</h3>
          <div className="relative">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon className="w-5 h-5 text-neutral-400" /></span>
            <input type="text" placeholder="Buscar por funcionário ou título..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm w-full sm:w-64"/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-neutral-500">
            <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold">Título</th>
                <th scope="col" className="px-6 py-3 font-semibold">Funcionário</th>
                <th scope="col" className="px-6 py-3 font-semibold">Enviado em</th>
                <th scope="col" className="px-6 py-3 font-semibold text-right">Valor</th>
                <th scope="col" className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.length > 0 ? (
                pendingRequests.map(req => <RequestListItem key={req.id} request={req} onClick={() => handleOpenDetails(req)} />)
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-neutral-500">
                     <CheckCircleIcon className="w-12 h-12 text-success mx-auto mb-2" />
                     <p className="font-medium">Nenhuma solicitação pendente nesta categoria.</p>
                     <p className="text-sm">Ótimo trabalho!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={!!selectedRequest} onClose={handleCloseDetails} title={`Detalhes da Solicitação: ${selectedRequest?.id}`}>
        {selectedRequest && (
            <div>
                <RequestDetails request={selectedRequest} />
                <div className="mt-6 pt-4 border-t border-neutral-200 flex justify-end gap-3">
                    <button onClick={handleOpenRejectModal} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-danger hover:bg-red-600 transition-colors">Rejeitar</button>
                    <button onClick={handleApprove} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                      {getApproveButtonText()}
                    </button>
                </div>
            </div>
        )}
      </Modal>

       <Modal isOpen={isRejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Confirmar Rejeição">
           <div className="space-y-4">
               <p>Por favor, forneça um motivo para rejeitar esta solicitação. Isso será enviado ao funcionário.</p>
               <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={4} className="w-full border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" placeholder="ex: Despesa não coberta pela política da empresa."/>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium bg-neutral-200 hover:bg-neutral-300 transition-colors">Cancelar</button>
                    <button onClick={handleConfirmReject} disabled={!rejectionReason} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-danger hover:bg-red-600 disabled:bg-neutral-400 transition-colors">Confirmar Rejeição</button>
                </div>
           </div>
       </Modal>
    </div>
  );
};

export default ManagerView;