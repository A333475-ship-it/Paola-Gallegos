import React, { useState, useMemo } from 'react';
import { CantonProfile, RegionId } from '../types/dashboard';
import { CANTONS_DATA, GREAT_REGIONS, MACRO_SWISS_YEARS } from '../data/swissEconomicData';
import {
  Users,
  Baby,
  Activity,
  HeartPulse,
  TrendingUp,
  Scale,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Layers,
  MapPin,
} from 'lucide-react';

interface DemographicDynamicsChartProps {
  currentYear: number;
  onSelectYear: (year: number) => void;
  selectedRegionId: RegionId | 'all';
  onSelectRegion?: (regionId: RegionId | 'all') => void;
  selectedCanton?: CantonProfile | null;
  onSelectCanton?: (canton: CantonProfile | null) => void;
}

type DemographicChartTab = 'fertilityMortality' | 'populationGrowth' | 'naturalBalance' | 'regionalMatrix';

export const DemographicDynamicsChart: React.FC<DemographicDynamicsChartProps> = ({
  currentYear,
  onSelectYear,
  selectedRegionId,
  onSelectRegion,
  selectedCanton,
  onSelectCanton,
}) => {
  const [activeTab, setActiveTab] = useState<DemographicChartTab>('fertilityMortality');

  const macro = MACRO_SWISS_YEARS[currentYear] || MACRO_SWISS_YEARS[2024];

  // Aggregated or entity-specific data for currentYear
  const entityData = useMemo(() => {
    // 1. Canton specific
    if (selectedCanton) {
      const d = selectedCanton.history[currentYear];
      return {
        name: `Cantón ${selectedCanton.name} (${selectedCanton.code})`,
        subtitle: GREAT_REGIONS[selectedCanton.regionId]?.nameEs || selectedCanton.regionId,
        isCanton: true,
        population: d.population,
        populationGrowthPct: d.populationGrowthPct || 0.9,
        fertilityRate: d.fertilityRate,
        mortalityRate: d.mortalityRate,
        birthsCount: d.birthsCount,
        deathsCount: d.deathsCount,
        naturalBalance: d.naturalBalance,
      };
    }

    // 2. Region specific
    if (selectedRegionId !== 'all') {
      const reg = GREAT_REGIONS[selectedRegionId];
      const cantons = CANTONS_DATA.filter((c) => c.regionId === selectedRegionId);
      const totalPop = cantons.reduce((sum, c) => sum + (c.history[currentYear]?.population || 0), 0);
      const weightedFert = cantons.reduce(
        (sum, c) => sum + (c.history[currentYear]?.fertilityRate || 0) * (c.history[currentYear]?.population || 0),
        0
      ) / (totalPop || 1);
      const weightedMort = cantons.reduce(
        (sum, c) => sum + (c.history[currentYear]?.mortalityRate || 0) * (c.history[currentYear]?.population || 0),
        0
      ) / (totalPop || 1);
      const totalBirths = cantons.reduce((sum, c) => sum + (c.history[currentYear]?.birthsCount || 0), 0);
      const totalDeaths = cantons.reduce((sum, c) => sum + (c.history[currentYear]?.deathsCount || 0), 0);

      // Prior year population for growth
      const prevYear = currentYear > 2012 ? currentYear - 1 : 2012;
      const prevPop = cantons.reduce((sum, c) => sum + (c.history[prevYear]?.population || 0), 0);
      const popGrowth = prevPop ? ((totalPop - prevPop) / prevPop) * 100 : 0.9;

      return {
        name: reg.nameEs,
        subtitle: `${cantons.length} Cantones: ${reg.cantons.join(', ')}`,
        isCanton: false,
        population: totalPop,
        populationGrowthPct: Number(popGrowth.toFixed(2)),
        fertilityRate: Number(weightedFert.toFixed(2)),
        mortalityRate: Number(weightedMort.toFixed(1)),
        birthsCount: totalBirths,
        deathsCount: totalDeaths,
        naturalBalance: totalBirths - totalDeaths,
      };
    }

    // 3. National Switzerland
    const prevYear = currentYear > 2012 ? currentYear - 1 : 2012;
    const prevPopM = MACRO_SWISS_YEARS[prevYear]?.totalPopulationMillions || 8.0;
    const popGrowth = ((macro.totalPopulationMillions - prevPopM) / prevPopM) * 100;

    return {
      name: 'Confederación Suiza (Nivel Federal)',
      subtitle: '26 Cantones · 7 Grandes Regiones',
      isCanton: false,
      population: Math.round(macro.totalPopulationMillions * 1000000),
      populationGrowthPct: Number(popGrowth.toFixed(2)),
      fertilityRate: macro.avgFertilityRate,
      mortalityRate: macro.avgMortalityRate,
      birthsCount: Math.round(macro.totalBirthsThousands * 1000),
      deathsCount: Math.round(macro.totalDeathsThousands * 1000),
      naturalBalance: Math.round(macro.naturalBalanceThousands * 1000),
    };
  }, [currentYear, selectedCanton, selectedRegionId, macro]);

  // Historical series (2012-2024) for charting
  const years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  const seriesData = useMemo(() => {
    return years.map((yr) => {
      const chMacro = MACRO_SWISS_YEARS[yr];

      if (selectedCanton) {
        const d = selectedCanton.history[yr];
        return {
          year: yr,
          population: d.population,
          fertilityRate: d.fertilityRate,
          mortalityRate: d.mortalityRate,
          birthsCount: d.birthsCount,
          deathsCount: d.deathsCount,
          naturalBalance: d.naturalBalance,
          chFertility: chMacro.avgFertilityRate,
          chMortality: chMacro.avgMortalityRate,
          chPopulation: Math.round(chMacro.totalPopulationMillions * 1000000),
        };
      }

      if (selectedRegionId !== 'all') {
        const cantons = CANTONS_DATA.filter((c) => c.regionId === selectedRegionId);
        const totalPop = cantons.reduce((sum, c) => sum + (c.history[yr]?.population || 0), 0);
        const weightedFert = cantons.reduce(
          (sum, c) => sum + (c.history[yr]?.fertilityRate || 0) * (c.history[yr]?.population || 0),
          0
        ) / (totalPop || 1);
        const weightedMort = cantons.reduce(
          (sum, c) => sum + (c.history[yr]?.mortalityRate || 0) * (c.history[yr]?.population || 0),
          0
        ) / (totalPop || 1);
        const totalBirths = cantons.reduce((sum, c) => sum + (c.history[yr]?.birthsCount || 0), 0);
        const totalDeaths = cantons.reduce((sum, c) => sum + (c.history[yr]?.deathsCount || 0), 0);

        return {
          year: yr,
          population: totalPop,
          fertilityRate: Number(weightedFert.toFixed(2)),
          mortalityRate: Number(weightedMort.toFixed(1)),
          birthsCount: totalBirths,
          deathsCount: totalDeaths,
          naturalBalance: totalBirths - totalDeaths,
          chFertility: chMacro.avgFertilityRate,
          chMortality: chMacro.avgMortalityRate,
          chPopulation: Math.round(chMacro.totalPopulationMillions * 1000000),
        };
      }

      return {
        year: yr,
        population: Math.round(chMacro.totalPopulationMillions * 1000000),
        fertilityRate: chMacro.avgFertilityRate,
        mortalityRate: chMacro.avgMortalityRate,
        birthsCount: Math.round(chMacro.totalBirthsThousands * 1000),
        deathsCount: Math.round(chMacro.totalDeathsThousands * 1000),
        naturalBalance: Math.round(chMacro.naturalBalanceThousands * 1000),
        chFertility: chMacro.avgFertilityRate,
        chMortality: chMacro.avgMortalityRate,
        chPopulation: Math.round(chMacro.totalPopulationMillions * 1000000),
      };
    });
  }, [years, selectedCanton, selectedRegionId]);

  // Regional comparisons for currentYear
  const regionalSummary = useMemo(() => {
    return Object.values(GREAT_REGIONS).map((reg) => {
      const cantons = CANTONS_DATA.filter((c) => c.regionId === reg.id);
      const totalPop = cantons.reduce((sum, c) => sum + (c.history[currentYear]?.population || 0), 0);
      const weightedFert = cantons.reduce(
        (sum, c) => sum + (c.history[currentYear]?.fertilityRate || 0) * (c.history[currentYear]?.population || 0),
        0
      ) / (totalPop || 1);
      const weightedMort = cantons.reduce(
        (sum, c) => sum + (c.history[currentYear]?.mortalityRate || 0) * (c.history[currentYear]?.population || 0),
        0
      ) / (totalPop || 1);
      const totalBirths = cantons.reduce((sum, c) => sum + (c.history[currentYear]?.birthsCount || 0), 0);
      const totalDeaths = cantons.reduce((sum, c) => sum + (c.history[currentYear]?.deathsCount || 0), 0);

      const pop2012 = cantons.reduce((sum, c) => sum + (c.history[2012]?.population || 0), 0);
      const growth2012 = pop2012 ? ((totalPop - pop2012) / pop2012) * 100 : 0;

      return {
        id: reg.id,
        name: reg.nameEs,
        color: reg.color,
        cantonsCount: cantons.length,
        cantonCodes: reg.cantons,
        population: totalPop,
        fertilityRate: Number(weightedFert.toFixed(2)),
        mortalityRate: Number(weightedMort.toFixed(1)),
        birthsCount: totalBirths,
        deathsCount: totalDeaths,
        naturalBalance: totalBirths - totalDeaths,
        growthSince2012: Number(growth2012.toFixed(1)),
      };
    });
  }, [currentYear]);

  // SVG Chart Dimensions
  const chartW = 760;
  const chartH = 240;
  const pad = { top: 25, right: 45, bottom: 35, left: 45 };
  const plotW = chartW - pad.left - pad.right;
  const plotH = chartH - pad.top - pad.bottom;

  const getCoordX = (idx: number) => pad.left + (idx / (years.length - 1)) * plotW;

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 lg:p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-6">
      {/* 1. Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D93856]" />
            <span className="text-xs uppercase font-semibold tracking-wider text-[#D93856]">
              Demografía, Fecundidad y Mortalidad Regional
            </span>
            <span className="text-[#CBD5E1]">·</span>
            <span className="text-xs font-semibold text-[#0F172A] tabular-nums">
              Año {currentYear}
            </span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-[#0F172A] mt-0.5">
            Evolución Demográfica: {entityData.name}
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Seguimiento de la tasa global de fecundidad (hijos/mujer), tasa bruta de mortalidad (‰) y dinámica poblacional suiza (2012–2024).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] px-2 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[#475569] font-medium">
            Fuente: BFS / OFS Suiza
          </span>
          {selectedCanton && (
            <button
              onClick={() => onSelectCanton && onSelectCanton(null)}
              className="text-xs px-2 py-0.5 text-[#D93856] hover:bg-[#FCE8EC] rounded font-medium transition-colors"
            >
              Restablecer Selección
            </button>
          )}
        </div>
      </div>

      {/* 2. Top 4 Demographic KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Total Population */}
        <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-semibold text-[#64748B]">
              Población Residente
            </span>
            <Users className="w-4 h-4 text-[#D93856]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#0F172A] tabular-nums">
            {entityData.population.toLocaleString('de-CH')}
          </div>
          <div className="flex items-center gap-1.5 text-xs mt-1">
            <span
              className={`font-semibold flex items-center tabular-nums ${
                entityData.populationGrowthPct >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
              }`}
            >
              {entityData.populationGrowthPct >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5 inline" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 inline" />
              )}
              {entityData.populationGrowthPct > 0 ? '+' : ''}
              {entityData.populationGrowthPct}% YoY
            </span>
            <span className="text-[#94A3B8]">·</span>
            <span className="text-[#64748B] text-[11px]">Residencia permanente</span>
          </div>
        </div>

        {/* KPI 2: Fertility Rate */}
        <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-semibold text-[#64748B]">
              Tasa de Fecundidad (TGF)
            </span>
            <Baby className="w-4 h-4 text-[#D93856]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#0F172A] tabular-nums">
            {entityData.fertilityRate.toFixed(2)}{' '}
            <span className="text-xs font-normal text-[#64748B]">hijos/m</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs mt-1">
            <span className="text-[#DC2626] font-semibold tabular-nums">
              {(entityData.fertilityRate - 2.1).toFixed(2)}
            </span>
            <span className="text-[#64748B] text-[11px]">vs Reemplazo (2.10)</span>
          </div>
        </div>

        {/* KPI 3: Mortality Rate */}
        <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-semibold text-[#64748B]">
              Tasa de Mortalidad
            </span>
            <HeartPulse className="w-4 h-4 text-[#334155]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#0F172A] tabular-nums">
            {entityData.mortalityRate.toFixed(1)}{' '}
            <span className="text-xs font-normal text-[#64748B]">‰ (por mil hab.)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs mt-1">
            <span className="text-[#334155] font-semibold tabular-nums">
              {entityData.deathsCount.toLocaleString('de-CH')}
            </span>
            <span className="text-[#64748B] text-[11px]">defunciones anuales</span>
          </div>
        </div>

        {/* KPI 4: Natural Demographic Balance */}
        <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-semibold text-[#64748B]">
              Saldo Vegetativo Natural
            </span>
            <Scale className="w-4 h-4 text-[#D93856]" />
          </div>
          <div
            className={`text-xl sm:text-2xl font-bold tabular-nums ${
              entityData.naturalBalance >= 0 ? 'text-[#0F172A]' : 'text-[#DC2626]'
            }`}
          >
            {entityData.naturalBalance > 0 ? '+' : ''}
            {entityData.naturalBalance.toLocaleString('de-CH')}
          </div>
          <div className="flex items-center gap-1.5 text-xs mt-1 text-[#64748B]">
            <span className="text-[#16A34A] font-semibold tabular-nums">
              {entityData.birthsCount.toLocaleString('de-CH')} nac.
            </span>
            <span>vs</span>
            <span className="text-[#334155] font-semibold tabular-nums">
              {entityData.deathsCount.toLocaleString('de-CH')} def.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Multi-Chart Panel */}
      <div className="border border-[#E2E8F0] rounded-md p-4 bg-[#FFFFFF]">
        {/* Navigation Sub-Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#F1F5F9] rounded text-xs">
            <button
              onClick={() => setActiveTab('fertilityMortality')}
              className={`px-3 py-1.5 rounded font-medium transition-all whitespace-nowrap ${
                activeTab === 'fertilityMortality'
                  ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Fecundidad vs Mortalidad (Tijera Demográfica)
            </button>

            <button
              onClick={() => setActiveTab('populationGrowth')}
              className={`px-3 py-1.5 rounded font-medium transition-all whitespace-nowrap ${
                activeTab === 'populationGrowth'
                  ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Crecimiento de Población (2012–2024)
            </button>

            <button
              onClick={() => setActiveTab('naturalBalance')}
              className={`px-3 py-1.5 rounded font-medium transition-all whitespace-nowrap ${
                activeTab === 'naturalBalance'
                  ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Saldo Natural (Nacimientos vs Defunciones)
            </button>

            <button
              onClick={() => setActiveTab('regionalMatrix')}
              className={`px-3 py-1.5 rounded font-medium transition-all whitespace-nowrap ${
                activeTab === 'regionalMatrix'
                  ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Matriz Demográfica Regional
            </button>
          </div>

          <span className="text-xs text-[#64748B] tabular-nums">
            Sincronizado con año activo: <strong>{currentYear}</strong>
          </span>
        </div>

        {/* TAB A: FERTILITY & MORTALITY DUAL AXIS CHART */}
        {activeTab === 'fertilityMortality' && (
          <div>
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 px-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#D93856]" />
                  <strong className="text-[#0F172A]">Fecundidad (Eje Izquierdo: hijos/mujer)</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#334155]" />
                  <strong className="text-[#0F172A]">Mortalidad (Eje Derecho: ‰ por mil hab.)</strong>
                </span>
                <span className="flex items-center gap-1.5 text-[#94A3B8]">
                  <span className="w-3 h-0.5 border-t border-dashed border-[#94A3B8]" />
                  <span>Nivel de reemplazo generacional (2.10)</span>
                </span>
              </div>
              <span className="text-[11px] hidden md:inline">
                Haga clic en cualquier punto para cambiar de año
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[620px]">
                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto select-none">
                  {/* Gridlines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((r) => {
                    const y = pad.top + plotH * r;
                    const fertVal = (1.7 - r * (1.7 - 1.1)).toFixed(2);
                    const mortVal = (11.0 - r * (11.0 - 6.0)).toFixed(1);
                    return (
                      <g key={r}>
                        <line
                          x1={pad.left}
                          y1={y}
                          x2={chartW - pad.right}
                          y2={y}
                          stroke="#E2E8F0"
                          strokeDasharray="2,2"
                        />
                        {/* Left axis (Fertility) */}
                        <text
                          x={pad.left - 6}
                          y={y + 3.5}
                          textAnchor="end"
                          className="text-[10px] fill-[#D93856] font-mono tabular-nums font-semibold"
                        >
                          {fertVal}
                        </text>
                        {/* Right axis (Mortality) */}
                        <text
                          x={chartW - pad.right + 6}
                          y={y + 3.5}
                          textAnchor="start"
                          className="text-[10px] fill-[#334155] font-mono tabular-nums font-semibold"
                        >
                          {mortVal}‰
                        </text>
                      </g>
                    );
                  })}

                  {/* Replacement level horizontal line (2.10) - scaled above */}
                  <line
                    x1={pad.left}
                    y1={pad.top}
                    x2={chartW - pad.right}
                    y2={pad.top}
                    stroke="#D93856"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    strokeOpacity="0.5"
                  />

                  {/* Active Year Vertical highlight */}
                  {(() => {
                    const idx = years.indexOf(currentYear);
                    if (idx >= 0) {
                      const x = getCoordX(idx);
                      return (
                        <g>
                          <line
                            x1={x}
                            y1={pad.top}
                            x2={x}
                            y2={pad.top + plotH}
                            stroke="#D93856"
                            strokeWidth="1.5"
                            strokeOpacity="0.4"
                            strokeDasharray="3,3"
                          />
                          <rect
                            x={x - 18}
                            y={pad.top - 20}
                            width={36}
                            height={16}
                            rx={3}
                            fill="#D93856"
                          />
                          <text
                            x={x}
                            y={pad.top - 8}
                            textAnchor="middle"
                            className="text-[10px] font-bold fill-white font-mono"
                          >
                            {currentYear}
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })()}

                  {/* Paths calculation */}
                  {(() => {
                    // Fertility: min 1.1, max 1.7
                    const getFertY = (f: number) => pad.top + plotH - ((f - 1.1) / (1.7 - 1.1)) * plotH;
                    // Mortality: min 6.0, max 11.0
                    const getMortY = (m: number) => pad.top + plotH - ((m - 6.0) / (11.0 - 6.0)) * plotH;

                    const fertPath = seriesData
                      .map((d, i) => `${getCoordX(i).toFixed(1)},${getFertY(d.fertilityRate).toFixed(1)}`)
                      .join(' L ');

                    const mortPath = seriesData
                      .map((d, i) => `${getCoordX(i).toFixed(1)},${getMortY(d.mortalityRate).toFixed(1)}`)
                      .join(' L ');

                    return (
                      <g>
                        {/* Mortality Curve */}
                        <path
                          d={'M ' + mortPath}
                          fill="none"
                          stroke="#334155"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Fertility Curve */}
                        <path
                          d={'M ' + fertPath}
                          fill="none"
                          stroke="#D93856"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Interactive dots for Fertility */}
                        {seriesData.map((d, i) => {
                          const x = getCoordX(i);
                          const y = getFertY(d.fertilityRate);
                          const isCurrent = d.year === currentYear;
                          return (
                            <g
                              key={`f-${d.year}`}
                              onClick={() => onSelectYear(d.year)}
                              className="cursor-pointer group"
                            >
                              <circle
                                cx={x}
                                cy={y}
                                r={isCurrent ? 6 : 3.5}
                                fill={isCurrent ? '#D93856' : '#FFFFFF'}
                                stroke="#D93856"
                                strokeWidth={isCurrent ? 2.5 : 2}
                                className="transition-all hover:scale-125"
                              />
                              {isCurrent && (
                                <text
                                  x={x}
                                  y={y - 9}
                                  textAnchor="middle"
                                  className="text-[10px] font-bold fill-[#D93856] font-mono"
                                >
                                  {d.fertilityRate.toFixed(2)}
                                </text>
                              )}
                            </g>
                          );
                        })}

                        {/* Interactive dots for Mortality */}
                        {seriesData.map((d, i) => {
                          const x = getCoordX(i);
                          const y = getMortY(d.mortalityRate);
                          const isCurrent = d.year === currentYear;
                          return (
                            <g
                              key={`m-${d.year}`}
                              onClick={() => onSelectYear(d.year)}
                              className="cursor-pointer group"
                            >
                              <circle
                                cx={x}
                                cy={y}
                                r={isCurrent ? 6 : 3.5}
                                fill={isCurrent ? '#334155' : '#FFFFFF'}
                                stroke="#334155"
                                strokeWidth={isCurrent ? 2.5 : 2}
                                className="transition-all hover:scale-125"
                              />
                              {isCurrent && (
                                <text
                                  x={x}
                                  y={y + 15}
                                  textAnchor="middle"
                                  className="text-[10px] font-bold fill-[#334155] font-mono"
                                >
                                  {d.mortalityRate.toFixed(1)}‰
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </g>
                    );
                  })()}

                  {/* X Axis Years */}
                  {years.map((yr, idx) => {
                    const x = getCoordX(idx);
                    const isCurrent = yr === currentYear;
                    return (
                      <text
                        key={yr}
                        x={x}
                        y={pad.top + plotH + 20}
                        textAnchor="middle"
                        onClick={() => onSelectYear(yr)}
                        className={`text-[11px] font-mono cursor-pointer transition-colors ${
                          isCurrent
                            ? 'fill-[#0F172A] font-bold underline'
                            : 'fill-[#64748B] hover:fill-[#0F172A]'
                        }`}
                      >
                        {yr}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* TAB B: POPULATION GROWTH CHART */}
        {activeTab === 'populationGrowth' && (
          <div>
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 px-1">
              <span className="font-semibold text-[#0F172A]">
                Evolución de Habitantes Residentes Permanentes (2012–2024)
              </span>
              <span>Unidad: Habitantes censados</span>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[620px]">
                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto select-none">
                  {(() => {
                    const popVals = seriesData.map((d) => d.population);
                    const minPop = Math.min(...popVals) * 0.96;
                    const maxPop = Math.max(...popVals) * 1.04;
                    const getPopY = (v: number) =>
                      pad.top + plotH - ((v - minPop) / (maxPop - minPop || 1)) * plotH;

                    const path = seriesData
                      .map((d, i) => `${getCoordX(i).toFixed(1)},${getPopY(d.population).toFixed(1)}`)
                      .join(' L ');

                    const areaPath = `M ${getCoordX(0)},${pad.top + plotH} L ${path} L ${getCoordX(
                      seriesData.length - 1
                    )},${pad.top + plotH} Z`;

                    return (
                      <g>
                        {/* Grid */}
                        {[0, 0.5, 1].map((r) => {
                          const y = pad.top + plotH * r;
                          const val = maxPop - r * (maxPop - minPop);
                          return (
                            <g key={r}>
                              <line
                                x1={pad.left}
                                y1={y}
                                x2={chartW - pad.right}
                                y2={y}
                                stroke="#E2E8F0"
                                strokeDasharray="2,2"
                              />
                              <text
                                x={pad.left - 6}
                                y={y + 3.5}
                                textAnchor="end"
                                className="text-[10px] fill-[#64748B] font-mono tabular-nums"
                              >
                                {Math.round(val).toLocaleString('de-CH')}
                              </text>
                            </g>
                          );
                        })}

                        {/* Area gradient */}
                        <defs>
                          <linearGradient id="popAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D93856" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#D93856" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d={areaPath} fill="url(#popAreaGrad)" />

                        {/* Line */}
                        <path
                          d={'M ' + path}
                          fill="none"
                          stroke="#D93856"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Dots */}
                        {seriesData.map((d, i) => {
                          const x = getCoordX(i);
                          const y = getPopY(d.population);
                          const isCurrent = d.year === currentYear;
                          return (
                            <g
                              key={d.year}
                              onClick={() => onSelectYear(d.year)}
                              className="cursor-pointer"
                            >
                              <circle
                                cx={x}
                                cy={y}
                                r={isCurrent ? 6 : 3.5}
                                fill={isCurrent ? '#D93856' : '#FFFFFF'}
                                stroke="#D93856"
                                strokeWidth={isCurrent ? 2.5 : 2}
                              />
                              {isCurrent && (
                                <text
                                  x={x}
                                  y={y - 9}
                                  textAnchor="middle"
                                  className="text-[10px] font-bold fill-[#0F172A] font-mono"
                                >
                                  {d.population.toLocaleString('de-CH')}
                                </text>
                              )}
                            </g>
                          );
                        })}

                        {/* X labels */}
                        {years.map((yr, idx) => {
                          const x = getCoordX(idx);
                          return (
                            <text
                              key={yr}
                              x={x}
                              y={pad.top + plotH + 20}
                              textAnchor="middle"
                              onClick={() => onSelectYear(yr)}
                              className={`text-[11px] font-mono cursor-pointer ${
                                yr === currentYear
                                  ? 'fill-[#0F172A] font-bold underline'
                                  : 'fill-[#64748B]'
                              }`}
                            >
                              {yr}
                            </text>
                          );
                        })}
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* TAB C: NATURAL BALANCE (BIRTHS VS DEATHS) */}
        {activeTab === 'naturalBalance' && (
          <div>
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 px-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-[#16A34A] rounded-xs" />
                  <strong className="text-[#0F172A]">Nacimientos Vivos Anuales</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-[#334155] rounded-xs" />
                  <strong className="text-[#0F172A]">Defunciones Anuales</strong>
                </span>
              </div>
              <span>Haga clic en un año para inspeccionar</span>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[620px]">
                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto select-none">
                  {(() => {
                    const allVals = seriesData.flatMap((d) => [d.birthsCount, d.deathsCount]);
                    const maxVal = Math.max(...allVals) * 1.15;
                    const getBarY = (v: number) => pad.top + plotH - (v / maxVal) * plotH;
                    const barGroupW = (plotW / years.length) * 0.75;
                    const barW = barGroupW / 2 - 1.5;

                    return (
                      <g>
                        {/* Grid */}
                        {[0, 0.5, 1].map((r) => {
                          const y = pad.top + plotH * r;
                          const val = maxVal * (1 - r);
                          return (
                            <g key={r}>
                              <line
                                x1={pad.left}
                                y1={y}
                                x2={chartW - pad.right}
                                y2={y}
                                stroke="#E2E8F0"
                                strokeDasharray="2,2"
                              />
                              <text
                                x={pad.left - 6}
                                y={y + 3.5}
                                textAnchor="end"
                                className="text-[10px] fill-[#64748B] font-mono tabular-nums"
                              >
                                {Math.round(val).toLocaleString('de-CH')}
                              </text>
                            </g>
                          );
                        })}

                        {/* Bars for each year */}
                        {seriesData.map((d, i) => {
                          const centerX = getCoordX(i);
                          const isCurrent = d.year === currentYear;
                          const yBirth = getBarY(d.birthsCount);
                          const yDeath = getBarY(d.deathsCount);
                          const hBirth = pad.top + plotH - yBirth;
                          const hDeath = pad.top + plotH - yDeath;

                          return (
                            <g
                              key={d.year}
                              onClick={() => onSelectYear(d.year)}
                              className="cursor-pointer"
                            >
                              {/* Background highlight if current */}
                              {isCurrent && (
                                <rect
                                  x={centerX - barGroupW / 2 - 4}
                                  y={pad.top}
                                  width={barGroupW + 8}
                                  height={plotH}
                                  fill="#D93856"
                                  fillOpacity="0.08"
                                  rx={3}
                                />
                              )}

                              {/* Births bar (Green) */}
                              <rect
                                x={centerX - barW - 1}
                                y={yBirth}
                                width={barW}
                                height={Math.max(1, hBirth)}
                                fill={isCurrent ? '#16A34A' : '#4ADE80'}
                                rx={1.5}
                              />

                              {/* Deaths bar (Slate) */}
                              <rect
                                x={centerX + 1}
                                y={yDeath}
                                width={barW}
                                height={Math.max(1, hDeath)}
                                fill={isCurrent ? '#0F172A' : '#64748B'}
                                rx={1.5}
                              />
                            </g>
                          );
                        })}

                        {/* X labels */}
                        {years.map((yr, idx) => {
                          const x = getCoordX(idx);
                          return (
                            <text
                              key={yr}
                              x={x}
                              y={pad.top + plotH + 20}
                              textAnchor="middle"
                              onClick={() => onSelectYear(yr)}
                              className={`text-[11px] font-mono cursor-pointer ${
                                yr === currentYear
                                  ? 'fill-[#0F172A] font-bold underline'
                                  : 'fill-[#64748B]'
                              }`}
                            >
                              {yr}
                            </text>
                          );
                        })}
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* TAB D: REGIONAL DEMOGRAPHIC STRATEGIC MATRIX (SCATTER) */}
        {activeTab === 'regionalMatrix' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#64748B] mb-3 px-1">
              <div>
                <span className="font-semibold text-[#0F172A]">
                  Posicionamiento de las 7 Grandes Regiones en Fecundidad vs Mortalidad ({currentYear})
                </span>
                <p className="text-[11px] text-[#64748B]">
                  Eje X: Tasa de Fecundidad (hijos/mujer) · Eje Y: Tasa de Mortalidad (‰) · Tamaño de burbuja: Población.
                </p>
              </div>
              <span className="text-[11px] text-[#D93856] font-semibold">
                Líneas de corte = Promedios nacionales suizos
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[620px]">
                <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} className="w-full h-auto select-none">
                  {(() => {
                    // X axis: Fertility (1.10 to 1.60)
                    const minX = 1.15;
                    const maxX = 1.55;
                    const getX = (f: number) => pad.left + ((f - minX) / (maxX - minX)) * plotW;

                    // Y axis: Mortality (6.5 to 10.5)
                    const minY = 6.5;
                    const maxY = 10.5;
                    const getY = (m: number) => pad.top + plotH - ((m - minY) / (maxY - minY)) * plotH;

                    const chX = getX(macro.avgFertilityRate);
                    const chY = getY(macro.avgMortalityRate);

                    return (
                      <g>
                        {/* Quadrant dividing lines (Swiss national reference) */}
                        <line
                          x1={chX}
                          y1={pad.top}
                          x2={chX}
                          y2={pad.top + plotH}
                          stroke="#CBD5E1"
                          strokeWidth="1.5"
                          strokeDasharray="3,3"
                        />
                        <line
                          x1={pad.left}
                          y1={chY}
                          x2={chartW - pad.right}
                          y2={chY}
                          stroke="#CBD5E1"
                          strokeWidth="1.5"
                          strokeDasharray="3,3"
                        />

                        {/* Quadrant labels */}
                        <text
                          x={pad.left + 8}
                          y={pad.top + 14}
                          className="text-[9px] fill-[#94A3B8] font-medium"
                        >
                          Baja Fecundidad · Mayor Envejecimiento / Mortalidad
                        </text>
                        <text
                          x={chartW - pad.right - 8}
                          y={pad.top + 14}
                          textAnchor="end"
                          className="text-[9px] fill-[#94A3B8] font-medium"
                        >
                          Mayor Fecundidad · Mayor Mortalidad
                        </text>
                        <text
                          x={chartW - pad.right - 8}
                          y={pad.top + plotH - 8}
                          textAnchor="end"
                          className="text-[9px] fill-[#16A34A] font-semibold"
                        >
                          Dinamismo Juvenil (Alta Fecundidad · Baja Mortalidad)
                        </text>

                        {/* Grid axes labels */}
                        <text
                          x={pad.left - 6}
                          y={pad.top + plotH + 16}
                          textAnchor="end"
                          className="text-[10px] fill-[#64748B] font-mono"
                        >
                          Fecundidad: 1.15
                        </text>
                        <text
                          x={chartW - pad.right}
                          y={pad.top + plotH + 16}
                          textAnchor="end"
                          className="text-[10px] fill-[#64748B] font-mono"
                        >
                          1.55 hijos/m →
                        </text>

                        {/* Region bubbles */}
                        {regionalSummary.map((reg) => {
                          const cx = getX(reg.fertilityRate);
                          const cy = getY(reg.mortalityRate);
                          const r = Math.max(10, Math.min(26, Math.sqrt(reg.population / 15000)));
                          const isSelected = selectedRegionId === reg.id;

                          return (
                            <g
                              key={reg.id}
                              onClick={() => onSelectRegion && onSelectRegion(reg.id as any)}
                              className="cursor-pointer group"
                            >
                              <circle
                                cx={cx}
                                cy={cy}
                                r={r}
                                fill={reg.color}
                                fillOpacity={isSelected ? 0.9 : 0.65}
                                stroke={isSelected ? '#0F172A' : '#FFFFFF'}
                                strokeWidth={isSelected ? 2.5 : 1.5}
                                className="transition-all hover:scale-110"
                              />
                              <text
                                x={cx}
                                y={cy - r - 4}
                                textAnchor="middle"
                                className="text-[10.5px] font-bold fill-[#0F172A]"
                              >
                                {reg.name.split(' ')[0]}
                              </text>
                              <text
                                x={cx}
                                y={cy + 3.5}
                                textAnchor="middle"
                                className="text-[9px] font-mono font-bold fill-white"
                              >
                                {reg.fertilityRate} / {reg.mortalityRate}‰
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Complete Regional Demographic Benchmark Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#334155]">
              Matriz Comparativa de las 7 Grandes Regiones ({currentYear})
            </span>
          </div>
          <span className="text-xs text-[#64748B]">
            Haga clic en una región para filtrar todo el dashboard
          </span>
        </div>

        <div className="overflow-x-auto border border-[#E2E8F0] rounded-md shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#515F74] font-semibold">
                <th className="py-2.5 px-3">Gran Región</th>
                <th className="py-2.5 px-3 text-right">Población Censada</th>
                <th className="py-2.5 px-3 text-right">Tasa de Fecundidad</th>
                <th className="py-2.5 px-3 text-right">Tasa de Mortalidad</th>
                <th className="py-2.5 px-3 text-right">Saldo Vegetativo</th>
                <th className="py-2.5 px-3 text-right">Crecimiento (2012–{currentYear})</th>
                <th className="py-2.5 px-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {regionalSummary.map((reg) => {
                const isSelected = selectedRegionId === reg.id;
                return (
                  <tr
                    key={reg.id}
                    onClick={() => onSelectRegion && onSelectRegion(isSelected ? 'all' : (reg.id as any))}
                    className={`hover:bg-[#F8FAFC] cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#FCE8EC]/50 font-medium' : ''
                    }`}
                  >
                    {/* Region name & badge */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: reg.color }}
                        />
                        <span className="font-bold text-[#0F172A]">{reg.name}</span>
                        <span className="text-[11px] text-[#94A3B8] hidden sm:inline">
                          ({reg.cantonCodes.join(', ')})
                        </span>
                      </div>
                    </td>

                    {/* Population */}
                    <td className="py-2.5 px-3 text-right font-semibold text-[#0F172A] tabular-nums">
                      {reg.population.toLocaleString('de-CH')}
                    </td>

                    {/* Fertility Rate */}
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-bold text-[#0F172A]">{reg.fertilityRate.toFixed(2)}</span>
                        <span
                          className={`text-[10px] px-1 rounded font-semibold ${
                            reg.fertilityRate >= macro.avgFertilityRate
                              ? 'bg-[#F0FDF4] text-[#16A34A]'
                              : 'bg-[#FEF2F2] text-[#DC2626]'
                          }`}
                        >
                          {reg.fertilityRate >= macro.avgFertilityRate ? '+' : ''}
                          {(reg.fertilityRate - macro.avgFertilityRate).toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* Mortality Rate */}
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-bold text-[#0F172A]">{reg.mortalityRate.toFixed(1)}‰</span>
                        <span className="text-[10px] text-[#64748B]">
                          ({reg.deathsCount.toLocaleString('de-CH')} def.)
                        </span>
                      </div>
                    </td>

                    {/* Natural Balance */}
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      <span
                        className={`font-semibold ${
                          reg.naturalBalance >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                        }`}
                      >
                        {reg.naturalBalance > 0 ? '+' : ''}
                        {reg.naturalBalance.toLocaleString('de-CH')}
                      </span>
                    </td>

                    {/* Growth since 2012 */}
                    <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-[#0F172A]">
                      +{reg.growthSince2012}%
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRegion && onSelectRegion(isSelected ? 'all' : (reg.id as any));
                        }}
                        className="text-xs text-[#D93856] hover:underline font-semibold"
                      >
                        {isSelected ? 'Ver Todos' : 'Filtrar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
