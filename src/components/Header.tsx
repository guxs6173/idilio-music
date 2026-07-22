import { useState, useEffect } from 'react';
import { LayoutDashboard, History, Settings, Sparkles, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  activeTab: 'resumen' | 'historial';
  setActiveTab: (tab: 'resumen' | 'historial') => void;
  onOpenSettings: () => void;
}

export default function Header({ activeTab, setActiveTab, onOpenSettings }: HeaderProps) {
  const [liveDate, setLiveDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setLiveDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = liveDate.toLocaleDateString('es-PE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = liveDate.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('resumen')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white shadow-md shadow-primary/20 overflow-hidden group">
              <span className="font-display font-extrabold text-lg group-hover:scale-110 transition-transform">IM</span>
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </div>
            <div>
              <span className="font-display font-bold text-xl text-slate-800 tracking-tight flex items-center gap-1.5">
                Idilio Music
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </span>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-2">
              <button
                id="tab-resumen"
                onClick={() => setActiveTab('resumen')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'resumen'
                    ? 'text-primary bg-primary-light'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Resumen
                {activeTab === 'resumen' && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>

              <button
                id="tab-historial"
                onClick={() => setActiveTab('historial')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'historial'
                    ? 'text-primary bg-primary-light'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <History className="w-4 h-4" />
                Historial
                {activeTab === 'historial' && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </nav>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedDate} — {formattedTime}</span>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-3">
              <button
                id="btn-settings"
                onClick={onOpenSettings}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                title="Configuración"
              >
                <Settings className="w-5 h-5 animate-hover-spin" />
              </button>
              
              <div 
                className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-display font-semibold text-sm shadow-sm border-2 border-white ring-2 ring-primary/20 cursor-pointer hover:scale-105 transition-all"
                title="gustabo4e@gmail.com"
              >
                IM
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
