import { useState } from 'react';
import { 
    ExpenseRequest, ExpenseStatus, ExpenseType,
    PurchaseRequest, PurchaseStatus,
    PaymentRequest, PaymentStatus,
    FinancialRequest,
    FinancialRequestStatus,
    PurchaseItem
} from '../types';

const initialRequests: FinancialRequest[] = [
    {
        requestType: 'expense', id: 'REQ001', employeeName: 'Alex Johnson', employeeId: 'E-123', department: 'Tecnologia',
        title: 'Almoço com Cliente', description: 'Almoço com cliente em potencial da Acme Corp.',
        date: '2024-07-15', amount: 125.50, type: ExpenseType.ALIMENTACAO, status: ExpenseStatus.PENDING_MANAGER,
        submittedDate: '2024-07-16', receiptUrl: 'https://picsum.photos/seed/receipt1/400/600', policyViolated: false
    },
    {
        requestType: 'purchase', id: 'PC001', employeeName: 'Maria Garcia', employeeId: 'E-124', department: 'Vendas',
        title: 'Novos Laptops para a Equipe de Vendas', supplier: 'TechSupplier Inc.',
        items: [{ name: 'Laptop Pro X', quantity: 2, price: 4500 }], totalAmount: 9000.00,
        costCenter: 'VENDAS-EQUIP', status: PurchaseStatus.PENDING_MANAGER, submittedDate: '2024-07-18'
    },
    {
        requestType: 'payment', id: 'PAG001', employeeName: 'David Chen', employeeId: 'E-125', department: 'Marketing',
        title: 'Pagamento de Fatura de Marketing', supplier: 'Creative Solutions LLC',
        invoiceNumber: 'CS-2024-589', dueDate: '2024-08-01', amount: 2500.00,
        status: PaymentStatus.PENDING_FINANCE, submittedDate: '2024-07-19', invoiceUrl: 'https://picsum.photos/seed/invoice1/400/600'
    },
    {
        requestType: 'expense', id: 'REQ002', employeeName: 'Maria Garcia', employeeId: 'E-124', department: 'Vendas',
        title: 'Compra de Material de Escritório', description: 'Compra de novos teclados e mouses para a equipe.',
        date: '2024-07-12', amount: 650.00, type: ExpenseType.MATERIAL_ESCRITORIO, status: ExpenseStatus.PENDING_MANAGER,
        submittedDate: '2024-07-14', receiptUrl: 'https://picsum.photos/seed/receipt2/400/600', policyViolated: true
    },
    {
        requestType: 'expense', id: 'REQ003', employeeName: 'David Chen', employeeId: 'E-125', department: 'Marketing',
        title: 'Viagem para Conferência', description: 'Despesas de viagem para o Summit Anual de Marketing.',
        date: '2024-07-10', amount: 480.00, type: ExpenseType.TRANSPORTE, status: ExpenseStatus.PENDING_FINANCE,
        submittedDate: '2024-07-11', receiptUrl: 'https://picsum.photos/seed/receipt3/400/600', policyViolated: false
    },
    {
        requestType: 'expense', id: 'REQ004', employeeName: 'Alex Johnson', employeeId: 'E-123', department: 'Tecnologia',
        title: 'Assinatura de Software', description: 'Assinatura anual para plugin de editor de código.',
        date: '2024-07-05', amount: 49.99, type: ExpenseType.OUTROS, status: ExpenseStatus.APPROVED,
        submittedDate: '2024-07-06', receiptUrl: 'https://picsum.photos/seed/receipt4/400/600', policyViolated: false
    },
     {
        requestType: 'purchase', id: 'PC002', employeeName: 'Alex Johnson', employeeId: 'E-123', department: 'Tecnologia',
        title: 'Monitores para Desenvolvedores', supplier: 'Display Excellence',
        items: [{ name: 'Monitor UltraWide 34"', quantity: 3, price: 2200 }], totalAmount: 6600.00,
        costCenter: 'TEC-DEVOPS', status: PurchaseStatus.APPROVED, submittedDate: '2024-07-10'
    },
    {
        requestType: 'expense', id: 'REQ005', employeeName: 'Maria Garcia', employeeId: 'E-124', department: 'Vendas',
        title: 'Jantar da Equipe', description: 'Jantar para celebrar as metas de vendas do segundo trimestre.',
        date: '2024-06-28', amount: 350.00, type: ExpenseType.ALIMENTACAO, status: ExpenseStatus.REJECTED,
        submittedDate: '2024-06-29', receiptUrl: 'https://picsum.photos/seed/receipt5/400/600', policyViolated: false, rejectionReason: 'Despesas de entretenimento requerem pré-aprovação.'
    },
];


export const useFinancialData = () => {
  const [requests, setRequests] = useState<FinancialRequest[]>(initialRequests);

  const addExpenseRequest = (newRequest: Omit<ExpenseRequest, 'id' | 'submittedDate' | 'status' | 'requestType'>) => {
    setRequests(prev => [
      {
        ...newRequest,
        requestType: 'expense',
        id: `REQ${String(prev.filter(r => r.requestType === 'expense').length + 1).padStart(3, '0')}`,
        submittedDate: new Date().toISOString().split('T')[0],
        status: ExpenseStatus.PENDING_MANAGER,
      },
      ...prev,
    ]);
  };

  const addPurchaseRequest = (newRequest: Omit<PurchaseRequest, 'id' | 'submittedDate' | 'status' | 'requestType'>) => {
    setRequests(prev => [
      {
        ...newRequest,
        requestType: 'purchase',
        id: `PC${String(prev.filter(r => r.requestType === 'purchase').length + 1).padStart(3, '0')}`,
        submittedDate: new Date().toISOString().split('T')[0],
        status: PurchaseStatus.PENDING_MANAGER,
      },
      ...prev,
    ]);
  };
  
  const addPaymentRequest = (newRequest: Omit<PaymentRequest, 'id' | 'submittedDate' | 'status' | 'requestType'>) => {
    setRequests(prev => [
      {
        ...newRequest,
        requestType: 'payment',
        id: `PAG${String(prev.filter(r => r.requestType === 'payment').length + 1).padStart(3, '0')}`,
        submittedDate: new Date().toISOString().split('T')[0],
        status: PaymentStatus.PENDING_MANAGER,
      },
      ...prev,
    ]);
  };

  const updateRequestStatus = (id: string, status: FinancialRequestStatus, reason?: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: status as any, rejectionReason: reason } : req
      )
    );
  };
  
  const resetData = () => {
    setRequests(initialRequests);
  };

  return { 
    requests, 
    addExpenseRequest, 
    addPurchaseRequest,
    addPaymentRequest,
    updateRequestStatus, 
    resetData 
  };
};

export type FinancialDataContextType = ReturnType<typeof useFinancialData>;