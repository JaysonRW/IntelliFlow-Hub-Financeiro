import React, { useState, useMemo } from 'react';
import { FinancialDataContextType } from '../hooks/useFinancialData';
import { ExpenseType, ExpenseRequest, PurchaseRequest, PaymentRequest, PurchaseItem } from '../types';
import { EXPENSE_TYPES, POLICY_LIMIT, MOCK_CURRENT_USER } from '../constants';
import { geminiService } from '../services/geminiService';
import { SparklesIcon, UploadIcon, CheckCircleIcon, CreditCardIcon, ShoppingCartIcon, UserIcon, XCircleIcon } from '../components/icons';
import MyRequestListItem from '../components/MyRequestListItem';

interface EmployeeViewProps {
  context: FinancialDataContextType;
}

type ActiveTab = 'expense' | 'purchase' | 'payment';

// Formulário de Reembolso
const ExpenseForm: React.FC<{ context: FinancialDataContextType }> = ({ context }) => {
    const defaultFormState = {
        title: '', description: '', date: new Date().toISOString().split('T')[0], amount: '',
        type: ExpenseType.ALIMENTACAO, policyViolated: false,
    };
    const [formState, setFormState] = useState(defaultFormState);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [policyWarning, setPolicyWarning] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newPolicyWarning = '';
        if (name === 'amount') {
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue) && numericValue > POLICY_LIMIT) {
                newPolicyWarning = `Este valor excede o limite da política da empresa de R$${POLICY_LIMIT}.`;
            }
        }
        setFormState(prev => ({ ...prev, [name]: value, policyViolated: !!newPolicyWarning }));
        if (name === 'amount') setPolicyWarning(newPolicyWarning);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setReceiptFile(e.target.files[0]);
    };

    const handleAIExtract = async () => {
        if (!receiptFile) return;
        setIsExtracting(true);
        try {
            const data = await geminiService.extractInfoFromReceipt(receiptFile);
            setFormState(prev => ({ ...prev, amount: String(data.amount), date: data.date, type: data.type, description: data.description }));
            if (data.amount > POLICY_LIMIT) {
                setPolicyWarning(`A IA detectou um valor de R$${data.amount} que excede o limite da política.`);
                setFormState(prev => ({ ...prev, policyViolated: true }));
            } else {
                setPolicyWarning('');
                setFormState(prev => ({ ...prev, policyViolated: false }));
            }
        } finally {
            setIsExtracting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Fix: Explicitly map MOCK_CURRENT_USER properties to the required `employeeName` and `employeeId` fields.
        const newRequest: Omit<ExpenseRequest, 'id' | 'submittedDate' | 'status' | 'requestType'> = {
            employeeName: MOCK_CURRENT_USER.EMPLOYEE.name,
            employeeId: MOCK_CURRENT_USER.EMPLOYEE.id,
            department: MOCK_CURRENT_USER.EMPLOYEE.department,
            ...formState, 
            amount: parseFloat(formState.amount),
        };
        context.addExpenseRequest(newRequest);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmissionSuccess(true);
            setFormState(defaultFormState);
            setReceiptFile(null);
            setPolicyWarning('');
            setTimeout(() => setSubmissionSuccess(false), 4000);
        }, 1000);
    };

    const formInputClasses = "mt-1 block w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:ring-primary focus:border-primary sm:text-sm text-neutral-900";
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
             {submissionSuccess && (
                <div className="bg-emerald-50 border-l-4 border-success text-emerald-800 p-4 rounded-md flex items-center" role="alert">
                <CheckCircleIcon className="w-6 h-6 mr-3" />
                <p className="font-medium">Sua solicitação de reembolso foi enviada com sucesso!</p>
                </div>
            )}
            {/* Campos do formulário de despesa */}
            <div><label htmlFor="title" className="block text-sm font-medium text-neutral-700">Título</label><input type="text" name="title" value={formState.title} onChange={handleInputChange} className={formInputClasses} required /></div>
            <div><label htmlFor="description" className="block text-sm font-medium text-neutral-700">Descrição</label><textarea name="description" rows={3} value={formState.description} onChange={handleInputChange} className={`${formInputClasses} min-h-[80px]`} required></textarea></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label htmlFor="date" className="block text-sm font-medium text-neutral-700">Data da Despesa</label><input type="date" name="date" value={formState.date} onChange={handleInputChange} className={formInputClasses} required /></div>
                <div><label htmlFor="amount" className="block text-sm font-medium text-neutral-700">Valor (R$)</label><input type="number" name="amount" value={formState.amount} onChange={handleInputChange} className={formInputClasses} placeholder="0,00" step="0.01" required /></div>
            </div>
            {policyWarning && <div className="md:col-span-2 bg-amber-50 border-l-4 border-warning text-amber-800 p-4 rounded-md text-sm"><p className="font-medium">{policyWarning}</p></div>}
            <div><label htmlFor="type" className="block text-sm font-medium text-neutral-700">Tipo de Despesa</label><select name="type" value={formState.type} onChange={handleInputChange} className={formInputClasses}>{EXPENSE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}</select></div>
            <div>
                <label className="block text-sm font-medium text-neutral-700">Anexo do Comprovante</label>
                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md bg-neutral-50">
                    <div className="space-y-1 text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-neutral-400" />
                        <div className="flex text-sm text-neutral-600"><label htmlFor="file-upload-expense" className="relative cursor-pointer bg-neutral-50 rounded-md font-medium text-primary hover:text-primary-dark"><span>Envie um arquivo</span><input id="file-upload-expense" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" /></label><p className="pl-1">ou arraste e solte</p></div>
                        <p className="text-xs text-neutral-500">{receiptFile ? `Selecionado: ${receiptFile.name}` : 'PNG, JPG, PDF até 10MB'}</p>
                    </div>
                </div>
            </div>
             <button type="button" onClick={handleAIExtract} disabled={!receiptFile || isExtracting} className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-accent to-secondary hover:opacity-90 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-opacity">{isExtracting ? 'Extraindo...' : <><SparklesIcon className="w-5 h-5 mr-2" />Preencher com IA</>}</button>
            <div className="pt-5 border-t border-neutral-200 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-neutral-400 transition-opacity">{isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}</button>
            </div>
        </form>
    );
};

