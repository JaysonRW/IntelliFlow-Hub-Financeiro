import React from 'react';
import { FinancialRequest } from '../types';
import StatusIndicator from './StatusIndicator';

interface MyRequestListItemProps {
  request: FinancialRequest;
}

const MyRequestListItem: React.FC<MyRequestListItemProps> = ({ request }) => {

  const getAmount = () => {
    if (request.requestType === 'purchase') {
      return request.totalAmount;
    }
    return request.amount;
  }

  const getTypeLabel = () => {
    switch (request.requestType) {
      case 'expense': return 'Reembolso';
      case 'purchase': return 'Compra';
      case 'payment': return 'Pagamento';
      default: return 'Solicitação';
    }
  }

  return (
    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors">
      <div className="flex justify-between items-start">
        <div>
            <p className="font-semibold text-neutral-800">{request.title}</p>
            <p className="text-xs text-neutral-500">{getTypeLabel()} · Enviado em: {new Date(request.submittedDate).toLocaleDateString()}</p>
        </div>
        <p className="font-bold text-lg text-primary">R${getAmount().toFixed(2)}</p>
      </div>
      <div className="mt-3">
        <StatusIndicator status={request.status} />
      </div>
    </div>
  );
};

export default MyRequestListItem;