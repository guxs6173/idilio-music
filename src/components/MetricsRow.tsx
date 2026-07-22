import { Receipt, Wallet, Coins } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricsRowProps {
  expensesTotal: number;
  deductionsTotal: number;
  netProfit: number;
}

export default function MetricsRow({ expensesTotal, deductionsTotal, netProfit }: MetricsRowProps) {
  const formatCurrency = (val: number) => {
    return 'S/. ' + val.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* TOTAL GASTOS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        id="metric-total-gastos"
        className="relative bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center overflow-hidden group hover:shadow-md transition-all shadow-xs"
      >
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
            Total Gastos
          </span>
          <h3 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight">
            {formatCurrency(expensesTotal)}
          </h3>
          <span className="text-[10px] text-slate-400 block font-medium">
            (Deducciones fijas + Gastos extra)
          </span>
        </div>
        
        {/* Subtle Decorative Background Graphic */}
        <div className="text-slate-100 group-hover:text-slate-200 transition-colors">
          <Receipt className="w-14 h-14 stroke-1" />
        </div>
      </motion.div>

      {/* SALDO NETO */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        id="metric-saldo-neto"
        className="relative bg-primary text-white rounded-2xl p-6 flex justify-between items-center overflow-hidden group hover:shadow-lg hover:shadow-primary/15 transition-all"
      >
        <div className="space-y-1 z-10">
          <span className="text-[10px] font-bold tracking-wider text-emerald-100 uppercase block">
            Saldo Neto
          </span>
          <h3 className="text-3xl font-display font-extrabold text-white tracking-tight">
            {formatCurrency(netProfit)}
          </h3>
          <span className="text-[10px] text-emerald-100/80 block font-medium">
            (Presentación - Total Gastos)
          </span>
        </div>
        
        {/* Decorative Background Graphic */}
        <div className="text-emerald-600/30 group-hover:text-emerald-500/30 transition-colors z-0">
          <Wallet className="w-14 h-14 stroke-1" />
        </div>
      </motion.div>

      {/* TOTAL DEDUCCIONES */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        id="metric-total-deducciones"
        className="relative bg-white rounded-2xl border border-slate-100 border-l-4 border-l-amber-500 p-6 flex justify-between items-center overflow-hidden group hover:shadow-md transition-all shadow-xs"
      >
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
            Deducciones Fijas
          </span>
          <h3 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight">
            {formatCurrency(deductionsTotal)}
          </h3>
          <span className="text-[10px] text-slate-400 block font-medium">
            (Solo pagos fijos a músicos/movilidad)
          </span>
        </div>
        
        {/* Subtle Decorative Background Graphic */}
        <div className="text-slate-100 group-hover:text-slate-200 transition-colors">
          <Coins className="w-14 h-14 stroke-1" />
        </div>
      </motion.div>
    </div>
  );
}