// Formulário de Pedido de Compra
const PurchaseForm: React.FC<{ context: FinancialDataContextType }> = ({ context }) => {
    const defaultItem = { name: '', quantity: 1, price: '' };
    const defaultFormState = { title: '', supplier: '', costCenter: '' };

    const [formState, setFormState] = useState(defaultFormState);
    // Fix: Correctly type the `items` state as an array of objects to resolve multiple compilation errors.
    const [items, setItems] = useState<(Omit<PurchaseItem, 'price'> & { price: string })[]>([defaultItem]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: keyof typeof defaultItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const addItem = () => setItems([...items, defaultItem]);
    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const totalAmount = useMemo(() => 
        items.reduce((sum, item) => {
            const price = parseFloat(item.price);
            const quantity = Number(item.quantity);
            return sum + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity);
        }, 0), [items]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const purchaseItems: PurchaseItem[] = items.map(item => ({
            ...item,
            price: parseFloat(item.price),
        }));

        // Fix: Explicitly map MOCK_CURRENT_USER properties to the required `employeeName` and `employeeId` fields.
        const newRequest: Omit<PurchaseRequest, 'id' | 'submittedDate' | 'status' | 'requestType'> = {
            employeeName: MOCK_CURRENT_USER.EMPLOYEE.name,
            employeeId: MOCK_CURRENT_USER.EMPLOYEE.id,
            department: MOCK_CURRENT_USER.EMPLOYEE.department,
            ...formState,
            items: purchaseItems,
            totalAmount,
        };
        context.addPurchaseRequest(newRequest);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmissionSuccess(true);
            setFormState(defaultFormState);
            setItems([defaultItem]);
            setTimeout(() => setSubmissionSuccess(false), 4000);
        }, 1000);
    };

    const formInputClasses = "mt-1 block w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:ring-primary focus:border-primary sm:text-sm text-neutral-900";

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            {submissionSuccess && (
                <div className="bg-emerald-50 border-l-4 border-success text-emerald-800 p-4 rounded-md flex items-center" role="alert">
                    <CheckCircleIcon className="w-6 h-6 mr-3" />
                    <p className="font-medium">Seu pedido de compra foi enviado com sucesso!</p>
                </div>
            )}
            <div><label htmlFor="title" className="block text-sm font-medium text-neutral-700">Título da Solicitação</label><input type="text" name="title" value={formState.title} onChange={handleInputChange} className={formInputClasses} required /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label htmlFor="supplier" className="block text-sm font-medium text-neutral-700">Fornecedor Sugerido</label><input type="text" name="supplier" value={formState.supplier} onChange={handleInputChange} className={formInputClasses} required /></div>
                <div><label htmlFor="costCenter" className="block text-sm font-medium text-neutral-700">Centro de Custo</label><input type="text" name="costCenter" value={formState.costCenter} onChange={handleInputChange} className={formInputClasses} placeholder="ex: VENDAS-TI" required /></div>
            </div>
            
            <div className="space-y-4">
                <label className="block text-sm font-medium text-neutral-700">Itens</label>
                {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 bg-neutral-50 rounded-lg border">
                        <div className="col-span-6"><input type="text" placeholder="Nome do Item" value={item.name} onChange={e => handleItemChange(index, 'name', e.target.value)} className={formInputClasses + " mt-0"} required /></div>
                        <div className="col-span-2"><input type="number" placeholder="Qtd" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} min="1" className={formInputClasses + " mt-0"} required /></div>
                        <div className="col-span-3"><input type="number" placeholder="Preço (R$)" value={item.price} onChange={e => handleItemChange(index, 'price', e.target.value)} step="0.01" className={formInputClasses + " mt-0"} required /></div>
                        <div className="col-span-1 text-right">
                            <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1} className="text-neutral-400 hover:text-danger disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors">
                                <XCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ))}
                 <button type="button" onClick={addItem} className="text-sm font-medium text-primary hover:text-primary-dark">+ Adicionar Item</button>
            </div>
            
             <div className="text-right">
                <p className="text-neutral-600">Total do Pedido:</p>
                <p className="text-3xl font-bold text-primary">R${totalAmount.toFixed(2)}</p>
            </div>

            <div className="pt-5 border-t border-neutral-200 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-neutral-400 transition-opacity">{isSubmitting ? 'Enviando...' : 'Enviar Pedido'}</button>
            </div>
        </form>
    );
};

