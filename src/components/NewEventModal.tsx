import { useState, FormEvent } from 'react';
import { X, Calendar, DollarSign, Music } from 'lucide-react';
import { motion } from 'motion/react';
import { EventData, DeduccionesFijas } from '../types';

interface NewEventModalProps {
  onClose: () => void;
  onCreateEvent: (newEvent: EventData) => void;
}

export default function NewEventModal({ onClose, onCreateEvent }: NewEventModalProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [balanceStr, setBalanceStr] = useState('');
  const [error, setError] = useState('');

  // Default deductions to make it easy for the user
  const [deductions, setDeductions] = useState<DeduccionesFijas>({
    berly: 150,
    myki: 150,
    wili: 150,
    gustavo: 150,
    animacion: 100,
    bajo: 120,
    movilidad: 150,
    viaticos: 100,
  });

  const handleDeductionChange = (key: keyof DeduccionesFijas, value: string) => {
    const num = parseFloat(value) || 0;
    setDeductions({
      ...deductions,
      [key]: num,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Por favor, ingresa el nombre del show o evento.');
      return;
    }

    if (!date.trim()) {
      setError('Por favor, ingresa la fecha (ej: 25 Jul).');
      return;
    }

    const balance = parseFloat(balanceStr);
    if (isNaN(balance) || balance < 0) {
      setError('Por favor, ingresa un saldo de presentación válido.');
      return;
    }

    const newEvent: EventData = {
      id: 'event-' + Date.now(),
      name: name.trim(),
      date: date.trim(),
      balance,
      deductions,
      additionalExpenses: [],
    };

    onCreateEvent(newEvent);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10"
      >
        {/* Header decoration bar */}
        <div className="h-1.5 bg-primary w-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-display font-extrabold text-2xl text-slate-800 flex items-center gap-2">
              <Music className="w-6 h-6 text-primary" />
              Nuevo Evento Musical
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Registra un nuevo show para liquidar haberes y registrar gastos operativos.
            </p>
          </div>

          {/* Core inputs (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre del Evento */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                Nombre del Show / Evento
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary focus:ring-3 focus:ring-primary/10 text-slate-700 text-sm font-semibold transition-all"
                placeholder="Ej: Show Privado Hotel Hilton, Gira Córdoba"
              />
            </div>

            {/* Fecha del Evento */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                Fecha del Show
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary focus:ring-3 focus:ring-primary/10 text-slate-700 text-sm font-semibold transition-all"
                  placeholder="Ej: 25 Jul"
                />
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Saldo de la Presentación */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                Saldo de Presentación (Soles)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={balanceStr}
                  onChange={(e) => setBalanceStr(e.target.value)}
                  className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary focus:ring-3 focus:ring-primary/10 text-slate-700 text-sm font-semibold transition-all"
                  placeholder="0.00"
                  step="any"
                />
                <span className="absolute left-3.5 top-3 text-xs font-extrabold text-slate-400 select-none">S/.</span>
              </div>
            </div>
          </div>

          {/* Collapsible/Compact Deductions Prepopulation Section */}
          <div className="space-y-3">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
              Deducciones Fijas Sugeridas (Soles)
            </span>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-3 gap-3">
              {Object.keys(deductions).map((key) => {
                const k = key as keyof DeduccionesFijas;
                return (
                  <div key={k}>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 capitalize">
                      {k === 'animacion' ? 'Animación' : k === 'viaticos' ? 'Viáticos' : k}
                    </label>
                    <input
                      type="number"
                      value={deductions[k]}
                      onChange={(e) => handleDeductionChange(k, e.target.value)}
                      className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs focus:outline-hidden focus:border-primary"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-500 bg-rose-50 p-2.5 rounded-lg border border-rose-100 animate-pulse">
              {error}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer"
            >
              Crear Evento Show
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
