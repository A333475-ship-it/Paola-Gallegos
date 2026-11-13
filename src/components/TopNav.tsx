import React from 'react';
import { Download, FileText, ArrowLeftRight } from 'lucide-react';

interface TopNavProps {
  activeView: string;
  onSelectView: (view: string) => void;
  onOpenReport: () => void;
  onExportCsv: () => void;
  onOpenCompare: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  onSelectView,
  onOpenReport,
  onExportCsv,
  onOpenCompare,
}) => {
  const navItems = [
    { id: 'overview', label: 'Visión General' },
    { id: 'demographics', label: 'Demografía y Población' },
    { id: 'map', label: 'Mapa y Regiones' },
    { id: 'compare', label: 'Comparativa', isCompareAction: true },
    { id: 'evolution', label: 'Evolución Temporal' },
    { id: 'sectors', label: 'Estructura Sectorial' },
    { id: 'matrix', label: 'Matriz Regional' },
    { id: 'data', label: 'Datos Cantonales' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark in Swiss Modernist Style */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-6 h-6 bg-[#D93856] rounded-[3px] flex items-center justify-center shadow-sm">
            {/* Swiss Cross Glyph */}
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-white" aria-hidden="true">
              <rect x="6.5" y="2.5" width="3" height="11" rx="0.5" />
              <rect x="2.5" y="6.5" width="11" height="3" rx="0.5" />
            </svg>
          </div>
          <button
            onClick={() => onSelectView('overview')}
            className="text-left font-semibold text-[15px] tracking-tight text-[#0F172A] hover:text-[#D93856] transition-colors whitespace-nowrap shrink-0"
          >
            HELVETIA ANALYTICAL
          </button>
          <span className="hidden xl:inline text-[#94A3B8] text-xs font-normal">|</span>
          <span className="hidden xl:inline text-xs font-medium text-[#64748B] whitespace-nowrap">
            Productividad y Economía Regional de Suiza (2012-2024)
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-Line, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isCompareAction) {
                    onOpenCompare();
                  } else {
                    onSelectView(item.id);
                  }
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-[4px] transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#FCE8EC] text-[#D93856] font-semibold'
                    : 'text-[#334155] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Executive Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Side-by-side comparison primary button */}
          <button
            onClick={onOpenCompare}
            title="Comparar dos cantones o regiones cara a cara"
            className="h-8 px-2.5 sm:px-3 text-xs font-semibold text-[#0F172A] bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#94A3B8] rounded-[4px] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#D93856]" />
            <span className="hidden sm:inline">Comparar</span>
          </button>

          <button
            onClick={onExportCsv}
            title="Exportar base de datos histórica a CSV"
            className="h-8 px-2.5 sm:px-3 text-xs font-medium text-[#334155] bg-[#FFFFFF] border border-[#E2E8F0] rounded-[4px] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
          
          <button
            onClick={onOpenReport}
            className="h-8 px-3 sm:px-3.5 text-xs font-semibold text-white bg-[#D93856] hover:bg-[#E05370] rounded-[4px] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            <span>Informe Ejecutivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
