export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  FINANCE = 'FINANCE',
}

// --- Tipos de Reembolso de Despesas ---
export enum ExpenseStatus {
  PENDING_MANAGER = 'Aguardando Aprovação do Gestor',
  PENDING_FINANCE = 'Aguardando Aprovação do Financeiro',
  APPROVED = 'Aprovado',
  REJECTED = 'Rejeitado',
}

export enum ExpenseType {
    ALIMENTACAO = 'Alimentação',
    TRANSPORTE = 'Transporte',
    HOSPEDAGEM = 'Hospedagem',
    MATERIAL_ESCRITORIO = 'Material de Escritório',
    OUTROS = 'Outros',
}

export interface ExpenseRequest {
  requestType: 'expense';
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  title: string;
  description: string;
  date: string;
  amount: number;
  type: ExpenseType;
  status: ExpenseStatus;
  submittedDate: string;
  receiptUrl?: string;
  policyViolated: boolean;
  rejectionReason?: string;
}

// --- Tipos de Pedido de Compra ---
export enum PurchaseStatus {
  PENDING_MANAGER = 'Aguardando Aprovação do Gestor',
  PENDING_FINANCE = 'Aguardando Aprovação do Financeiro',
  APPROVED = 'Aprovado',
  REJECTED = 'Rejeitado',
  ORDERED = 'Pedido Realizado',
}

export interface PurchaseItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PurchaseRequest {
  requestType: 'purchase';
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  title: string;
  supplier: string;
  items: PurchaseItem[];
  totalAmount: number;
  costCenter: string;
  status: PurchaseStatus;
  submittedDate: string;
  rejectionReason?: string;
}

// --- Tipos de Pagamento a Fornecedor ---
export enum PaymentStatus {
  PENDING_MANAGER = 'Aguardando Aprovação do Gestor',
  PENDING_FINANCE = 'Aguardando Aprovação do Financeiro',
  APPROVED = 'Aprovado',
  PAID = 'Pago',
  REJECTED = 'Rejeitado',
}

export interface PaymentRequest {
  requestType: 'payment';
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  title: string;
  supplier: string;
  invoiceNumber: string;
  dueDate: string;
  amount: number;
  status: PaymentStatus;
  submittedDate: string;
  invoiceUrl?: string;
  rejectionReason?: string;
}


export interface User {
    name: string;
    role: string;
}

// --- Tipo de União para todas as solicitações ---
export type FinancialRequest = ExpenseRequest | PurchaseRequest | PaymentRequest;

export type FinancialRequestStatus = ExpenseStatus | PurchaseStatus | PaymentStatus;