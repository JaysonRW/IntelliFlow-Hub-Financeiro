import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FinancialDataContextType } from '../hooks/useFinancialData';
import { ExpenseStatus, ExpenseType, PurchaseStatus, PaymentStatus, FinancialRequest } from '../types';
import DashboardCard from '../components/DashboardCard';
import { ClockIcon, CheckCircleIcon, SparklesIcon } from '../components/icons';
import { geminiService } from '../services/geminiService';

interface FinanceViewProps {
  context: FinancialDataContextType;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const FinanceView: React.FC<FinanceViewProps> = ({ context }) => {
  const { requests } = context;
  const [reportQuery, setReportQuery] = useState('');
  const [reportResult, setReportResult] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const stats = useMemo(() => {
    const pendingFinance = requests.filter(r => r.status === ExpenseStatus.PENDING_FINANCE || r.status === PurchaseStatus.PENDING_FINANCE || r.status === PaymentStatus.PENDING_FINANCE);
    const totalPending = requests.filter(r => r.status.startsWith('Aguardando'));
    
    const getAmount = (req: FinancialRequest) => {
        if (req.requestType === 'purchase') return req.totalAmount;
        return req.amount;
    }

    return {
      pendingFinanceCount: pendingFinance.length,
      pendingFinanceValue: pendingFinance.reduce((sum, r) => sum + getAmount(r), 0),
      totalPendingValue: totalPending.reduce((sum, r) => sum + getAmount(r), 0),
    };
  }, [requests]);

  const statusData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    requests.forEach(r => {
        counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, 'Solicitações': value }));
  }, [requests]);

  const categoryData = useMemo(() => {
     const spending: { [key: string]: number } = {};
     requests.forEach(r => {
        if (r.requestType === 'expense' && (r.status === ExpenseStatus.APPROVED || r.status === ExpenseStatus.PENDING_FINANCE)) {
            spending[r.type] = (spending[r.type] || 0) + r.amount;
        }
     });
    return Object.entries(spending).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) })).filter(item => item.value > 0);
  }, [requests]);

  const handleGenerateReport = async () => {
      if(!reportQuery) return;
      setIsGeneratingReport(true);
      setReportResult('');
      try {
          const result = await geminiService.getFinancialReport(reportQuery);
          setReportResult(result);
      } catch (error) {
          console.error("Falha ao gerar relatório", error);
          setReportResult("Ocorreu um erro ao gerar o relatório.");
      } finally {
          setIsGeneratingReport(false);
      }
  }


  return (
    <div className="animate-slide-in-left space-y-8">
      <h2 className="text-3xl font-bold text-neutral-800">Painel do Departamento Financeiro</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Aprovação Financeira Pendente" value={stats.pendingFinanceCount} icon={<ClockIcon className="w-10 h-10" />} borderColor="border-blue-500" />
        <DashboardCard title="Valor Total Pendente (Todos)" value={`R$${stats.totalPendingValue.toFixed(2)}`} icon={<CheckCircleIcon className="w-10 h-10" />} borderColor="border-primary" />
        <DashboardCard title="Valor p/ Pagamento (Aprovação Final)" value={`R$${stats.pendingFinanceValue.toFixed(2)}`} icon={<SparklesIcon className="w-10 h-10" />} borderColor="border-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg border border-neutral-200">
            <h3 className="text-xl font-semibold mb-4 text-neutral-800">Visão Geral por Status</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" fontSize={10} tick={{ fill: '#64748b' }} angle={-20} textAnchor="end" height={60} />
                    <YAxis tick={{ fill: '#64748b' }}/>
                    <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}/>
                    <Legend />
                    <Bar dataKey="Solicitações" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-neutral-200">
            <h3 className="text-xl font-semibold mb-4 text-neutral-800">Gastos por Categoria (Reembolsos)</h3>
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                          const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                          return (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}>
                        {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => `R$${value.toFixed(2)}`}/>
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
      
       <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200">
          <h3 className="text-xl font-semibold mb-4 text-neutral-800 flex items-center">
            <SparklesIcon className="w-6 h-6 mr-2 text-accent"/>
            Relatórios Inteligentes
          </h3>
          <p className="text-sm text-neutral-600 mb-4">Faça uma pergunta em linguagem natural para obter insights de seus dados financeiros com o poder da IA.</p>
          <div className="flex gap-2">
            <input 
              type="text"
              value={reportQuery}
              onChange={(e) => setReportQuery(e.target.value)}
              placeholder="ex: Analise o fluxo de caixa para o próximo mês"
              className="flex-grow border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            />
            <button onClick={handleGenerateReport} disabled={isGeneratingReport || !reportQuery} className="px-6 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:bg-neutral-400 transition-opacity">
              {isGeneratingReport ? 'Gerando...' : 'Gerar'}
            </button>
          </div>
          { (isGeneratingReport || reportResult) &&
            <div className="mt-4 p-4 bg-neutral-50 rounded-md border border-neutral-200 animate-fade-in">
                {isGeneratingReport ? (
                    <div className="flex items-center text-neutral-500">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Gerando relatório, por favor aguarde...</span>
                    </div>
                ) : (
                    <p className="text-neutral-800 whitespace-pre-wrap font-medium">{reportResult}</p>
                )}
            </div>
          }
       </div>

    </div>
  );
};

export default FinanceView;