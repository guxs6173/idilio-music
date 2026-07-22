import { useState, FormEvent } from 'react';
import { PlusCircle, FileText, ChevronDown } from 'lucide-react';
import { ExpenseCategory } from '../types';

interface AddExpenseCardProps {
  onAddExpense: (description: string, amount: number, category: ExpenseCategory) => void;
}

export default function AddExpenseCard({ onAddExpense }: AddExpenseCardProps) {
  const [description, setDescription] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('VIÁTICOS');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Por favor, ingresa una descripción.');
      return;
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      setError('Por favor, ingresa un monto válido mayor a 0.');
      return;
    }

    onAddExpense(description.trim(), amount, category);
    
    // Reset state
    setDescription('');
    setAmountStr('');
    setCategory('VIÁTICOS');
  };

  return (
    <div id="card-gasto-adicional" className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
      {/* Title section with PlusCircle icon */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-emerald-50 rounded-lg text-primary">
          <PlusCircle className="w-5 h-5 text-primary" />
        </div>
        <h2 className="font-display font-bold text-lg text-slate-800">Gasto Adicional</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Descripción Input */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
            Descripción
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary focus:ring-3 focus:ring-primary/10 text-slate-700 text-sm font-medium transition-all"
            placeholder="Ej: Peajes, Almuerzo..."
          />
        </div>

        {/* Monto and Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Monto (Soles) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
              Monto (Soles)
            </label>
            <div className="relative rounded-xl bg-slate-50 border border-slate-100 focus-within:bg-white focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/10 transition-all">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-slate-400 font-semibold text-sm">S/.</span>
              </div>
              <input
                type="number"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="block w-full pl-11 pr-4 py-2.5 bg-transparent text-slate-700 font-medium text-sm focus:outline-hidden"
                placeholder="0.00"
                step="any"
              />
            </div>
          </div>

          {/* Categoría Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
              Categoría
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary focus:ring-3 focus:ring-primary/10 text-slate-700 text-sm font-medium transition-all appearance-none pr-10"
              >
                <option value="VIÁTICOS">Viáticos</option>
                <option value="GASTOS IMPREVISTOS">Gastos Imprevistos</option>
                <option value="DEDUCCIÓN FIJA">Deducción Fija</option>
                <option value="OTROS">Otros</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs font-semibold text-rose-500 bg-rose-50 p-2.5 rounded-lg border border-rose-100 animate-pulse">
            {error}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          id="btn-add-expense"
          className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-primary hover:bg-primary-dark active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          Registrar Gasto
        </button>
      </form>
    </div>
  );
}
