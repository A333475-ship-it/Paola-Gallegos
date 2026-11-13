import React, { useState } from 'react';
import { GREAT_REGIONS, MACRO_SWISS_YEARS } from '../data/swissEconomicData';
import { RegionId } from '../types/dashboard';
import { TrendingUp } from 'lucide-react';

interface ProductivityEvolutionChartProps {
  currentYear: number;
  onSelectYear: (year: number) => void;
  selectedRegionId: RegionId | 'all';
}

const YEARS = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const ProductivityEvolutionChart: React.FC<ProductivityEvolutionChartProps> = ({
  currentYear,
  onSelectYear,
  selectedRegionId,
}) => {
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  // Region lines data
  // Base productivity calibration per region relative to Swiss average
  const regionRatios: Record<RegionId, number> = {
    nordwestschweiz: 1.35, // Basel Pharma powerhouse (highest)
    zurich: 1.18,          // Zurich Financial/Tech
    lemanique: 1.08,       // Geneva & Vaud
    zentralschweiz: 1.04,  // Zug & Lucerne
    mittelland: 0.92,      // Bern & Watch Jura
    ostschweiz: 0.89,      // MEM & East
    ticino: 0.84,          // Southern hub
  };

  const activeHover = hoverYear !== null ? hoverYear : currentYear;

  // Chart dimensions & margins
  const width = 800;
  const height = 320;
  const padding = { top: 30, right: 40, bottom: 40, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Y-axis range: 60 to 160 CHF/h
  const minY = 65;
  const maxY = 155;

  const getX = (year: number) => {
    const idx = year - 2012;
    return padding.left + (idx / 12) * chartW;
  };

  const getY = (val: number) => {
    return padding.top + chartH - ((val - minY) / (maxY - minY)) * chartH;
  };

  // Generate path string
  const generatePath = (vals: number[]) => {
    const pts = vals.map((v, i) => `${getX(2012 + i).toFixed(1)},${getY(v).toFixed(1)}`);
    return `M ${pts.join(' L ')}`;
  };

  // Swiss National values
  const nationalProd = YEARS.map((y) => MACRO_SWISS_YEARS[y].avgProductivityPerHour);
  const nationalPath = generatePath(nationalProd);

  // Regional paths
  const regionSeries = (Object.keys(GREAT_REGIONS) as RegionId[]).map((rId) => {
    const ratio = regionRatios[rId];
    const vals = nationalProd.map((val) => Number((val * ratio).toFixed(1)));
    return {
      id: rId,
      name: GREAT_REGIONS[rId].nameEs,
      color: GREAT_REGIONS[rId].color,
      vals,
      path: generatePath(vals),
      currentVal: vals[activeHover - 2012],
    };
  });

  // Ticks
  const yTicks = [70, 90, 110, 130, 150];

  // Milestone annotations on chart
  const milestones = [
    { year: 2015, label: 'Desanclaje CHF (1.20)' },
    { year: 2020, label: 'COVID-19' },
    { year: 2023, label: 'UBS / Credit Suisse' },
  ];

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 lg:p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-[#F1F5F9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#64748B]">
              Trayectoria Histórica y Divergencia
            </span>
            <span className="text-[#CBD5E1]">·</span>
            <span className="text-xs font-semibold text-[#D93856]">
              2012 — 2024
            </span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-[#0F172A] mt-0.5">
            Evolución de la Productividad Laboral (CHF VAB / hora)
          </h2>
        </div>

        {/* Real-time Hover Value Badge */}
        <div className="flex items-center gap-3 bg-[#F8FAFC] px-3 py-1.5 rounded-[4px] border border-[#E2E8F0]">
          <span className="text-xs text-[#64748B]">Año seleccionado:</span>
          <span className="text-sm font-bold text-[#0F172A] tabular-nums">{activeHover}</span>
          <span className="text-xs text-[#94A3B8]">|</span>
          <span className="text-xs text-[#64748B]">Media Suiza:</span>
          <span className="text-sm font-bold text-[#D93856] tabular-nums">
            {nationalProd[activeHover - 2012]} CHF/h
          </span>
        </div>
      </div>

      {/* SVG Chart Frame */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] max-h-[360px] overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverYear(null)}
        >
          {/* Hairline Horizontal Grid lines per design spec */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="0.75"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] font-medium fill-[#94A3B8] tabular-nums"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* X-axis tick labels */}
          {YEARS.map((yr) => {
            const x = getX(yr);
            const isSelected = yr === activeHover;
            return (
              <g key={yr} className="cursor-pointer" onClick={() => onSelectYear(yr)}>
                <line
                  x1={x}
                  y1={height - padding.bottom}
                  x2={x}
                  y2={height - padding.bottom + 4}
                  stroke={isSelected ? '#D93856' : '#CBD5E1'}
                  strokeWidth={isSelected ? '1.5' : '1'}
                />
                <text
                  x={x}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  className={`text-[10px] tabular-nums cursor-pointer ${
                    isSelected ? 'fill-[#D93856] font-bold' : 'fill-[#64748B] hover:fill-[#0F172A]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {yr}
                </text>
              </g>
            );
          })}

          {/* Milestone Vertical Markers */}
          {milestones.map((m) => {
            const x = getX(m.year);
            return (
              <g key={m.year} className="opacity-75">
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="#94A3B8"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <rect
                  x={x - 45}
                  y={padding.top - 18}
                  width="90"
                  height="16"
                  fill="#FFFFFF"
                  stroke="#E2E8F0"
                  rx="3"
                />
                <text
                  x={x}
                  y={padding.top - 7}
                  textAnchor="middle"
                  className="text-[8.5px] font-semibold fill-[#515F74]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {m.label}
                </text>
              </g>
            );
          })}

          {/* Regional Lines */}
          {regionSeries.map((series) => {
            const isHighlighted = selectedRegionId === series.id;
            const isFiltered = selectedRegionId !== 'all' && !isHighlighted;
            return (
              <path
                key={series.id}
                d={series.path}
                fill="none"
                stroke={series.color}
                strokeWidth={isHighlighted ? '2.5' : '1.25'}
                opacity={isFiltered ? 0.2 : isHighlighted ? 1 : 0.65}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-200"
              />
            );
          })}

          {/* National Average Line: bold crimson Swiss Rose (#D93856) */}
          <path
            d={nationalPath}
            fill="none"
            stroke="#D93856"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Hover Crosshair Line */}
          {activeHover && (
            <line
              x1={getX(activeHover)}
              y1={padding.top}
              x2={getX(activeHover)}
              y2={height - padding.bottom}
              stroke="#0F172A"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          )}

          {/* Points on Active Year */}
          {activeHover && (
            <circle
              cx={getX(activeHover)}
              cy={getY(nationalProd[activeHover - 2012])}
              r="4.5"
              fill="#FFFFFF"
              stroke="#D93856"
              strokeWidth="2.5"
            />
          )}

          {/* Invisible interactive hover columns over each year for smooth scrub */}
          {YEARS.map((yr) => {
            const x = getX(yr);
            const colW = chartW / 12;
            return (
              <rect
                key={`hit-${yr}`}
                x={x - colW / 2}
                y={padding.top}
                width={colW}
                height={chartH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverYear(yr)}
                onClick={() => onSelectYear(yr)}
              />
            );
          })}
        </svg>
      </div>

      {/* Series Legend at bottom */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 pt-3 mt-1 border-t border-[#F1F5F9] text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
          <span className="w-3.5 h-1 bg-[#D93856] rounded-full" />
          <span>Media Nacional Suiza</span>
          <span className="text-[#64748B] tabular-nums font-normal">
            ({nationalProd[activeHover - 2012]} CHF/h)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {regionSeries.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5 text-[#515F74]">
              <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[11px]">{s.name.split(' ')[0]}:</span>
              <span className="text-[11px] font-semibold text-[#0F172A] tabular-nums">
                {s.currentVal}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