// Formulário de Pagamento a Fornecedor
const PaymentForm: React.FC<{ context: FinancialDataContextType }> = ({ context }) => {
    const defaultFormState = {
        title: '',
        supplier: '',
        invoiceNumber: '',
        dueDate: new Date().toISOString().split('T')[0],
        amount: '',
    };
    const [formState, setFormState] = useState(defaultFormState);
    const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setInvoiceFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Fix: Explicitly map MOCK_CURRENT_USER properties to the required `employeeName` and `employeeId` fields.
        const newRequest: Omit<PaymentRequest, 'id' | 'submittedDate' | 'status' | 'requestType'> = {
            employeeName: MOCK_CURRENT_USER.EMPLOYEE.name,
            employeeId: MOCK_CURRENT_USER.EMPLOYEE.id,
            department: MOCK_CURRENT_USER.EMPLOYEE.department,
            ...formState,
            amount: parseFloat(formState.amount),
        };

        context.addPaymentRequest(newRequest);
        
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmissionSuccess(true);
            setFormState(defaultFormState);
            setInvoiceFile(null);
            setTimeout(() => setSubmissionSuccess(false), 4000);
        }, 1000);
    };

    const formInputClasses = "mt-1 block w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:ring-primary focus:border-primary sm:text-sm text-neutral-900";

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            {submissionSuccess && (
                <div className="bg-emerald-50 border-l-4 border-success text-emerald-800 p-4 rounded-md flex items-center" role="alert">
                    <CheckCircleIcon className="w-6 h-6 mr-3" />
                    <p className="font-medium">Sua solicitação de pagamento foi enviada com sucesso!</p>
                </div>
            )}
            <div><label htmlFor="title" className="block text-sm font-medium text-neutral-700">Título da Solicitação</label><input type="text" name="title" value={formState.title} onChange={handleInputChange} className={formInputClasses} required /></div>
            <div><label htmlFor="supplier" className="block text-sm font-medium text-neutral-700">Fornecedor</label><input type="text" name="supplier" value={formState.supplier} onChange={handleInputChange} className={formInputClasses} required /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label htmlFor="invoiceNumber" className="block text-sm font-medium text-neutral-700">Número da Fatura</label><input type="text" name="invoiceNumber" value={formState.invoiceNumber} onChange={handleInputChange} className={formInputClasses} required /></div>
                <div><label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700">Data de Vencimento</label><input type="date" name="dueDate" value={formState.dueDate} onChange={handleInputChange} className={formInputClasses} required /></div>
            </div>
            <div><label htmlFor="amount" className="block text-sm font-medium text-neutral-700">Valor (R$)</label><input type="number" name="amount" value={formState.amount} onChange={handleInputChange} className={formInputClasses} placeholder="0,00" step="0.01" required /></div>
            <div>
                <label className="block text-sm font-medium text-neutral-700">Anexo da Fatura</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md bg-neutral-50">
                    <div className="space-y-1 text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-neutral-400" />
                        <div className="flex text-sm text-neutral-600"><label htmlFor="file-upload-payment" className="relative cursor-pointer bg-neutral-50 rounded-md font-medium text-primary hover:text-primary-dark"><span>Envie um arquivo</span><input id="file-upload-payment" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" /></label><p className="pl-1">ou arraste e solte</p></div>
                        <p className="text-xs text-neutral-500">{invoiceFile ? `Selecionado: ${invoiceFile.name}` : 'PNG, JPG, PDF até 10MB'}</p>
                    </div>
                </div>
            </div>
            <div className="pt-5 border-t border-neutral-200 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-neutral-400 transition-opacity">{isSubmitting ? 'Enviando...' : 'Enviar Pagamento'}</button>
            </div>
        </form>
    );
};


