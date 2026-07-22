import { Calendar } from 'lucide-react';
import { DeduccionesFijas } from '../types';

interface EventDataCardProps {
  balance: number;
  onBalanceChange: (val: number) => void;
  deductions: DeduccionesFijas;
  onDeductionsChange: (deductions: DeduccionesFijas) => void;
  eventName: string;
  onEventNameChange: (name: string) => void;
}

export default function EventDataCard({
  balance,
  onBalanceChange,
  deductions,
  onDeductionsChange,
  eventName,
  onEventNameChange,
}: EventDataCardProps) {
  
  const handleDeductionChange = (key: keyof DeduccionesFijas, value: string) => {
    const numVal = parseFloat(value) || 0;
    onDeductionsChange({
      ...deductions,
      [key]: numVal,
    });
  };

  return (
    <div id="card-datos-evento" className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Visual Top Highlight Bar matching image */}
      <div className="h-1 bg-primary w-full" />
      
      <div className="p-6">
        {/* Header Title with Calendar Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-primary-light rounded-lg text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-slate-800">Datos del Evento</h2>
            <input
              type="text"
              value={eventName}
              onChange={(e) => onEventNameChange(e.target.value)}
              className="text-xs text-slate-500 font-medium bg-transparent border-b border-transparent hover:border-slate-200 focus:border-primary focus:outline-hidden px-1 py-0.5 transition-all w-full"
              placeholder="Nombre del Evento"
            />
          </div>
        </div>

        {/* Saldo de la Presentación Input */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
            Saldo de la Presentación (Soles)
          </label>
          <div className="relative rounded-xl bg-slate-50 border border-slate-100 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/10 transition-all">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-slate-500 font-semibold text-sm">S/.</span>
            </div>
            <input
              type="number"
              value={balance === 0 ? '' : balance}
              onChange={(e) => onBalanceChange(parseFloat(e.target.value) || 0)}
              className="block w-full pl-11 pr-4 py-3 bg-transparent text-slate-800 font-bold text-lg rounded-xl focus:outline-hidden [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0.00"
              step="any"
            />
          </div>
        </div>

        {/* Section Divider */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-3 text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
            Deducciones Fijas
          </span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Deducciones Fijas Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Berly */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
              Berly
            </label>
            <div className="relative rounded-lg bg-slate-50 border border-slate-100 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <input
                type="number"
                value={deductions.berly === 0 ? '' : deductions.berly}
                onChange={(e) => handleDeductionChange('berly', e.target.value)}
                className="block w-full px-3 py-2 bg-transparent text-slate-700 font-medium text-sm focus:outline-hidden"
                placeholder="0.00"
                step="any"
              />
            </div>
          </div>

          {/* Myki */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
              Myki
            </label>
            <div className="relative rounded-lg bg-slate-50 border border-slate-100 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <input
                type="number"
                value={deductions.myki === 0 ? '' : deductions.myki}
                onChange={(e) => handleDeductionChange('myki', e.target.value)}
                className="block w-full px-3 py-2 bg-transparent text-slate-700 font-medium text-sm focus:outline-hidden"
                placeholder="0.00"
                step="any"
              />
            </div>
          </div>

          {/* Wili */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
              Wili
            </label>
            <div className="relative rounded-lg bg-slate-50 border border-slate-100 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <input
                type="number"
                value={deductions.wili === 0 ? '' : deductions.wili}
                onChange={(e) => handleDeductionChange('wili', e.target.value)}
                className="block w-full px-3 py-2 bg-transparent text-slate-700 font-medium text-sm focus:outline-hidden"
                placeholder="0.00"
                step="any"
              />
            </div>
          </div>

          {/* Gustavo */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
              Gustavo
            </label>
            <div className="relative rounded-lg bg-slate-50 border border-slate-100 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <input
                type="number"
                value={deductions.gustavo === 0 ? '' : deductions.gustavo}
                onChange={(e) => handleDeductionChange('gustavo', e.target.value)}
                className="block w-full px-3 py-2 bg-transparent text-slate-700 font-medium text-sm focus:outline-hidden"
                placeholder="0.00"
                step="any"
              />
            </div>
          </div>

          {/* Animación */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
              Animación
            </label>
            <div className="relative rounded-lg bg-slate-50 border border-slate-100 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <input
                type="number"
                value={deductions.animacion === 0 ? '' : deductions.animacion}
                onChange={(e) => handleDeductionChange('animacion', e.target.value)}
                className="block w-full px-3 py-2 bg-transparent text-slate-700 font-medium text-sm focus:outline-hidden"
                placeholder="0.00"
                step="any"
              />
            </div>
          </div>

          {/* Bajo */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
              Bajo
            </label>
            <div className="relative rounded-lg bg-slate-50 border border-slate-100 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <input
                type="number"
                value={deductions.bajo === 0 ? '' : deductions.bajo}
                onChange={(e) => handleDeductionChange('bajo', e.target.value)}
                className="block w-full px-3 py-2 bg-transparent text-slate-700 font-medium text-sm focus:outline-hidden"
                placeholder="0.00"
                step="any"
              />
            </div>
          </div>

          {/* Movilidad */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
              Movilidad
            </label>
            <div className="relative rounded-lg bg-slate-50 border border-slate-100 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <input
                type="number"
                value={deductions.movilidad === 0 ? '' : deductions.movilidad}
                onChange={(e) => handleDeductionChange('movilidad', e.target.value)}
                className="block w-full px-3 py-2 bg-transparent text-slate-700 font-medium text-sm focus:outline-hidden"
                placeholder="0.00"
                step="any"
              />
            </div>
          </div>

          {/* Viáticos */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
              Viáticos (Fijo)
            </label>
            <div className="relative rounded-lg bg-slate-50 border border-slate-100 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <input
                type="number"
                value={deductions.viaticos === 0 ? '' : deductions.viaticos}
                onChange={(e) => handleDeductionChange('viaticos', e.target.value)}
                className="block w-full px-3 py-2 bg-transparent text-slate-700 font-medium text-sm focus:outline-hidden"
                placeholder="0.00"
                step="any"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
