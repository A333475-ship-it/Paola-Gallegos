import React from 'react';
import { CantonProfile } from '../types/dashboard';
import { GREAT_REGIONS, MACRO_SWISS_YEARS } from '../data/swissEconomicData';
import { X, Building2, TrendingUp, Award, Briefcase, Factory, ArrowLeftRight, Users } from 'lucide-react';

interface CantonInspectorModalProps {
  canton: CantonProfile | null;
  currentYear: number;
  onClose: () => void;
  onYearSelect: (year: number) => void;
  onOpenCompare?: (cantonCode: string) => void;
}

export const CantonInspectorModal: React.FC<CantonInspectorModalProps> = ({
  canton,
  currentYear,
  onClose,
  onYearSelect,
  onOpenCompare,
}) => {
  if (!canton) return null;

  const cur = canton.history[currentYear];
  const macro = MACRO_SWISS_YEARS[currentYear] || MACRO_SWISS_YEARS[2024];
  const region = GREAT_REGIONS[canton.regionId];

  const deltaProd = cur.productivityPerHour - macro.avgProductivityPerHour;
  const deltaProdPct = (deltaProd / macro.avgProductivityPerHour) * 100;

  // Mini historical sparkline points (2012 to 2024)
  const years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const cantonVals = years.map((y) => canton.history[y]?.productivityPerHour || 0);
  const swissVals = years.map((y) => MACRO_SWISS_YEARS[y]?.avgProductivityPerHour || 0);

  const minV = Math.min(...cantonVals, ...swissVals) * 0.95;
  const maxV = Math.max(...cantonVals, ...swissVals) * 1.05;

  const w = 480;
  const h = 140;
  const pad = { top: 20, right: 20, bottom: 25, left: 35 };
  const cW = w - pad.left - pad.right;
  const cH = h - pad.top - pad.bottom;

  const getX = (idx: number) => pad.left + (idx / 12) * cW;
  const getY = (v: number) => pad.top + cH - ((v - minV) / (maxV - minV)) * cH;

  const cantonPts = cantonVals.map((v, i) => `${getX(i).toFixed(1)},${getY(v).toFixed(1)}`).join(' L ');
  const swissPts = swissVals.map((v, i) => `${getX(i).toFixed(1)},${getY(v).toFixed(1)}`).join(' L ');

  const sectors = cur.sectors.subsectors;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/40 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg shadow-[0_20px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.04)] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FFFFFF] border-b border-[#E2E8F0] p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[4px] bg-[#FCE8EC] border border-[#D93856] flex items-center justify-center font-bold text-lg text-[#D93856]">
              {canton.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Cantón {canton.name}
                </h3>
                <span className="text-xs text-[#94A3B8]">·</span>
                <span className="text-xs font-semibold text-[#D93856] tabular-nums">
                  Año {currentYear}
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Capital: {canton.capital} · {region?.nameEs}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[4px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
            title="Cerrar expediente"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {/* Top KPI Metrics 4-col */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
              <span className="text-[10.5px] uppercase font-semibold text-[#64748B] block mb-1">
                Productividad
              </span>
              <div className="text-xl font-bold text-[#0F172A] tabular-nums">
                {cur.productivityPerHour.toFixed(1)}
              </div>
              <span
                className={`text-[10px] font-semibold tabular-nums ${
                  deltaProd >= 0 ? 'text-[#334155]' : 'text-[#D93856]'
                }`}
              >
                {deltaProd >= 0 ? '+' : ''}
                {deltaProdPct.toFixed(1)}% vs Suiza
              </span>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
              <span className="text-[10.5px] uppercase font-semibold text-[#64748B] block mb-1">
                PIB Cantonal
              </span>
              <div className="text-xl font-bold text-[#0F172A] tabular-nums">
                {(cur.pibMillions / 1000).toFixed(1)}k
              </div>
              <span className="text-[10px] text-[#64748B]">M CHF nominales</span>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
              <span className="text-[10.5px] uppercase font-semibold text-[#64748B] block mb-1">
                PIB / Habitante
              </span>
              <div className="text-xl font-bold text-[#0F172A] tabular-nums">
                {Math.round(cur.pibPerCapita).toLocaleString('de-CH')}
              </div>
              <span className="text-[10px] text-[#64748B]">CHF por hab.</span>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
              <span className="text-[10.5px] uppercase font-semibold text-[#64748B] block mb-1">
                Competitividad Fiscal
              </span>
              <div className="text-xl font-bold text-[#D93856] tabular-nums">
                #{canton.taxCompetitivenessRank}
              </div>
              <span className="text-[10px] text-[#64748B]">de 26 Cantones</span>
            </div>
          </div>

          {/* Specialization & Top Companies */}
          <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-[4px]">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#334155] mb-2">
              <Factory className="w-4 h-4 text-[#D93856]" />
              <span>Especialización y Clústeres Productivos</span>
            </div>
            <p className="text-xs text-[#334155] leading-relaxed mb-3">
              {canton.specialization}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-[#64748B] font-medium mr-1">Empresas insignia:</span>
              {canton.topCompanies.map((comp) => (
                <span
                  key={comp}
                  className="px-2 py-0.5 text-xs font-medium text-[#334155] bg-[#F1F5F9] border border-[#E2E8F0] rounded-[3px]"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Historical Productivity Chart (2012-2024) */}
          <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-[4px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#334155]">
                <TrendingUp className="w-4 h-4 text-[#D93856]" />
                <span>Trayectoria de Productividad (2012-2024)</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-[#D93856]" />
                  <span className="text-[#0F172A] font-semibold">{canton.code}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-[#94A3B8]" />
                  <span className="text-[#64748B]">Suiza Media</span>
                </div>
              </div>
            </div>

            <div className="w-full aspect-[16/6] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px] overflow-hidden">
              <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
                {/* Horizontal grid lines */}
                {[90, 110, 130].map((tick) => {
                  if (tick < minV || tick > maxV) return null;
                  const y = getY(tick);
                  return (
                    <line
                      key={tick}
                      x1={pad.left}
                      y1={y}
                      x2={w - pad.right}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                    />
                  );
                })}

                {/* Swiss Average Line */}
                <path
                  d={`M ${swissPts}`}
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Canton Line */}
                <path
                  d={`M ${cantonPts}`}
                  fill="none"
                  stroke="#D93856"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Current Year Point */}
                <circle
                  cx={getX(currentYear - 2012)}
                  cy={getY(cur.productivityPerHour)}
                  r="4"
                  fill="#FFFFFF"
                  stroke="#D93856"
                  strokeWidth="2"
                />

                {/* Year labels */}
                {years.map((y, idx) => {
                  if (idx % 2 !== 0 && idx !== 12) return null;
                  return (
                    <text
                      key={y}
                      x={getX(idx)}
                      y={h - 6}
                      textAnchor="middle"
                      className="text-[9px] fill-[#64748B] tabular-nums cursor-pointer"
                      onClick={() => onYearSelect(y)}
                    >
                      {y}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Sector Share breakdown */}
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#334155] uppercase tracking-wider">
                Estructura del Valor Añadido Cantonal
              </span>
              <span className="text-xs text-[#64748B] tabular-nums">
                Empleo FTE: {cur.fteEmployment}k puestos
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-[#FFFFFF] rounded border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block">Farmacéutica/Química</span>
                <span className="font-bold text-[#0F172A] tabular-nums">
                  {sectors.pharmaChemical}%
                </span>
              </div>
              <div className="p-2 bg-[#FFFFFF] rounded border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block">Banca y Finanzas</span>
                <span className="font-bold text-[#0F172A] tabular-nums">
                  {sectors.financeInsurance}%
                </span>
              </div>
              <div className="p-2 bg-[#FFFFFF] rounded border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block">MEM y Relojería</span>
                <span className="font-bold text-[#0F172A] tabular-nums">
                  {sectors.precisionMEM}%
                </span>
              </div>
              <div className="p-2 bg-[#FFFFFF] rounded border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block">Tecnología y Servicios</span>
                <span className="font-bold text-[#0F172A] tabular-nums">
                  {sectors.techServices}%
                </span>
              </div>
            </div>
          </div>

          {/* Demographic & Population Profile */}
          <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-[4px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#334155] uppercase tracking-wider">
                <Users className="w-4 h-4 text-[#D93856]" />
                <span>Perfil Demográfico ({currentYear})</span>
              </div>
              <span className="text-[11px] text-[#64748B]">
                Crecimiento: <strong>{(cur.populationGrowthPct ?? 0) > 0 ? '+' : ''}{(cur.populationGrowthPct ?? 0).toFixed(2)}%</strong> YoY
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block">Población Residente</span>
                <span className="font-bold text-[#0F172A] text-sm tabular-nums">
                  {cur.population?.toLocaleString('de-CH')}
                </span>
                <span className="text-[10px] text-[#64748B] block mt-0.5">habitantes</span>
              </div>
              <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block">Tasa de Fecundidad</span>
                <span className="font-bold text-[#0F172A] text-sm tabular-nums">
                  {cur.fertilityRate?.toFixed(2)}
                </span>
                <span className={`text-[10px] block mt-0.5 ${cur.fertilityRate >= 1.4 ? 'text-[#334155]' : 'text-[#D93856]'}`}>
                  hijos/m. (ref: 2.10)
                </span>
              </div>
              <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block">Tasa de Mortalidad</span>
                <span className="font-bold text-[#0F172A] text-sm tabular-nums">
                  {cur.mortalityRate?.toFixed(1)}‰
                </span>
                <span className="text-[10px] text-[#64748B] block mt-0.5">por mil hab.</span>
              </div>
              <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block">Saldo Vegetativo</span>
                <span className={`font-bold text-sm tabular-nums ${(cur.naturalBalance ?? 0) >= 0 ? 'text-[#0F172A]' : 'text-[#D93856]'}`}>
                  {(cur.naturalBalance ?? 0) > 0 ? '+' : ''}
                  {cur.naturalBalance?.toLocaleString('de-CH')}
                </span>
                <span className="text-[10px] text-[#64748B] block mt-0.5">nac. vs defunc.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#FFFFFF] flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-[#94A3B8]">
            Fuente: Oficina Federal de Estadística (BFS) y SECO.
          </span>
          <div className="flex items-center gap-2">
            {onOpenCompare && (
              <button
                onClick={() => {
                  onOpenCompare(canton.code);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-[#0F172A] bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#94A3B8] rounded-[4px] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#D93856]" />
                <span>Comparar este cantón</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#D93856] hover:bg-[#E05370] rounded-[4px] transition-colors"
            >
              Cerrar Expediente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
