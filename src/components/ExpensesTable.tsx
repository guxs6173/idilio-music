import { useState } from 'react';
import { Filter, Download, Trash2, Search, SlidersHorizontal, Lock, ArrowUpDown, RefreshCw, Printer } from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ExpensesTableProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onDownloadPDF?: () => void;
}

export default function ExpensesTable({ expenses, onDeleteExpense, onDownloadPDF }: ExpensesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'TODOS'>('TODOS');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Format helper
  const formatCurrency = (val: number) => {
    return 'S/. ' + val.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Category Colors
  const getCategoryBadgeClass = (category: ExpenseCategory) => {
    switch (category) {
      case 'VIÁTICOS':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'GASTOS IMPREVISTOS':
        return 'bg-teal-50 text-teal-700 border border-teal-100';
      case 'DEDUCCIÓN FIJA':
        return 'bg-cyan-50 text-cyan-700 border border-cyan-100';
      case 'OTROS':
        return 'bg-slate-50 text-slate-700 border border-slate-100';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  // Filtering logic
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'TODOS' || exp.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sorting logic
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortBy === 'description') {
      comparison = a.description.localeCompare(b.description);
    } else {
      // Date sort
      // To simulate sorting 21 Jul / 20 jul properly:
      const dateA = a.date.toLowerCase();
      const dateB = b.date.toLowerCase();
      comparison = dateA.localeCompare(dateB);
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const toggleSort = (field: 'date' | 'amount' | 'description') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      let csvContent = 'data:text/csv;charset=utf-8,\uFEFF'; // include UTF-8 BOM
      csvContent += 'Fecha,Descripción,Categoría,Monto,Tipo\n';
      
      expenses.forEach((exp) => {
        const type = exp.isFixedDeduction ? 'Deducción Fija' : 'Gasto Adicional';
        csvContent += `"${exp.date}","${exp.description.replace(/"/g, '""')}","${exp.category}",${exp.amount},"${type}"\n`;
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `detalle_egresos_idilio_music.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 800);
  };

  return (
    <div id="table-card" className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Header and Actions Panel */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-slate-800 tracking-tight">
            Detalle de Egresos
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Historial de pagos y gastos operativos del evento.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Search bar inside header */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/10 w-44 sm:w-56 transition-all"
              placeholder="Buscar egreso..."
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Filter toggle */}
          <button
            id="btn-filter"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              showFilterMenu || selectedCategory !== 'TODOS'
                ? 'bg-primary-light text-primary border-primary/20'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Filtrar por Categoría"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden lg:inline">Filtrar</span>
          </button>

          {/* Export CSV button */}
          <button
            id="btn-export"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="p-2 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
            title="Exportar a CSV"
          >
            {isExporting ? (
              <RefreshCw className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="hidden lg:inline">{isExporting ? 'Exportando' : 'Exportar'}</span>
          </button>

          {/* Print report button */}
          {onDownloadPDF && (
            <button
              id="btn-print-table"
              onClick={onDownloadPDF}
              className="p-2 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Descargar Reporte en PDF"
            >
              <Printer className="w-4.5 h-4.5 text-primary" />
              <span className="hidden lg:inline">Descargar PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filter Panel */}
      <AnimatePresence>
        {showFilterMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 flex flex-wrap gap-2 items-center"
          >
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mr-2">
              Categoría:
            </span>
            {(['TODOS', 'VIÁTICOS', 'GASTOS IMPREVISTOS', 'DEDUCCIÓN FIJA', 'OTROS'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-xs shadow-primary/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'TODOS' ? 'Todos' : cat}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              <th className="py-4 px-6 cursor-pointer hover:text-slate-700 transition-colors" onClick={() => toggleSort('date')}>
                <div className="flex items-center gap-1">
                  Fecha
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-4 px-6 cursor-pointer hover:text-slate-700 transition-colors" onClick={() => toggleSort('description')}>
                <div className="flex items-center gap-1">
                  Descripción
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-4 px-6">Categoría</th>
              <th className="py-4 px-6 cursor-pointer hover:text-slate-700 transition-colors" onClick={() => toggleSort('amount')}>
                <div className="flex items-center gap-1">
                  Monto (Soles)
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-4 px-6 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {sortedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    No se encontraron egresos registrados para este evento.
                  </td>
                </tr>
              ) : (
                sortedExpenses.map((exp) => (
                  <motion.tr
                    key={exp.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Fecha */}
                    <td className="py-4.5 px-6 text-sm text-slate-500 font-medium whitespace-nowrap">
                      {exp.date}
                    </td>

                    {/* Descripción */}
                    <td className="py-4.5 px-6 text-sm text-slate-800 font-semibold">
                      {exp.description}
                    </td>

                    {/* Categoría Badge */}
                    <td className="py-4.5 px-6 whitespace-nowrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${getCategoryBadgeClass(exp.category)}`}>
                        {exp.category}
                      </span>
                    </td>

                    {/* Monto */}
                    <td className="py-4.5 px-6 text-sm text-slate-800 font-bold whitespace-nowrap">
                      {formatCurrency(exp.amount)}
                    </td>

                    {/* Acción */}
                    <td className="py-4.5 px-6 text-center">
                      {exp.isFixedDeduction ? (
                        <div 
                          className="inline-flex items-center gap-1 text-slate-300 group-hover:text-slate-400 text-[11px] font-medium transition-colors" 
                          title="Se modifica desde el panel izquierdo (Deducciones Fijas)"
                        >
                          <Lock className="w-3 h-3" />
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity hidden md:inline">
                            Fijo
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer inline-flex items-center"
                          title="Eliminar gasto adicional"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Table Footer Stats Summary */}
      <div className="bg-slate-50/50 p-4 px-6 flex justify-between items-center text-xs text-slate-500 font-semibold border-t border-slate-100">
        <div>
          Mostrando {sortedExpenses.length} de {expenses.length} egresos totales
        </div>
        <div>
          {selectedCategory !== 'TODOS' && `Filtrado por: ${selectedCategory}`}
        </div>
      </div>
    </div>
  );
}
