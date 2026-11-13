import React, { useState } from 'react';
import { CantonCode, CantonProfile, MetricType, RegionId } from '../types/dashboard';
import { CANTONS_DATA, GREAT_REGIONS, MACRO_SWISS_YEARS, METRIC_DEFINITIONS } from '../data/swissEconomicData';
import { Filter, Layers } from 'lucide-react';

interface SwissChoroplethMapProps {
  currentYear: number;
  selectedCantonCode: CantonCode | null;
  onSelectCanton: (canton: CantonProfile | null) => void;
  selectedRegionId: RegionId | 'all';
  onSelectRegion: (regionId: RegionId | 'all') => void;
  selectedMetric: MetricType;
  onChangeMetric: (metric: MetricType) => void;
}

// Geometric paths representing the 26 Swiss Cantons in an 800 x 520 SVG coordinate space
// Meticulously mapped to the actual geographical silhouette of Switzerland
const CANTON_PATHS: Record<CantonCode, { d: string; labelX: number; labelY: number }> = {
  // Geneva (Southwest corner)
  GE: {
    d: 'M 115,385 L 145,365 L 165,380 L 160,405 L 135,420 L 115,405 Z',
    labelX: 138,
    labelY: 395
  },
  // Vaud (Wraps Lake Geneva, reaches north into Jura)
  VD: {
    d: 'M 145,365 L 195,310 L 235,320 L 250,355 L 230,385 L 180,385 L 165,380 Z M 195,305 L 225,275 L 245,290 L 225,315 Z',
    labelX: 205,
    labelY: 350
  },
  // Valais (Rhône Valley, Southern Alps)
  VS: {
    d: 'M 230,385 L 250,355 L 340,360 L 375,410 L 320,445 L 250,430 L 225,415 Z',
    labelX: 300,
    labelY: 400
  },
  // Neuchâtel (Jura lake & mountains)
  NE: {
    d: 'M 205,245 L 245,225 L 270,250 L 245,280 L 210,270 Z',
    labelX: 238,
    labelY: 255
  },
  // Fribourg (Between Vaud and Bern)
  FR: {
    d: 'M 245,290 L 285,275 L 305,315 L 280,345 L 250,335 L 240,305 Z',
    labelX: 275,
    labelY: 310
  },
  // Bern (Espace Mittelland core, stretching from Jura to Bernese Oberland)
  BE: {
    d: 'M 265,215 L 315,185 L 345,205 L 330,240 L 380,265 L 370,340 L 340,360 L 285,340 L 305,310 L 280,270 L 300,245 L 275,235 Z',
    labelX: 335,
    labelY: 275
  },
  // Jura (Northwest border with France)
  JU: {
    d: 'M 225,180 L 270,155 L 295,175 L 265,210 L 230,205 Z',
    labelX: 258,
    labelY: 185
  },
  // Solothurn (Enclaves in Northwest)
  SO: {
    d: 'M 295,180 L 340,165 L 360,195 L 330,215 L 305,200 Z',
    labelX: 330,
    labelY: 190
  },
  // Basel-Stadt (City canton on Rhine knee)
  BS: {
    d: 'M 315,125 L 340,120 L 345,140 L 320,145 Z',
    labelX: 330,
    labelY: 133
  },
  // Basel-Landschaft (Surrounding Basel-Stadt)
  BL: {
    d: 'M 310,145 L 360,140 L 375,168 L 335,175 L 315,155 Z',
    labelX: 345,
    labelY: 158
  },
  // Aargau (Meeting of Rhine, Aare, Reuss rivers)
  AG: {
    d: 'M 360,135 L 420,130 L 435,170 L 400,195 L 370,175 Z',
    labelX: 395,
    labelY: 160
  },
  // Zürich (Greater Zurich metropolitan hub)
  ZH: {
    d: 'M 425,128 L 475,125 L 485,175 L 450,200 L 425,180 L 430,150 Z',
    labelX: 452,
    labelY: 162
  },
  // Schaffhausen (North of Rhine enclave)
  SH: {
    d: 'M 435,95 L 475,90 L 485,115 L 445,120 Z',
    labelX: 460,
    labelY: 105
  },
  // Thurgau (South of Lake Constance)
  TG: {
    d: 'M 480,118 L 540,115 L 550,150 L 490,160 Z',
    labelX: 512,
    labelY: 135
  },
  // St. Gallen (Rings Appenzell, Lake Constance to Alps)
  SG: {
    d: 'M 495,162 L 560,150 L 585,185 L 565,245 L 525,230 L 515,195 Z',
    labelX: 545,
    labelY: 200
  },
  // Appenzell Ausserrhoden
  AR: {
    d: 'M 540,165 L 565,160 L 570,185 L 545,185 Z',
    labelX: 555,
    labelY: 172
  },
  // Appenzell Innerrhoden
  AI: {
    d: 'M 555,185 L 575,185 L 570,208 L 550,205 Z',
    labelX: 563,
    labelY: 195
  },
  // Glarus (Alpine valley)
  GL: {
    d: 'M 500,225 L 535,215 L 545,260 L 510,270 Z',
    labelX: 522,
    labelY: 245
  },
  // Zug (Central Switzerland crypto/tax hub)
  ZG: {
    d: 'M 425,198 L 455,195 L 460,220 L 430,225 Z',
    labelX: 442,
    labelY: 210
  },
  // Schwyz (Heart of Central Switzerland)
  SZ: {
    d: 'M 455,195 L 498,215 L 490,250 L 450,245 L 445,220 Z',
    labelX: 472,
    labelY: 228
  },
  // Lucerne (Luzern)
  LU: {
    d: 'M 375,200 L 420,195 L 425,245 L 385,255 L 365,225 Z',
    labelX: 398,
    labelY: 225
  },
  // Obwalden (Central alpine canton)
  OW: {
    d: 'M 380,260 L 415,255 L 410,295 L 375,290 Z',
    labelX: 395,
    labelY: 275
  },
  // Nidwalden (Borders Lake Lucerne)
  NW: {
    d: 'M 415,255 L 440,250 L 438,285 L 412,285 Z',
    labelX: 425,
    labelY: 268
  },
  // Uri (St. Gotthard axis)
  UR: {
    d: 'M 440,255 L 480,255 L 475,325 L 435,315 Z',
    labelX: 458,
    labelY: 288
  },
  // Graubünden / Grisons (Largest canton, Eastern Alps)
  GR: {
    d: 'M 525,235 L 595,210 L 675,230 L 685,305 L 615,355 L 555,335 L 545,270 Z',
    labelX: 615,
    labelY: 280
  },
  // Ticino (Southern Italian-speaking canton)
  TI: {
    d: 'M 455,335 L 505,335 L 515,420 L 475,465 L 445,410 L 470,370 Z',
    labelX: 480,
    labelY: 395
  }
};

