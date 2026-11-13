import React, { useState } from 'react';
import { CantonCode, CantonProfile, RegionId } from '../types/dashboard';
import { CANTONS_DATA, GREAT_REGIONS } from '../data/swissEconomicData';
import { Crosshair } from 'lucide-react';

interface RegionalScatterPlotProps {
  currentYear: number;
  selectedCantonCode: CantonCode | null;
  onSelectCanton: (canton: CantonProfile | null) => void;
  selectedRegionId: RegionId | 'all';
}

export const RegionalScatterPlot: React.FC<RegionalScatterPlotProps> = ({
  currentYear,
  selectedCantonCode,
  onSelectCanton,
  selectedRegionId,
}) => {
  const [hoveredCanton, setHoveredCanton] = useState<CantonProfile | null>(null);

  // SVG dimensions
  const width = 800;
  const height = 400;
  const padding = { top: 30, right: 40, bottom: 50, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // X-axis: Empleo FTE (miles) or YoY Growth (0.5% to 3.5%)
  // Let's use YoY Growth (%) or FTE Employment (k) - YoY Employment Growth is super insightful:
  // Growth range: 0.0% to 4.0%
  const minX = 0.5;
  const maxX = 3.5;

  // Y-axis: Productivity (CHF/h): 70 to 175
  const minY = 70;
  const maxY = 175;

  const getX = (val: number) => padding.left + ((val - minX) / (maxX - minX)) * chartW;
  const getY = (val: number) => padding.top + chartH - ((val - minY) / (maxY - minY)) * chartH;

  // Calculate coordinates for each canton
  const points = CANTONS_DATA.map((canton) => {
    const cur = canton.history[currentYear];
    const prev = canton.history[currentYear - 1] || cur;
    const prod = cur?.productivityPerHour || 80;
    const fteGrowth = Number((((cur?.fteEmployment || 1) - (prev?.fteEmployment || 1)) / (prev?.fteEmployment || 1) * 100).toFixed(2));
    const pib = cur?.pibMillions || 10000;
    // Radius proportional to GDP sqrt
    const radius = Math.max(5, Math.min(22, Math.sqrt(pib / 1500) * 3));

    return {
      canton,
      prod,
      fteGrowth,
      pib,
      radius,
      x: getX(Math.max(minX, Math.min(maxX, fteGrowth))),
      y: getY(Math.max(minY, Math.min(maxY, prod))),
    };
  });

  // Benchmark quadrant mid-lines
  const midXVal = 1.9; // %
  const midYVal = 100; // CHF/h
  const midX = getX(midXVal);
  const midY = getY(midYVal);

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 lg:p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-[#F1F5F9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#64748B]">
              Matriz de Dispersión Estratégica
            </span>
            <span className="text-[#CBD5E1]">·</span>
            <span className="text-xs font-semibold text-[#D93856]">
              Año {currentYear}
            </span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-[#0F172A] mt-0.5">
            Productividad Laboral (CHF/h) vs. Dinamismo de Empleo (%)
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <Crosshair className="w-3.5 h-3.5 text-[#D93856]" />
          <span>Tamaño de burbuja = Volumen de PIB Cantonal (M CHF)</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[420px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-md select-none overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Quadrant Background Shading / Hairline lines */}
          <line
            x1={midX}
            y1={padding.top}
            x2={midX}
            y2={height - padding.bottom}
            stroke="#CBD5E1"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1={padding.left}
            y1={midY}
            x2={width - padding.right}
            y2={midY}
            stroke="#CBD5E1"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Quadrant Labels */}
          <text
            x={width - padding.right - 10}
            y={padding.top + 20}
            textAnchor="end"
            className="text-[10px] font-semibold fill-[#D93856]/80 uppercase tracking-wider"
          >
            I. Líderes de Alta Productividad & Crecimiento
          </text>
          <text
            x={padding.left + 10}
            y={padding.top + 20}
            textAnchor="start"
            className="text-[10px] font-semibold fill-[#515F74] uppercase tracking-wider"
          >
            II. Alta Especialización & Resiliencia
          </text>
          <text
            x={width - padding.right - 10}
            y={height - padding.bottom - 12}
            textAnchor="end"
            className="text-[10px] font-semibold fill-[#64748B] uppercase tracking-wider"
          >
            III. Expansión Intensiva en Empleo
          </text>
          <text
            x={padding.left + 10}
            y={height - padding.bottom - 12}
            textAnchor="start"
            className="text-[10px] font-semibold fill-[#94A3B8] uppercase tracking-wider"
          >
            IV. Estabilidad y Cohesión Territorial
          </text>

          {/* Y-axis Ticks & Labels */}
          {[80, 100, 120, 140, 160].map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="0.5"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-[#64748B] font-medium tabular-nums"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* X-axis Ticks & Labels */}
          {[1.0, 1.5, 2.0, 2.5, 3.0].map((tick) => {
            const x = getX(tick);
            return (
              <g key={tick}>
                <line
                  x1={x}
                  y1={height - padding.bottom}
                  x2={x}
                  y2={height - padding.bottom + 4}
                  stroke="#CBD5E1"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  className="text-[10px] fill-[#64748B] font-medium tabular-nums"
                >
                  +{tick.toFixed(1)}%
                </text>
              </g>
            );
          })}

          {/* Axis Titles */}
          <text
            x={padding.left - 42}
            y={padding.top + chartH / 2}
            textAnchor="middle"
            transform={`rotate(-90, ${padding.left - 42}, ${padding.top + chartH / 2})`}
            className="text-[10.5px] font-semibold fill-[#334155] uppercase tracking-wider"
          >
            Productividad (CHF / h)
          </text>
          <text
            x={padding.left + chartW / 2}
            y={height - 12}
            textAnchor="middle"
            className="text-[10.5px] font-semibold fill-[#334155] uppercase tracking-wider"
          >
            Crecimiento Interanual del Empleo FTE (%)
          </text>

          {/* Canton Bubbles */}
          {points.map((p) => {
            const isSelected = selectedCantonCode === p.canton.code;
            const isHovered = hoveredCanton?.code === p.canton.code;
            const isFiltered =
              selectedRegionId !== 'all' && p.canton.regionId !== selectedRegionId;
            const color = GREAT_REGIONS[p.canton.regionId]?.color || '#D93856';

            return (
              <g
                key={p.canton.code}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredCanton(p.canton)}
                onMouseLeave={() => setHoveredCanton(null)}
                onClick={() => onSelectCanton(isSelected ? null : p.canton)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={p.radius}
                  fill={color}
                  fillOpacity={isFiltered ? 0.15 : isHovered || isSelected ? 0.95 : 0.7}
                  stroke={isSelected || isHovered ? '#0F172A' : '#FFFFFF'}
                  strokeWidth={isSelected || isHovered ? 2 : 1}
                  className="transition-all duration-150"
                />
                <text
                  x={p.x}
                  y={p.y + 3.5}
                  textAnchor="middle"
                  className={`text-[9.5px] font-bold pointer-events-none select-none ${
                    isFiltered
                      ? 'fill-transparent'
                      : isHovered || isSelected
                      ? 'fill-white'
                      : 'fill-white'
                  }`}
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {p.canton.code}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover inspector card */}
        {hoveredCanton && (
          <div className="absolute top-3 left-3 bg-[#FFFFFF]/95 backdrop-blur-sm border border-[#E2E8F0] rounded-[4px] p-2.5 shadow-md text-xs pointer-events-none max-w-xs">
            <div className="font-bold text-[#0F172A] mb-0.5">
              {hoveredCanton.name} ({hoveredCanton.code})
            </div>
            <div className="text-[11px] text-[#64748B] mb-1">
              {GREAT_REGIONS[hoveredCanton.regionId]?.nameEs}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F1F5F9] tabular-nums text-[11px]">
              <div>
                <span className="text-[#64748B]">Productividad:</span>{' '}
                <strong className="text-[#D93856]">
                  {hoveredCanton.history[currentYear]?.productivityPerHour} CHF/h
                </strong>
              </div>
              <div>
                <span className="text-[#64748B]">PIB:</span>{' '}
                <strong className="text-[#0F172A]">
                  {(hoveredCanton.history[currentYear]?.pibMillions / 1000).toFixed(1)}k M CHF
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