const EmployeeView: React.FC<EmployeeViewProps> = ({ context }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('expense');

    const myRequests = useMemo(() => 
        context.requests.filter(req => req.employeeId === MOCK_CURRENT_USER.EMPLOYEE.id),
        [context.requests]
    );

    const renderForm = () => {
        switch (activeTab) {
            case 'expense': return <ExpenseForm context={context} />;
            case 'purchase': return <PurchaseForm context={context} />;
            case 'payment': return <PaymentForm context={context} />;
            default: return null;
        }
    };
    
    const tabs = [
        { id: 'expense', label: 'Reembolso de Despesas', icon: <UserIcon className="w-5 h-5" /> },
        { id: 'purchase', label: 'Pedido de Compra', icon: <ShoppingCartIcon className="w-5 h-5" /> },
        { id: 'payment', label: 'Pagamento a Fornecedor', icon: <CreditCardIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-slide-in-left">
            <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold mb-6 text-neutral-800">Central de Solicitações</h2>

                <div className="mb-6 border-b border-neutral-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as ActiveTab)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                                } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                                {tab.icon}
                                <span className="ml-2">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg border border-neutral-200">
                    {renderForm()}
                </div>
            </div>
            <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-6 text-neutral-800">Minhas Solicitações</h2>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200 space-y-3 max-h-[80vh] overflow-y-auto">
                    {myRequests.length > 0 ? (
                        myRequests.map(req => <MyRequestListItem key={req.id} request={req} />)
                    ) : (
                        <div className="text-center py-12 text-neutral-500">
                            <p>Você ainda não tem nenhuma solicitação.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeView;