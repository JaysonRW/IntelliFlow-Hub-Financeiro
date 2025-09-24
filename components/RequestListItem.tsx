import React from 'react';
import { FinancialRequest, ExpenseRequest } from '../types';
import StatusIndicator from './StatusIndicator';

interface RequestListItemProps {
  request: FinancialRequest;
  onClick: () => void;
}

const RequestListItem: React.FC<RequestListItemProps> = ({ request, onClick }) => {
  const getAmount = () => {
    if (request.requestType === 'purchase') {
      return request.totalAmount;
    }
    return request.amount;
  };
  
  const hasPolicyAlert = request.requestType === 'expense' && (request as ExpenseRequest).policyViolated;

  return (
    <tr
      className="bg-white hover:bg-neutral-50 cursor-pointer transition-colors duration-200 border-b border-neutral-200 last:border-b-0"
      onClick={onClick}
    >
      <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">
        {request.title}
        {hasPolicyAlert && <span className="ml-2 text-xs font-bold text-danger">(Alerta de Política)</span>}
      </td>
      <td className="px-6 py-4 text-neutral-600">{request.employeeName}</td>
      <td className="px-6 py-4 text-neutral-600">{new Date(request.submittedDate).toLocaleDateString()}</td>
      <td className="px-6 py-4 font-semibold text-right text-neutral-800">
        R${getAmount().toFixed(2)}
      </td>
      <td className="px-6 py-4">
        <StatusIndicator status={request.status} />
      </td>
    </tr>
  );
};

export default RequestListItem;