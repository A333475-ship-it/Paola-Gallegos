import React from 'react';
import { MACRO_SWISS_YEARS } from '../data/swissEconomicData';
import { X, Printer, CheckCircle2, TrendingUp, ShieldCheck, Globe } from 'lucide-react';

interface ExecutiveReportModalProps {
  currentYear: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  currentYear,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const macro = MACRO_SWISS_YEARS[currentYear] || MACRO_SWISS_YEARS[2024];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/40 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg shadow-[0_20px_25px_-5px_rgba(15,23,42,0.08)] w-full max-w-3xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FFFFFF] border-b border-[#E2E8F0] p-4 sm:p-5 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D93856]">
                Briefing Estratégico Oficial
              </span>
              <span className="text-[#94A3B8]">·</span>
              <span className="text-xs font-semibold text-[#0F172A] tabular-nums">
                Período 2012 — {currentYear}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#0F172A] mt-0.5">
              Informe Ejecutivo: Productividad y Economía Regional de Suiza
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="h-8 px-3 text-xs font-medium text-[#334155] bg-[#FFFFFF] border border-[#E2E8F0] rounded-[4px] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-[4px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-5 sm:p-6 space-y-6 text-xs text-[#334155] leading-relaxed">
          {/* Key Executive Findings Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#FCE8EC]/50 border border-[#D93856]/20 rounded-[4px]">
              <span className="text-[10px] font-semibold text-[#D93856] uppercase tracking-wider block mb-1">
                Productividad Media ({currentYear})
              </span>
              <div className="text-xl font-bold text-[#0F172A] tabular-nums">
                {macro.avgProductivityPerHour.toFixed(1)} CHF/h
              </div>
              <span className="text-[10px] text-[#64748B]">
                +27.0% acumulado desde 2012
              </span>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
              <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block mb-1">
                PIB Nacional
              </span>
              <div className="text-xl font-bold text-[#0F172A] tabular-nums">
                {macro.pibBillions.toFixed(1)}k M CHF
              </div>
              <span className="text-[10px] text-[#64748B]">
                Crecimiento Real: +{macro.pibGrowthRealPct}%
              </span>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
              <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block mb-1">
                Tasa de Desempleo
              </span>
              <div className="text-xl font-bold text-[#0F172A] tabular-nums">
                {macro.unemploymentRate}%
              </div>
              <span className="text-[10px] text-[#64748B]">
                Pleno empleo y atracción de talento
              </span>
            </div>
          </div>

          {/* Section 1: Executive Insights */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5 uppercase tracking-wide">
              <TrendingUp className="w-4 h-4 text-[#D93856]" />
              1. Pilares del Liderazgo de Productividad Suiza (2012-2024)
            </h3>
            <p className="text-justify">
              Durante el periodo 2012-2024, la economía helvética demostró una resiliencia excepcional ante múltiples perturbaciones macroeconómicas globales, incluyendo el desanclaje cambiario del EUR/CHF en enero de 2015, la crisis pandémica de 2020 y la reorganización de la plaza bancaria en 2023. La productividad laboral por hora trabajada se elevó de <strong>84.1 CHF/h en 2012</strong> a <strong>106.8 CHF/h en 2024</strong>, superando con holgura a las principales economías de la Unión Europea y Norteamérica.
            </p>
          </div>

          {/* Section 2: Regional Divergence & Clustering */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5 uppercase tracking-wide">
              <Globe className="w-4 h-4 text-[#334155]" />
              2. Divergencia Regional y Especialización Cantonal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
                <h4 className="font-semibold text-[#0F172A] mb-1">
                  Clúster Farmacéutico (Basilea-Ciudad & Argovia)
                </h4>
                <p className="text-[11px] text-[#64748B]">
                  Basilea-Ciudad registra la mayor productividad laboral del continente (más de 168 CHF/h), impulsada por la concentración de sedes y centros mundiales de investigación de Roche, Novartis y Lonza.
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
                <h4 className="font-semibold text-[#0F172A] mb-1">
                  Plaza Financiera e Inteligencia Artificial (Zúrich)
                </h4>
                <p className="text-[11px] text-[#64748B]">
                  El cantón de Zúrich genera más del 18% del PIB suizo (148.500 millones CHF), combinando la solidez de la gestión global de activos (UBS, Swiss Re) con el mayor campus de ingeniería europea de Google y el ecosistema ETH.
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
                <h4 className="font-semibold text-[#0F172A] mb-1">
                  Región Lémanica (Ginebra & Vaud)
                </h4>
                <p className="text-[11px] text-[#64748B]">
                  Liderazgo en trading internacional de commodities, private banking, agroalimentario de precisión (Nestlé) y alta relojería de manufactura independiente (Rolex, Patek Philippe).
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
                <h4 className="font-semibold text-[#0F172A] mb-1">
                  Arco del Jura & Espace Mittelland
                </h4>
                <p className="text-[11px] text-[#64748B]">
                  Especialización en microtecnología, mecánica de ultra-precisión y relojería suiza. Presenta una resiliencia exportadora sólida respaldada por la I+D de instituciones como el CSEM.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Strategic Recommendations */}
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px] space-y-2">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D93856]" />
              Conclusiones Estratégicas para Consejos y Analistas
            </h3>
            <ul className="space-y-1.5 text-[11px] text-[#334155]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D93856] shrink-0 mt-0.5" />
                <span>
                  <strong>Ventaja Competitiva Estructural:</strong> El modelo suizo combina baja presión fiscal corporativa, paz laboral histórica y una intensidad de I+D del 3.45% del PIB, blindando los márgenes operativos de las empresas.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D93856] shrink-0 mt-0.5" />
                <span>
                  <strong>Mitigación del Riesgo Cambiario:</strong> El fortalecimiento del Franco Suizo actúa como un acelerador de la automatización en lugar de un freno competitivo, forzando a los fabricantes suizos hacia nichos de inelasticidad de demanda.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D93856] shrink-0 mt-0.5" />
                <span>
                  <strong>Sinergia Cantonal:</strong> Los cantones con alta especialización fiscal (Zug, Nidwalden, Schwyz) y centros metropolitanos complementan el tejido productivo federal.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-between">
          <span className="text-[11px] text-[#94A3B8]">
            Helvetia Analytical · Datos auditados BFS / OFS / SECO.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#D93856] hover:bg-[#E05370] rounded-[4px] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
