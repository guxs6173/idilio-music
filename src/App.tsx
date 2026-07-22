import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Settings, RefreshCw, X, ShieldAlert, CheckCircle2, Award, Music, Sparkles, Printer, Calendar } from 'lucide-react';

import Header from './components/Header';
import EventDataCard from './components/EventDataCard';
import AddExpenseCard from './components/AddExpenseCard';
import MetricsRow from './components/MetricsRow';
import ExpensesTable from './components/ExpensesTable';
import HistoryView from './components/HistoryView';
import NewEventModal from './components/NewEventModal';
import { generateEventPDF } from './utils/pdfGenerator';

import { EventData, DeduccionesFijas, Expense, ExpenseCategory } from './types';
import { INITIAL_EVENTS } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'resumen' | 'historial'>('resumen');
  const [events, setEvents] = useState<EventData[]>([]);
  const [activeEventId, setActiveEventId] = useState<string>('event-active');
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Toast notifications state
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' }[]>([]);

  // 0. Robot voice greeting on first user interaction
  const greeted = useRef(false);
  useEffect(() => {
    const handler = () => {
      if (greeted.current) return;
      greeted.current = true;
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Hola amigos');
        utterance.lang = 'es-PE';
        utterance.rate = 0.9;
        utterance.pitch = 0.5;
        speechSynthesis.speak(utterance);
      }
    };
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('touchstart', handler, { once: true });
    document.addEventListener('keydown', handler, { once: true });
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('keydown', handler);
    };
  }, []);

  // 1. Initial State Loading with localStorage fallback
  useEffect(() => {
    const saved = localStorage.getItem('idilio_music_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed);
          // Look for an existing active event, or fallback to the first one
          const savedActiveId = localStorage.getItem('idilio_music_active_id');
          if (savedActiveId && parsed.some(e => e.id === savedActiveId)) {
            setActiveEventId(savedActiveId);
          } else {
            setActiveEventId(parsed[0].id);
          }
          return;
        }
      } catch (e) {
        console.error('Error loading events from storage', e);
      }
    }
    // If nothing saved or failed, load standard mock data
    setEvents(INITIAL_EVENTS);
    setActiveEventId('event-active');
  }, []);

  // 2. Save state whenever it changes
  const saveToLocalStorage = (currentEvents: EventData[], currentActiveId: string) => {
    localStorage.setItem('idilio_music_events', JSON.stringify(currentEvents));
    localStorage.setItem('idilio_music_active_id', currentActiveId);
  };

  // 3. Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // 4. Resolve Active Event
  const activeEvent = events.find((e) => e.id === activeEventId) || events[0] || INITIAL_EVENTS[0];

  // 5. Financial Calculations for Active Event
  const deductionsTotal = activeEvent
    ? activeEvent.deductions.berly +
      activeEvent.deductions.myki +
      activeEvent.deductions.wili +
      activeEvent.deductions.gustavo +
      activeEvent.deductions.animacion +
      activeEvent.deductions.bajo +
      activeEvent.deductions.movilidad
    : 0;

  const additionalExpensesTotal = activeEvent
    ? activeEvent.additionalExpenses.reduce((acc, curr) => acc + curr.amount, 0) +
      (activeEvent.deductions.viaticos || 0)
    : 0;

  const expensesTotal = deductionsTotal + additionalExpensesTotal;

  const netProfit = activeEvent
    ? activeEvent.balance - expensesTotal
    : 0;

  // 6. Dynamic table listing (merging added expenses + active deductions)
  const getMergedExpenses = (): Expense[] => {
    if (!activeEvent) return [];

    const list: Expense[] = [];

    // Add additional expenses registered via the form
    activeEvent.additionalExpenses.forEach((exp) => {
      list.push({ ...exp, isFixedDeduction: false });
    });

    // Translate greater-than-zero deductions to dynamic rows in the table
    const decs = activeEvent.deductions;
    
    if (decs.berly > 0) {
      list.push({
        id: 'fixed-berly',
        date: '20 jul',
        description: 'Pago Músico: Berly',
        category: 'DEDUCCIÓN FIJA',
        amount: decs.berly,
        isFixedDeduction: true,
      });
    }
    if (decs.myki > 0) {
      list.push({
        id: 'fixed-myki',
        date: '20 jul',
        description: 'Pago Músico: Myki',
        category: 'DEDUCCIÓN FIJA',
        amount: decs.myki,
        isFixedDeduction: true,
      });
    }
    if (decs.wili > 0) {
      list.push({
        id: 'fixed-wili',
        date: '20 jul',
        description: 'Pago Músico: Wili',
        category: 'DEDUCCIÓN FIJA',
        amount: decs.wili,
        isFixedDeduction: true,
      });
    }
    if (decs.gustavo > 0) {
      list.push({
        id: 'fixed-gustavo',
        date: '20 jul',
        description: 'Pago Músico: Gustavo',
        category: 'DEDUCCIÓN FIJA',
        amount: decs.gustavo,
        isFixedDeduction: true,
      });
    }
    if (decs.animacion > 0) {
      list.push({
        id: 'fixed-animacion',
        date: '20 jul',
        description: 'Pago Músico: Animación',
        category: 'DEDUCCIÓN FIJA',
        amount: decs.animacion,
        isFixedDeduction: true,
      });
    }
    if (decs.bajo > 0) {
      list.push({
        id: 'fixed-bajo',
        date: '20 jul',
        description: 'Pago Músico: Bajo',
        category: 'DEDUCCIÓN FIJA',
        amount: decs.bajo,
        isFixedDeduction: true,
      });
    }
    if (decs.movilidad > 0) {
      list.push({
        id: 'fixed-movilidad',
        date: '20 jul',
        description: 'Movilidad',
        category: 'DEDUCCIÓN FIJA',
        amount: decs.movilidad,
        isFixedDeduction: true,
      });
    }
    if (decs.viaticos > 0) {
      list.push({
        id: 'fixed-viaticos',
        date: '20 jul',
        description: 'Viáticos (Fijo)',
        category: 'VIÁTICOS',
        amount: decs.viaticos,
        isFixedDeduction: true,
      });
    }

    return list;
  };

  const mergedExpenses = getMergedExpenses();

  // 7. Event Mutation Handlers
  const handleUpdateBalance = (newBalance: number) => {
    const updated = events.map((ev) => {
      if (ev.id === activeEventId) {
        return { ...ev, balance: newBalance };
      }
      return ev;
    });
    setEvents(updated);
    saveToLocalStorage(updated, activeEventId);
  };

  const handleUpdateEventName = (newName: string) => {
    const updated = events.map((ev) => {
      if (ev.id === activeEventId) {
        return { ...ev, name: newName };
      }
      return ev;
    });
    setEvents(updated);
    saveToLocalStorage(updated, activeEventId);
  };

  const handleUpdateDeductions = (newDeductions: DeduccionesFijas) => {
    const updated = events.map((ev) => {
      if (ev.id === activeEventId) {
        return { ...ev, deductions: newDeductions };
      }
      return ev;
    });
    setEvents(updated);
    saveToLocalStorage(updated, activeEventId);
  };

  const handleAddExpense = (description: string, amount: number, category: ExpenseCategory) => {
    const newExpense: Expense = {
      id: 'exp-' + Date.now(),
      date: activeEvent.date || '21 Jul',
      description,
      category,
      amount,
    };

    const updated = events.map((ev) => {
      if (ev.id === activeEventId) {
        return {
          ...ev,
          additionalExpenses: [newExpense, ...ev.additionalExpenses],
        };
      }
      return ev;
    });

    setEvents(updated);
    saveToLocalStorage(updated, activeEventId);
    showToast(`Gasto "${description}" registrado exitosamente.`, 'success');
  };

  const handleDeleteExpense = (expenseId: string) => {
    const updated = events.map((ev) => {
      if (ev.id === activeEventId) {
        return {
          ...ev,
          additionalExpenses: ev.additionalExpenses.filter((exp) => exp.id !== expenseId),
        };
      }
      return ev;
    });

    setEvents(updated);
    saveToLocalStorage(updated, activeEventId);
    showToast('Gasto adicional eliminado con éxito.', 'info');
  };

  // 8. Event Navigation & Management (History View)
  const handleLoadEvent = (id: string) => {
    setActiveEventId(id);
    setActiveTab('resumen');
    saveToLocalStorage(events, id);
    
    const loaded = events.find((e) => e.id === id);
    if (loaded) {
      showToast(`Evento "${loaded.name}" cargado en pantalla principal.`, 'success');
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (events.length <= 1) {
      showToast('No puedes eliminar el último evento activo.', 'error');
      return;
    }

    const eventToDelete = events.find((e) => e.id === id);
    const updatedEvents = events.filter((ev) => ev.id !== id);
    
    let newActiveId = activeEventId;
    if (activeEventId === id) {
      newActiveId = updatedEvents[0].id;
    }

    setEvents(updatedEvents);
    setActiveEventId(newActiveId);
    saveToLocalStorage(updatedEvents, newActiveId);
    showToast(`Evento "${eventToDelete?.name || ''}" eliminado del historial.`, 'info');
  };

  const handleCreateEvent = (newEvent: EventData) => {
    const updatedEvents = [newEvent, ...events];
    setEvents(updatedEvents);
    setActiveEventId(newEvent.id);
    setShowCreateModal(false);
    setActiveTab('resumen');
    saveToLocalStorage(updatedEvents, newEvent.id);
    showToast(`Nuevo evento "${newEvent.name}" creado y activado.`, 'success');
  };

  const handleResetToScreenshotState = () => {
    localStorage.removeItem('idilio_music_events');
    localStorage.removeItem('idilio_music_active_id');
    setEvents(INITIAL_EVENTS);
    setActiveEventId('event-active');
    setActiveTab('resumen');
    setShowSettingsModal(false);
    showToast('Datos restablecidos al estado original del diseño.', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top sticky header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'resumen' ? (
            <motion.div
              key="resumen-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Event Header with Title and Print/Export Actions */}
              {activeEvent && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary-light px-2.5 py-1 rounded-full">
                      Liquidación Activa
                    </span>
                    <h2 className="text-xl font-display font-extrabold text-slate-800 tracking-tight mt-1.5 flex items-center gap-2">
                      <Music className="w-5 h-5 text-primary" />
                      {activeEvent.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Fecha del evento: {activeEvent.date}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 self-stretch sm:self-auto">
                    <button
                      onClick={() => generateEventPDF(activeEvent)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white hover:bg-primary-dark rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer hover:shadow-md"
                    >
                      <Printer className="w-4.5 h-4.5 animate-pulse" />
                      <span>Descargar PDF (Liquidación)</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column (Inputs and forms) - taking 4/12 width */}
                <div className="lg:col-span-4 space-y-8">
                {/* Event Data config card */}
                <EventDataCard
                  balance={activeEvent.balance}
                  onBalanceChange={handleUpdateBalance}
                  deductions={activeEvent.deductions}
                  onDeductionsChange={handleUpdateDeductions}
                  eventName={activeEvent.name}
                  onEventNameChange={handleUpdateEventName}
                />

                {/* Additional Expense insertion card */}
                <AddExpenseCard onAddExpense={handleAddExpense} />
              </div>

              {/* Right Column (Metrics and table detailing) - taking 8/12 width */}
              <div className="lg:col-span-8 space-y-8">
                {/* Financial Summary cards */}
                <MetricsRow
                  expensesTotal={expensesTotal}
                  deductionsTotal={deductionsTotal}
                  netProfit={netProfit}
                />

                {/* Main detailing table */}
                <ExpensesTable
                  expenses={mergedExpenses}
                  onDeleteExpense={handleDeleteExpense}
                  onDownloadPDF={() => generateEventPDF(activeEvent)}
                />
              </div>
            </div>
          </motion.div>
          ) : (
            <motion.div
              key="historial-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <HistoryView
                events={events}
                activeEventId={activeEventId}
                onLoadEvent={handleLoadEvent}
                onDeleteEvent={handleDeleteEvent}
                onOpenCreateModal={() => setShowCreateModal(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding block */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-400 font-semibold">
          <p>© 2026 Idilio Music. Desarrollado con precisión de diseño.</p>
          <p className="mt-2 sm:mt-0 flex items-center justify-center gap-1">
            Plataforma Financiera Oficial
            <Award className="w-4 h-4 text-primary" />
          </p>
        </div>
      </footer>

      {/* Dedicated Print Sheet Document */}
      {activeEvent && (
        <div className="hidden print:block p-8 max-w-4xl mx-auto text-slate-800 bg-white font-sans text-sm leading-relaxed">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-5 mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900">IDILIO MUSIC</h1>
              <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Control de Liquidación de Eventos</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500">DOCUMENTO OFICIAL DE CONTROL</p>
              <p className="text-sm font-bold text-slate-800 mt-1">Fecha: {activeEvent.date}</p>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Evento</span>
              <h2 className="text-lg font-bold text-slate-800">{activeEvent.name}</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ingreso de Presentación</span>
              <h3 className="text-lg font-extrabold text-slate-900">
                S/. {activeEvent.balance.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
          </div>

          {/* Deducciones Fijas Section */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 pb-1 border-b border-slate-200">
              1. Deducciones Fijas (Músicos y Movilidad)
            </h3>
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-slate-100/75">
                  <th className="border border-slate-200 px-4 py-2 text-left font-bold text-slate-600">Músico / Concepto</th>
                  <th className="border border-slate-200 px-4 py-2 text-right font-bold text-slate-600">Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-200 px-4 py-1.5 font-medium text-slate-700">Berly</td>
                  <td className="border border-slate-200 px-4 py-1.5 text-right font-semibold text-slate-700">
                    S/. {activeEvent.deductions.berly.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-1.5 font-medium text-slate-700">Myki</td>
                  <td className="border border-slate-200 px-4 py-1.5 text-right font-semibold text-slate-700">
                    S/. {activeEvent.deductions.myki.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-1.5 font-medium text-slate-700">Wili</td>
                  <td className="border border-slate-200 px-4 py-1.5 text-right font-semibold text-slate-700">
                    S/. {activeEvent.deductions.wili.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-1.5 font-medium text-slate-700">Gustavo</td>
                  <td className="border border-slate-200 px-4 py-1.5 text-right font-semibold text-slate-700">
                    S/. {activeEvent.deductions.gustavo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-1.5 font-medium text-slate-700">Animación</td>
                  <td className="border border-slate-200 px-4 py-1.5 text-right font-semibold text-slate-700">
                    S/. {activeEvent.deductions.animacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-1.5 font-medium text-slate-700">Bajo</td>
                  <td className="border border-slate-200 px-4 py-1.5 text-right font-semibold text-slate-700">
                    S/. {activeEvent.deductions.bajo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-1.5 font-medium text-slate-700">Movilidad</td>
                  <td className="border border-slate-200 px-4 py-1.5 text-right font-semibold text-slate-700">
                    S/. {activeEvent.deductions.movilidad.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="border border-slate-200 px-4 py-2 text-left text-slate-800">Subtotal Deducciones Fijas</td>
                  <td className="border border-slate-200 px-4 py-2 text-right text-slate-800">
                    S/. {deductionsTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Gastos y Viáticos Extra Section */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 pb-1 border-b border-slate-200">
              2. Gastos Extra y Viáticos
            </h3>
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-slate-100/75">
                  <th className="border border-slate-200 px-4 py-2 text-left font-bold text-slate-600">Fecha</th>
                  <th className="border border-slate-200 px-4 py-2 text-left font-bold text-slate-600">Descripción</th>
                  <th className="border border-slate-200 px-4 py-2 text-left font-bold text-slate-600">Categoría</th>
                  <th className="border border-slate-200 px-4 py-2 text-right font-bold text-slate-600">Monto</th>
                </tr>
              </thead>
              <tbody>
                {/* Viáticos Fijos if present */}
                {(activeEvent.deductions.viaticos || 0) > 0 && (
                  <tr>
                    <td className="border border-slate-200 px-4 py-1.5 text-slate-500">20 jul</td>
                    <td className="border border-slate-200 px-4 py-1.5 font-medium text-slate-700">Viáticos (Fijo)</td>
                    <td className="border border-slate-200 px-4 py-1.5 text-slate-500 font-semibold">VIÁTICOS</td>
                    <td className="border border-slate-200 px-4 py-1.5 text-right font-semibold text-slate-700">
                      S/. {activeEvent.deductions.viaticos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                )}
                {/* Additional expenses */}
                {activeEvent.additionalExpenses.length > 0 ? (
                  activeEvent.additionalExpenses.map((exp) => (
                    <tr key={exp.id}>
                      <td className="border border-slate-200 px-4 py-1.5 text-slate-500">{exp.date}</td>
                      <td className="border border-slate-200 px-4 py-1.5 font-medium text-slate-700">{exp.description}</td>
                      <td className="border border-slate-200 px-4 py-1.5 text-slate-500 font-semibold">{exp.category}</td>
                      <td className="border border-slate-200 px-4 py-1.5 text-right font-semibold text-slate-700">
                        S/. {exp.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  (!activeEvent.deductions.viaticos || activeEvent.deductions.viaticos === 0) && (
                    <tr>
                      <td colSpan={4} className="border border-slate-200 px-4 py-3 text-center text-slate-400 italic">
                        No hay gastos adicionales registrados.
                      </td>
                    </tr>
                  )
                )}
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={3} className="border border-slate-200 px-4 py-2 text-left text-slate-800">
                    Subtotal Gastos y Viáticos Extra
                  </td>
                  <td className="border border-slate-200 px-4 py-2 text-right text-slate-800">
                    S/. {additionalExpensesTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Resumen de Totales Section */}
          <div className="mb-12">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 pb-1 border-b border-slate-200">
              3. Resumen de Cierre de Caja
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 px-4 py-2 text-xs">
                <span className="font-semibold text-slate-600">Saldo de la Presentación (Ingreso Bruto)</span>
                <span className="text-right font-bold text-slate-800">
                  S/. {activeEvent.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-200 px-4 py-2 text-xs">
                <span className="font-semibold text-slate-600">(-) Deducciones Fijas</span>
                <span className="text-right font-bold text-slate-800 text-rose-600">
                  - S/. {deductionsTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-200 px-4 py-2 text-xs">
                <span className="font-semibold text-slate-600">(-) Gastos y Viáticos Extra</span>
                <span className="text-right font-bold text-slate-800 text-rose-600">
                  - S/. {additionalExpensesTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-2 bg-slate-100 px-4 py-3 text-sm font-bold border-b border-slate-200">
                <span className="text-slate-800">Total Gastos de Egresos</span>
                <span className="text-right text-slate-800">
                  S/. {expensesTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-2 bg-slate-200 px-4 py-3 text-base font-extrabold">
                <span className="text-slate-900">SALDO NETO REMANENTE</span>
                <span className="text-right text-slate-900">
                  S/. {netProfit.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Firmas */}
          <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-2 gap-12">
            <div className="text-center">
              <div className="border-t border-slate-400 mx-auto w-48 mt-8"></div>
              <p className="text-xs font-bold text-slate-600 mt-2">Director de Orquesta / Representante</p>
              <p className="text-[10px] text-slate-400 mt-1">Idilio Music</p>
            </div>
            <div className="text-center">
              <div className="border-t border-slate-400 mx-auto w-48 mt-8"></div>
              <p className="text-xs font-bold text-slate-600 mt-2">Recibido por / Tesorero</p>
              <p className="text-[10px] text-slate-400 mt-1">Firma de conformidad</p>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Overlays */}
      <AnimatePresence>
        {/* Create Event Modal */}
        {showCreateModal && (
          <NewEventModal
            onClose={() => setShowCreateModal(false)}
            onCreateEvent={handleCreateEvent}
          />
        )}

        {/* Settings / Reset state Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettingsModal(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <h3 className="font-display font-extrabold text-lg text-slate-800 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Configuración
                </h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="py-5 space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100/50 flex items-start gap-3">
                  <Music className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Idilio Music Hub</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Esta aplicación permite liquidar de forma ágil las deducciones fijas de los músicos (Berly, Myki, Wili, Gustavo, Animación, Bajo) y registrar movilidad o gastos imprevistos de la gira.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Restablecer datos</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Si deseas volver al estado del diseño inicial para verificar los números originales del mockup (S/. 1,330.00 Saldo Neto, etc.), presiona el siguiente botón:
                  </p>
                </div>

                <button
                  id="btn-factory-reset"
                  onClick={handleResetToScreenshotState}
                  className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100/75 border border-rose-100 hover:border-rose-200 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Restablecer Datos de Fábrica
                </button>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end pt-3 border-t border-slate-50">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating toast alerts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`p-4 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 pointer-events-auto ${
                toast.type === 'success'
                  ? 'bg-emerald-550 bg-emerald-600 text-white border-emerald-650'
                  : toast.type === 'error'
                  ? 'bg-rose-600 text-white border-rose-700'
                  : 'bg-slate-800 text-white border-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
              <p className="flex-1">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
