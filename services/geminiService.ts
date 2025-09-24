import { ExpenseType } from '../types';

interface ExtractedReceiptData {
    amount: number;
    date: string;
    type: ExpenseType;
    description: string;
}

// Mock service to simulate Gemini API calls
export const geminiService = {
  extractInfoFromReceipt: async (file: File): Promise<ExtractedReceiptData> => {
    console.log('Simulando extração de IA para o arquivo:', file.name);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock data
    return {
      amount: 89.90,
      date: '2024-07-20',
      type: ExpenseType.ALIMENTACAO,
      description: 'Almoço de negócios com parceiros no "The Grand Bistro".',
    };
  },

  getFinancialReport: async (query: string): Promise<string> => {
    console.log('Simulando geração de relatório de IA para a consulta:', query);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (query.toLowerCase().includes('transporte')) {
        return "Com base nos dados fornecidos, as despesas totais com transporte nos últimos 6 meses somam R$ 480,00. Isso consiste em uma única despesa significativa para viagem de conferência.";
    }
    if (query.toLowerCase().includes('fluxo de caixa')) {
        return "A análise preditiva sugere uma saída de caixa potencial de aproximadamente R$ 775,50 em reembolsos pendentes nas próximas duas semanas. É aconselhável manter uma reserva para novas solicitações, estimada em R$ 500 adicionais.";
    }
    
    return "Posso fornecer insights sobre despesas, fluxo de caixa e padrões de gastos. Por exemplo, tente perguntar: 'Gere um relatório de todas as despesas de transporte' ou 'Analise o fluxo de caixa para o próximo mês'.";
  }
};
