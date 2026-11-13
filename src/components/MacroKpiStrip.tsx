import React from 'react';
import { TrendingUp, TrendingDown, Clock, Building2, Users, Lightbulb } from 'lucide-react';
import { MACRO_SWISS_YEARS } from '../data/swissEconomicData';

interface MacroKpiStripProps {
  currentYear: number;
  onSelectKpi?: (metricKey: string) => void;
}

export const MacroKpiStrip: React.FC<MacroKpiStripProps> = ({ currentYear }) => {
  const current = MACRO_SWISS_YEARS[currentYear] || MACRO_SWISS_YEARS[2024];
  const previous = MACRO_SWISS_YEARS[currentYear - 1] || current;
  const baseline2012 = MACRO_SWISS_YEARS[2012];

  // Productivity
  const prodDelta = current.avgProductivityPerHour - previous.avgProductivityPerHour;
  const prodDeltaPct = (prodDelta / (previous.avgProductivityPerHour || 1)) * 100;
  const prodCumulativePct = ((current.avgProductivityPerHour - baseline2012.avgProductivityPerHour) / baseline2012.avgProductivityPerHour) * 100;

  // GDP
  const pibDelta = current.pibBillions - previous.pibBillions;
  const pibDeltaPct = (pibDelta / (previous.pibBillions || 1)) * 100;
  const pibCumulativePct = ((current.pibBillions - baseline2012.pibBillions) / baseline2012.pibBillions) * 100;

  // Employment FTE
  const fteDelta = current.totalFteEmploymentMillions - previous.totalFteEmploymentMillions;
  const fteDeltaPct = (fteDelta / (previous.totalFteEmploymentMillions || 1)) * 100;

  // Sparkline data for mini SVG trends (2012 to currentYear)
  const yearsRange = Object.keys(MACRO_SWISS_YEARS)
    .map(Number)
    .filter((yr) => yr <= currentYear)
    .sort((a, b) => a - b);

  const getSparklinePath = (metricAccessor: (y: typeof current) => number, height = 24, width = 64) => {
    if (yearsRange.length < 2) return '';
    const values = yearsRange.map((yr) => metricAccessor(MACRO_SWISS_YEARS[yr]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
      {/* KPI 1: Productividad Laboral Media */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            <Clock className="w-3.5 h-3.5 text-[#D93856]" />
            <span>Productividad Media</span>
          </div>
          {/* Sparkline mini chart */}
          <svg className="w-16 h-6 overflow-visible" viewBox="0 0 64 24" aria-hidden="true">
            <path
              d={getSparklinePath((d) => d.avgProductivityPerHour)}
              fill="none"
              stroke="#D93856"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold tracking-tight text-[#0F172A] tabular-nums">
            {current.avgProductivityPerHour.toFixed(1)}
          </span>
          <span className="text-xs font-medium text-[#64748B]">CHF / hora</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
          <div className="flex items-center gap-1">
            {prodDeltaPct >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#334155]" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#D93856]" />
            )}
            <span
              className={`font-semibold tabular-nums ${
                prodDeltaPct >= 0 ? 'text-[#334155]' : 'text-[#D93856]'
              }`}
            >
              {prodDeltaPct >= 0 ? '+' : ''}
              {prodDeltaPct.toFixed(1)}% YoY
            </span>
          </div>
          <span className="text-[11px] text-[#64748B] tabular-nums">
            +{prodCumulativePct.toFixed(1)}% vs 2012
          </span>
        </div>
      </div>

      {/* KPI 2: PIB Nacional Total */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            <Building2 className="w-3.5 h-3.5 text-[#334155]" />
            <span>PIB Total Suiza</span>
          </div>
          <svg className="w-16 h-6 overflow-visible" viewBox="0 0 64 24" aria-hidden="true">
            <path
              d={getSparklinePath((d) => d.pibBillions)}
              fill="none"
              stroke="#334155"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold tracking-tight text-[#0F172A] tabular-nums">
            {current.pibBillions.toFixed(1)}
          </span>
          <span className="text-xs font-medium text-[#64748B]">Miles de Millones CHF</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
          <div className="flex items-center gap-1">
            {current.pibGrowthRealPct >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#334155]" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#D93856]" />
            )}
            <span
              className={`font-semibold tabular-nums ${
                current.pibGrowthRealPct >= 0 ? 'text-[#334155]' : 'text-[#D93856]'
              }`}
            >
              {current.pibGrowthRealPct >= 0 ? '+' : ''}
              {current.pibGrowthRealPct.toFixed(1)}% Real
            </span>
          </div>
          <span className="text-[11px] text-[#64748B] tabular-nums">
            +{pibCumulativePct.toFixed(1)}% nominal
          </span>
        </div>
      </div>

      {/* KPI 3: Empleo Equivalente FTE */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            <Users className="w-3.5 h-3.5 text-[#515F74]" />
            <span>Puestos de Empleo FTE</span>
          </div>
          <svg className="w-16 h-6 overflow-visible" viewBox="0 0 64 24" aria-hidden="true">
            <path
              d={getSparklinePath((d) => d.totalFteEmploymentMillions)}
              fill="none"
              stroke="#515F74"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold tracking-tight text-[#0F172A] tabular-nums">
            {current.totalFteEmploymentMillions.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-[#64748B]">Millones FTE</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#334155]" />
            <span className="font-semibold text-[#334155] tabular-nums">
              +{fteDeltaPct.toFixed(1)}% YoY
            </span>
          </div>
          <span className="text-[11px] text-[#64748B] tabular-nums">
            Desempleo: {current.unemploymentRate}%
          </span>
        </div>
      </div>

      {/* KPI 4: Intensidad I+D & Innovación */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            <Lightbulb className="w-3.5 h-3.5 text-[#D93856]" />
            <span>Inversión I+D (% PIB)</span>
          </div>
          <svg className="w-16 h-6 overflow-visible" viewBox="0 0 64 24" aria-hidden="true">
            <path
              d={getSparklinePath((d) => d.rdIntensityPct)}
              fill="none"
              stroke="#D93856"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold tracking-tight text-[#0F172A] tabular-nums">
            {current.rdIntensityPct.toFixed(2)}%
          </span>
          <span className="text-xs font-medium text-[#64748B]">del PIB Nacional</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
          <span className="text-[11px] font-medium text-[#0F172A]">
            #1 Global en Patentes / hab.
          </span>
          <span className="text-[11px] text-[#64748B] tabular-nums">
            Exp: {current.exportBillions}k M CHF
          </span>
        </div>
      </div>
    </div>
  );
};