export const SwissChoroplethMap: React.FC<SwissChoroplethMapProps> = ({
  currentYear,
  selectedCantonCode,
  onSelectCanton,
  selectedRegionId,
  onSelectRegion,
  selectedMetric,
  onChangeMetric,
}) => {
  const [hoveredCanton, setHoveredCanton] = useState<CantonProfile | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const def = METRIC_DEFINITIONS[selectedMetric];
  const macro = MACRO_SWISS_YEARS[currentYear] || MACRO_SWISS_YEARS[2024];

  // Calculate metric values for all cantons in currentYear
  const cantonValues = CANTONS_DATA.map((c) => ({
    canton: c,
    value: c.history[currentYear]?.[selectedMetric] || 0,
  }));

  const valuesArray = cantonValues.map((v) => v.value);
  const minValue = Math.min(...valuesArray);
  const maxValue = Math.max(...valuesArray);

  // Swiss design system color interpolation:
  // Starts at rose-tint (#FCE8EC) -> mid rose-muted (#F5A3B3) -> primary (#D93856)
  const getFillColor = (canton: CantonProfile) => {
    // Check if region filter is applied and matches
    if (selectedRegionId !== 'all' && canton.regionId !== selectedRegionId) {
      return '#F1F5F9'; // Non-active cantons filled with #F1F5F9 per spec
    }

    const val = canton.history[currentYear]?.[selectedMetric] || 0;
    const ratio = maxValue > minValue ? (val - minValue) / (maxValue - minValue) : 0.5;

    // Interpolate RGB:
    // 0.0 -> #FCE8EC (252, 232, 236)
    // 0.5 -> #F5A3B3 (245, 163, 179)
    // 1.0 -> #D93856 (217, 56, 86)
    let r, g, b;
    if (ratio <= 0.5) {
      const localRatio = ratio / 0.5;
      r = Math.round(252 + (245 - 252) * localRatio);
      g = Math.round(232 + (163 - 232) * localRatio);
      b = Math.round(236 + (179 - 236) * localRatio);
    } else {
      const localRatio = (ratio - 0.5) / 0.5;
      r = Math.round(245 + (217 - 245) * localRatio);
      g = Math.round(163 + (56 - 163) * localRatio);
      b = Math.round(179 + (86 - 179) * localRatio);
    }

    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleMouseMove = (e: React.MouseEvent, canton: CantonProfile) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredCanton(canton);
  };

  const handleMouseLeave = () => {
    setHoveredCanton(null);
    setTooltipPos(null);
  };

  // Regions for filter tabs
  const regionTabs: Array<{ id: RegionId | 'all'; label: string }> = [
    { id: 'all', label: 'Toda Suiza' },
    { id: 'zurich', label: 'Zúrich' },
    { id: 'nordwestschweiz', label: 'Basilea / Noroeste' },
    { id: 'lemanique', label: 'Lémanica' },
    { id: 'mittelland', label: 'Mittelland' },
    { id: 'zentralschweiz', label: 'Central (Zug/LU)' },
    { id: 'ostschweiz', label: 'Oriental' },
    { id: 'ticino', label: 'Tesino' },
  ];

  const metricTabs: Array<{ id: MetricType; label: string }> = [
    { id: 'productivityPerHour', label: 'Productividad (CHF/h)' },
    { id: 'pibMillions', label: 'PIB Total' },
    { id: 'pibPerCapita', label: 'PIB / Habitante' },
    { id: 'fteEmployment', label: 'Empleo FTE' },
    { id: 'rdIntensityPct', label: 'I+D (% PIB)' },
    { id: 'fertilityRate', label: 'Fecundidad' },
    { id: 'mortalityRate', label: 'Mortalidad' },
    { id: 'population', label: 'Población' },
  ];

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 lg:p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] mb-5">
      {/* Header of Map Card: Title, Metric Segmented Control, and Region Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#F1F5F9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#64748B]">
              Cartografía Económica Coroplética
            </span>
            <span className="text-[#CBD5E1]">·</span>
            <span className="text-xs font-semibold text-[#D93856] tabular-nums">
              Año {currentYear}
            </span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-[#0F172A] mt-0.5">
            Distribución Cantonal: {def.label}
          </h2>
        </div>

        {/* Metric Selector Buttons (Segmented interactive buttons per guidelines) */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F1F5F9] rounded-[4px]">
          {metricTabs.map((m) => {
            const isSelected = selectedMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onChangeMetric(m.id)}
                className={`px-2.5 py-1 text-xs rounded-[3px] transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#FFFFFF] text-[#D93856] font-semibold shadow-sm'
                    : 'text-[#515F74] hover:text-[#0F172A]'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Regional Quick Filter bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none text-xs">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-[#64748B]" />
          Región:
        </span>
        {regionTabs.map((r) => {
          const isSelected = selectedRegionId === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onSelectRegion(r.id)}
              className={`px-2.5 py-0.5 rounded-[4px] border transition-colors whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-[#FCE8EC] border-[#D93856] text-[#D93856] font-semibold'
                  : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#515F74] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* SVG Switzerland Map Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[500px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-md overflow-hidden flex items-center justify-center">
        <svg
          viewBox="100 80 600 400"
          className="w-full h-full max-h-[480px] p-2 select-none"
          aria-label="Mapa de Suiza por cantones"
        >
          {/* Subtle Hairline Grid Pattern in the background for architectural feel */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="2,4" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="800" height="520" fill="url(#grid)" opacity="0.6" />

          {/* Cantonal Polygons */}
          {CANTONS_DATA.map((canton) => {
            const pathInfo = CANTON_PATHS[canton.code];
            if (!pathInfo) return null;

            const isSelected = selectedCantonCode === canton.code;
            const isHovered = hoveredCanton?.code === canton.code;
            const fillColor = getFillColor(canton);

            return (
              <g
                key={canton.code}
                className="cursor-pointer transition-all duration-150"
                onClick={() => onSelectCanton(isSelected ? null : canton)}
                onMouseMove={(e) => handleMouseMove(e, canton)}
                onMouseLeave={handleMouseLeave}
              >
                <path
                  d={pathInfo.d}
                  fill={fillColor}
                  // Cantonal borders delineated by 0.75px stroke in #FFFFFF or #E2E8F0
                  // Hover/Selected Canton: 1.5px stroke in #0F172A per design spec
                  stroke={isSelected || isHovered ? '#0F172A' : '#FFFFFF'}
                  strokeWidth={isSelected || isHovered ? 1.75 : 0.75}
                  strokeLinejoin="round"
                  className="transition-colors duration-150"
                />

                {/* Canton Code label */}
                <text
                  x={pathInfo.labelX}
                  y={pathInfo.labelY}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className={`text-[9px] pointer-events-none font-semibold transition-opacity select-none ${
                    isSelected || isHovered ? 'fill-[#0F172A] font-bold' : 'fill-[#334155]'
                  }`}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    textShadow: '0 0 2px rgba(255,255,255,0.85)',
                  }}
                >
                  {canton.code}
                </text>
              </g>
            );
          })}

          {/* Major Swiss cities indicator dots for geographical context */}
          <g className="pointer-events-none">
            {/* Zurich */}
            <circle cx="440" cy="155" r="2.5" fill="#0F172A" />
            {/* Basel */}
            <circle cx="330" cy="135" r="2.5" fill="#0F172A" />
            {/* Bern */}
            <circle cx="330" cy="250" r="2.5" fill="#0F172A" />
            {/* Geneva */}
            <circle cx="140" cy="390" r="2.5" fill="#0F172A" />
            {/* Lausanne */}
            <circle cx="205" cy="340" r="2" fill="#0F172A" />
            {/* Lugano */}
            <circle cx="480" cy="420" r="2" fill="#0F172A" />
          </g>
        </svg>

        {/* Floating Tooltip matching design spec */}
        {hoveredCanton && tooltipPos && (
          <div
            className="absolute z-20 pointer-events-none bg-[#FFFFFF] border border-[#E2E8F0] rounded-[4px] p-2.5 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.08)] max-w-xs transition-opacity duration-100"
            style={{
              left: `${Math.min(tooltipPos.x + 14, 520)}px`,
              top: `${Math.max(tooltipPos.y - 80, 10)}px`,
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="font-semibold text-xs text-[#0F172A]">
                {hoveredCanton.name} ({hoveredCanton.code})
              </span>
              <span className="text-[10px] uppercase font-bold text-[#D93856] px-1 bg-[#FCE8EC] rounded">
                Rank #{hoveredCanton.taxCompetitivenessRank} Fiscal
              </span>
            </div>
            
            <div className="text-[11px] text-[#64748B] mb-1.5">
              {GREAT_REGIONS[hoveredCanton.regionId]?.nameEs}
            </div>

            <div className="flex items-baseline justify-between gap-3 py-1 border-t border-[#F1F5F9] tabular-nums">
              <span className="text-xs text-[#334155]">{def.shortLabel}:</span>
              <span className="text-sm font-bold text-[#0F172A]">
                {def.format(hoveredCanton.history[currentYear]?.[selectedMetric] || 0)}
              </span>
            </div>

            {selectedMetric === 'productivityPerHour' && (
              <div className="text-[10px] text-[#64748B] flex items-center justify-between pt-0.5 tabular-nums">
                <span>vs. Media Suiza ({macro.avgProductivityPerHour.toFixed(1)}):</span>
                <span
                  className={`font-semibold ${
                    (hoveredCanton.history[currentYear]?.productivityPerHour || 0) >= macro.avgProductivityPerHour
                      ? 'text-[#334155]'
                      : 'text-[#D93856]'
                  }`}
                >
                  {(
                    (((hoveredCanton.history[currentYear]?.productivityPerHour || 0) - macro.avgProductivityPerHour) /
                      macro.avgProductivityPerHour) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            )}

            <div className="text-[10px] text-[#64748B] pt-1.5 border-t border-[#F1F5F9] truncate">
              <span className="font-medium text-[#334155]">Especialización: </span>
              {hoveredCanton.specialization}
            </div>
          </div>
        )}

        {/* Legend in bottom left */}
        <div className="absolute bottom-2.5 left-2.5 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#E2E8F0] rounded-[4px] p-2 text-[11px] shadow-sm">
          <div className="flex items-center gap-1.5 mb-1 text-[#64748B] font-medium">
            <Layers className="w-3 h-3 text-[#D93856]" />
            <span>Escala Coroplética ({def.unit})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="tabular-nums font-medium text-[#64748B] text-[10px]">
              {minValue.toFixed(0)}
            </span>
            <div
              className="w-28 h-2.5 rounded-[2px]"
              style={{
                background: 'linear-gradient(to right, #FCE8EC, #F5A3B3, #D93856)',
              }}
            />
            <span className="tabular-nums font-semibold text-[#0F172A] text-[10px]">
              {maxValue.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Selected Canton notification bar in top right */}
        {selectedCantonCode && (
          <div className="absolute top-2.5 right-2.5 bg-[#FFFFFF] border border-[#D93856] rounded-[4px] px-2.5 py-1 text-xs flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#D93856]" />
            <span className="font-medium text-[#0F172A]">
              Cantón filtrado: <strong>{selectedCantonCode}</strong>
            </span>
            <button
              onClick={() => onSelectCanton(null)}
              className="text-[#94A3B8] hover:text-[#0F172A] text-xs font-bold ml-1"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
