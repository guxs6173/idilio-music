import { Plus, FolderOpen, Trash2, ArrowRight, DollarSign, Coins, Receipt, Wallet, Calendar, AlertCircle } from 'lucide-react';
import { EventData } from '../types';
import { motion } from 'motion/react';

interface HistoryViewProps {
  events: EventData[];
  activeEventId: string;
  onLoadEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  onOpenCreateModal: () => void;
}

export default function HistoryView({
  events,
  activeEventId,
  onLoadEvent,
  onDeleteEvent,
  onOpenCreateModal,
}: HistoryViewProps) {

  // Calculator helper inside history rows
  const getEventTotals = (event: EventData) => {
    // Total deductions
    const d = event.deductions;
    const deductionsTotal = d.berly + d.myki + d.wili + d.gustavo + d.animacion + d.bajo + d.movilidad;
    // Total additional expenses (including fixed viaticos)
    const additionalExpensesTotal = event.additionalExpenses.reduce((acc, curr) => acc + curr.amount, 0) + (d.viaticos || 0);
    // Total expenses of ALL (Deductions + Additional Expenses)
    const expensesTotal = deductionsTotal + additionalExpensesTotal;
    // Net profit
    const netProfit = event.balance - expensesTotal;

    return { deductionsTotal, expensesTotal, netProfit };
  };

  const formatCurrency = (val: number) => {
    return 'S/. ' + val.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="space-y-6">
      {/* View Header with "Crear Nuevo Evento" action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-800 tracking-tight flex items-center gap-2">
            Historial de Eventos
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Revisa, carga y compara la liquidación financiera de tus presentaciones musicales.
          </p>
        </div>
        
        <button
          id="btn-new-event-trigger"
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4.5 h-4.5" />
          Crear Nuevo Evento
        </button>
      </div>

      {/* Grid of Events */}
      <div className="grid grid-cols-1 gap-4">
        {events.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400" />
            <h3 className="font-bold text-slate-700">No hay eventos registrados</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Crea tu primer evento de Idilio Music para llevar un control estricto de liquidaciones de músicos y viáticos de gira.
            </p>
            <button
              onClick={onOpenCreateModal}
              className="mt-2 text-xs font-bold text-primary bg-primary-light px-4 py-2 rounded-xl hover:bg-primary/20 transition-all cursor-pointer"
            >
              Registrar Primer Evento
            </button>
          </div>
        ) : (
          events.map((event) => {
            const { deductionsTotal, expensesTotal, netProfit } = getEventTotals(event);
            const isActive = event.id === activeEventId;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isActive 
                    ? 'ring-2 ring-primary border-transparent shadow-md shadow-primary/5' 
                    : 'border-slate-100 hover:border-slate-200 hover:shadow-xs shadow-2xs'
                }`}
              >
                {/* Status Bar on Active */}
                {isActive && (
                  <div className="bg-primary px-6 py-1.5 flex justify-between items-center text-[10px] font-bold text-emerald-100 uppercase tracking-widest">
                    <span>Evento Activo en Panel Principal</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-sm">Cargado</span>
                  </div>
                )}

                <div className="p-6">
                  {/* Row Top Block: Event Name and Primary Action */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4.5 border-b border-slate-50">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-slate-50 rounded-md text-slate-500">
                          <Calendar className="w-4 h-4" />
                        </span>
                        <span className="text-xs text-slate-500 font-bold tracking-wide">
                          {event.date}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-800 tracking-tight">
                        {event.name}
                      </h3>
                    </div>

                    {/* Quick Load / Trash controls */}
                    <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                      {/* Delete Event */}
                      <button
                        onClick={() => onDeleteEvent(event.id)}
                        className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-100 hover:border-rose-100 transition-all cursor-pointer"
                        title="Eliminar evento del historial"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>

                      {/* Load Event */}
                      <button
                        onClick={() => onLoadEvent(event.id)}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                            : 'bg-primary-light text-primary border-primary/10 hover:bg-primary hover:text-white hover:border-transparent'
                        }`}
                        disabled={isActive}
                      >
                        <FolderOpen className="w-4 h-4" />
                        {isActive ? 'Cargado en Resumen' : 'Cargar Evento'}
                        {!isActive && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Row Bottom Block: Financial metrics grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4.5">
                    {/* Presupuesto (Balance) */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        <DollarSign className="w-3 h-3 text-slate-400" />
                        Presentación (A)
                      </div>
                      <p className="text-base font-bold text-slate-700">
                        {formatCurrency(event.balance)}
                      </p>
                    </div>

                    {/* Deducciones */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        <Coins className="w-3 h-3 text-amber-500" />
                        Deducciones Fijas (B)
                      </div>
                      <p className="text-base font-bold text-slate-700">
                        {formatCurrency(deductionsTotal)}
                      </p>
                    </div>

                    {/* Gastos */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        <Receipt className="w-3 h-3 text-emerald-500" />
                        Total Gastos (C)
                      </div>
                      <p className="text-base font-bold text-slate-700">
                        {formatCurrency(expensesTotal)}
                      </p>
                    </div>

                    {/* Saldo Neto */}
                    <div className="space-y-1 p-2 bg-slate-50/75 rounded-xl border border-slate-100/50">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        <Wallet className="w-3 h-3 text-primary" />
                        Saldo Neto (A - C)
                      </div>
                      <p className={`text-base font-extrabold ${netProfit >= 0 ? 'text-primary' : 'text-rose-600'}`}>
                        {formatCurrency(netProfit)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
