import React from 'react';
import { FinancialRequestStatus, ExpenseStatus, PurchaseStatus, PaymentStatus } from '../types';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface StatusIndicatorProps {
  status: FinancialRequestStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  // Fix: The statusConfig object had duplicate keys because different enums (ExpenseStatus, PurchaseStatus, PaymentStatus)
  // shared the same string values (e.g., 'Aprovado'). This has been corrected by defining each unique status string value only once.
  const statusConfig: { [key in FinancialRequestStatus]?: { icon: React.ReactNode; text: string; bg: string } } = {
    // Common Statuses
    [ExpenseStatus.PENDING_MANAGER]: { icon: <ClockIcon className="w-4 h-4" />, text: 'text-amber-800', bg: 'bg-amber-100' },
    [ExpenseStatus.PENDING_FINANCE]: { icon: <ClockIcon className="w-4 h-4" />, text: 'text-blue-800', bg: 'bg-blue-100' },
    [ExpenseStatus.APPROVED]: { icon: <CheckCircleIcon className="w-4 h-4" />, text: 'text-emerald-800', bg: 'bg-emerald-100' },
    [ExpenseStatus.REJECTED]: { icon: <XCircleIcon className="w-4 h-4" />, text: 'text-red-800', bg: 'bg-red-100' },
    // Purchase-specific Status
    [PurchaseStatus.ORDERED]: { icon: <CheckCircleIcon className="w-4 h-4" />, text: 'text-indigo-800', bg: 'bg-indigo-100' },
    // Payment-specific Status
    [PaymentStatus.PAID]: { icon: <CheckCircleIcon className="w-4 h-4" />, text: 'text-green-800', bg: 'bg-green-100' },
  };

  const config = statusConfig[status];

  if (!config) {
    return <span className="text-xs">Status Desconhecido</span>;
  }

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      <span className="ml-1.5">{status}</span>
    </div>
  );
};

export default StatusIndicator;