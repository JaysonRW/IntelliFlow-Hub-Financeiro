import { ExpenseType } from './types';

export const POLICY_LIMIT = 500;

export const EXPENSE_TYPES: ExpenseType[] = [
  ExpenseType.ALIMENTACAO,
  ExpenseType.TRANSPORTE,
  ExpenseType.HOSPEDAGEM,
  ExpenseType.MATERIAL_ESCRITORIO,
  ExpenseType.OUTROS,
];

export const MOCK_CURRENT_USER = {
    EMPLOYEE: { name: 'Alex Johnson', id: 'E-123', department: 'Tecnologia' },
    MANAGER: { name: 'Samantha Carter', id: 'M-456', department: 'Tecnologia' },
    FINANCE: { name: 'Daniel Jackson', id: 'F-789', department: 'Financeiro' }
};
