import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  ArrowLeftRight,
  TrendingUp,
  Building2,
  Factory,
  Briefcase,
  Download,
  Check,
  ChevronDown,
  Layers,
  Award,
  BarChart3,
  Scale,
  Sparkles,
} from 'lucide-react';
import { CantonCode, MetricType, RegionId } from '../types/dashboard';
import { CANTONS_DATA, GREAT_REGIONS, MACRO_SWISS_YEARS } from '../data/swissEconomicData';
import {
  COMPARISON_PRESETS,
  ComparisonEntityProfile,
  ComparisonEntityType,
  getEntityProfile,
} from '../data/comparisonUtils';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
  initialTypeA?: ComparisonEntityType;
  initialIdA?: string;
  initialTypeB?: ComparisonEntityType;
  idB?: string;
  onYearSelect?: (year: number) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  currentYear: externalYear,
  initialTypeA = 'canton',
  initialIdA = 'ZH',
  initialTypeB = 'canton',
  idB: propIdB = 'BS',
  onYearSelect,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(externalYear || 2024);
  const [typeA, setTypeA] = useState<ComparisonEntityType>(initialTypeA);
  const [idA, setIdA] = useState<string>(initialIdA);
  const [typeB, setTypeB] = useState<ComparisonEntityType>(initialTypeB);
  const [idB, setIdB] = useState<string>(propIdB);

  // Active view tab inside modal
  const [activeTab, setActiveTab] = useState<'kpis' | 'evolution' | 'sectors'>('kpis');
  // Metric for historical chart
  const [chartMetric, setChartMetric] = useState<
    | 'productivityPerHour'
    | 'pibMillions'
    | 'pibPerCapita'
    | 'fteEmployment'
    | 'fertilityRate'
    | 'mortalityRate'
    | 'population'
  >('productivityPerHour');

  // Keep internal year in sync with external year when modal opens
  useEffect(() => {
    if (externalYear) {
      setSelectedYear(externalYear);
    }
  }, [externalYear, isOpen]);

  // Sync initial entities if provided when opening
  useEffect(() => {
    if (initialIdA) {
      setTypeA(initialTypeA);
      setIdA(initialIdA);
    }
    if (propIdB) {
      setTypeB(initialTypeB);
      setIdB(propIdB);
    }
  }, [initialIdA, initialTypeA, propIdB, initialTypeB, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Profiles
  const profileA = useMemo(() => getEntityProfile(typeA, idA), [typeA, idA]);
  const profileB = useMemo(() => getEntityProfile(typeB, idB), [typeB, idB]);
  const macroYear = MACRO_SWISS_YEARS[selectedYear] || MACRO_SWISS_YEARS[2024];

  // Year data
  const dataA = profileA?.history[selectedYear];
  const dataB = profileB?.history[selectedYear];

  // Swap entities
  const handleSwap = () => {
    const tempType = typeA;
    const tempId = idA;
    setTypeA(typeB);
    setIdA(idB);
    setTypeB(tempType);
    setIdB(tempId);
  };

  // Change year handler
  const handleYearChange = (yr: number) => {
    setSelectedYear(yr);
    if (onYearSelect) {
      onYearSelect(yr);
    }
  };

  // Apply preset
  const handleApplyPreset = (preset: (typeof COMPARISON_PRESETS)[0]) => {
    setTypeA(preset.typeA);
    setIdA(preset.idA);
    setTypeB(preset.typeB);
    setIdB(preset.idB);
  };

  // Export comparison data to CSV
  const handleExportComparison = () => {
    if (!profileA || !profileB) return;

    const headers = [
      'Anio',
      `Indicador`,
      `${profileA.name} (${profileA.code})`,
      `${profileB.name} (${profileB.code})`,
      'Diferencia_Absoluta',
      'Diferencia_Pct',
      'Media_Suiza',
    ];

    const rows: string[] = [headers.join(';')];
    const years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

    years.forEach((yr) => {
      const a = profileA.history[yr];
      const b = profileB.history[yr];
      const ch = MACRO_SWISS_YEARS[yr];
      if (!a || !b) return;

      const diffProd = a.productivityPerHour - b.productivityPerHour;
      const diffProdPct = b.productivityPerHour ? ((diffProd / b.productivityPerHour) * 100).toFixed(1) : '0';
      rows.push(
        [
          yr,
          'Productividad Laboral (CHF/h)',
          a.productivityPerHour,
          b.productivityPerHour,
          diffProd.toFixed(1),
          `${diffProdPct}%`,
          ch?.avgProductivityPerHour || '',
        ].join(';')
      );

      const diffPib = a.pibMillions - b.pibMillions;
      const diffPibPct = b.pibMillions ? ((diffPib / b.pibMillions) * 100).toFixed(1) : '0';
      rows.push(
        [
          yr,
          'PIB Nominal (M CHF)',
          a.pibMillions,
          b.pibMillions,
          diffPib,
          `${diffPibPct}%`,
          ch?.pibBillions ? ch.pibBillions * 1000 : '',
        ].join(';')
      );

      const diffCap = a.pibPerCapita - b.pibPerCapita;
      const diffCapPct = b.pibPerCapita ? ((diffCap / b.pibPerCapita) * 100).toFixed(1) : '0';
      rows.push(
        [
          yr,
          'PIB per Cápita (CHF)',
          a.pibPerCapita,
          b.pibPerCapita,
          diffCap,
          `${diffCapPct}%`,
          '',
        ].join(';')
      );
    });

    const csvContent = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `comparativa_${profileA.code}_vs_${profileB.code}_2012_2024.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  // Chart data setup for 2012-2024
  const chartYears = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const chartSeriesA = chartYears.map((y) => profileA?.history[y]?.[chartMetric] || 0);
  const chartSeriesB = chartYears.map((y) => profileB?.history[y]?.[chartMetric] || 0);

  // Swiss benchmark for chart
  const chartSeriesCH = chartYears.map((y) => {
    if (chartMetric === 'productivityPerHour') {
      return MACRO_SWISS_YEARS[y]?.avgProductivityPerHour || 0;
    }
    if (chartMetric === 'pibMillions') {
      return (MACRO_SWISS_YEARS[y]?.pibBillions || 0) * 1000 / 26; // Average per canton
    }
    if (chartMetric === 'pibPerCapita') {
      const pibB = MACRO_SWISS_YEARS[y]?.pibBillions || 700;
      return Math.round((pibB * 1000000000) / 8800000);
    }
    if (chartMetric === 'fteEmployment') {
      return (MACRO_SWISS_YEARS[y]?.totalFteEmploymentMillions || 4.2) * 1000 / 26;
    }
    if (chartMetric === 'fertilityRate') {
      return MACRO_SWISS_YEARS[y]?.avgFertilityRate || 1.35;
    }
    if (chartMetric === 'mortalityRate') {
      return MACRO_SWISS_YEARS[y]?.avgMortalityRate || 8.0;
    }
    if (chartMetric === 'population') {
      return ((MACRO_SWISS_YEARS[y]?.totalPopulationMillions || 8.8) * 1000000) / 26;
    }
    return 0;
  });

  const allVals = [...chartSeriesA, ...chartSeriesB];
  const minVal = Math.min(...allVals) * 0.92;
  const maxVal = Math.max(...allVals) * 1.08;

  const chartW = 760;
  const chartH = 220;
  const pad = { top: 25, right: 25, bottom: 35, left: 55 };
  const plotW = chartW - pad.left - pad.right;
  const plotH = chartH - pad.top - pad.bottom;

  const getCoordX = (i: number) => pad.left + (i / (chartYears.length - 1)) * plotW;
  const getCoordY = (v: number) => {
    if (maxVal === minVal) return pad.top + plotH / 2;
    return pad.top + plotH - ((v - minVal) / (maxVal - minVal)) * plotH;
  };

  const pathA = chartSeriesA
    .map((v, i) => `${getCoordX(i).toFixed(1)},${getCoordY(v).toFixed(1)}`)
    .join(' L ');
  const pathB = chartSeriesB
    .map((v, i) => `${getCoordX(i).toFixed(1)},${getCoordY(v).toFixed(1)}`)
    .join(' L ');

  // Format metric unit
  const metricUnitLabel =
    ({
      productivityPerHour: 'CHF / hora',
      pibMillions: 'M CHF',
      pibPerCapita: 'CHF / hab.',
      fteEmployment: 'k puestos FTE',
      fertilityRate: 'hijos / mujer',
      mortalityRate: '‰ (por mil hab.)',
      population: 'habitantes',
    } as Record<string, string>)[chartMetric] || '';

  // Executive comparison verdict text
  let verdictSummary = '';
  if (dataA && dataB && profileA && profileB) {
    const prodDelta = dataA.productivityPerHour - dataB.productivityPerHour;
    const prodDeltaPct = dataB.productivityPerHour
      ? ((prodDelta / dataB.productivityPerHour) * 100).toFixed(1)
      : '0';
    const pibDelta = dataA.pibMillions - dataB.pibMillions;
    const pibDeltaPct = dataB.pibMillions
      ? ((pibDelta / dataB.pibMillions) * 100).toFixed(1)
      : '0';

    if (Math.abs(prodDelta) < 1.0) {
      verdictSummary = `${profileA.name} y ${profileB.name} presentan una productividad horaria virtualmente idéntica (${dataA.productivityPerHour.toFixed(1)} CHF/h), aunque `;
    } else if (prodDelta > 0) {
      verdictSummary = `${profileA.name} lidera en productividad laboral con una ventaja de +${prodDelta.toFixed(1)} CHF/h (+${prodDeltaPct}%), mientras que `;
    } else {
      verdictSummary = `${profileB.name} aventaja a ${profileA.name} en productividad horaria por +${Math.abs(prodDelta).toFixed(1)} CHF/h (+${Math.abs(Number(prodDeltaPct))}%), mientras que `;
    }

    if (pibDelta > 0) {
      verdictSummary += `${profileA.name} ostenta un mayor volumen económico global (${(dataA.pibMillions / 1000).toFixed(1)}k M CHF, +${pibDeltaPct}%).`;
    } else {
      verdictSummary += `${profileB.name} concentra una mayor masa de PIB cantonal (${(dataB.pibMillions / 1000).toFixed(1)}k M CHF, +${Math.abs(Number(pibDeltaPct))}%).`;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#0F172A]/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden text-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="comparison-modal-title"
      >
        {/* 1. Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#FCE8EC] text-[#D93856] flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="comparison-modal-title"
                  className="text-base font-bold text-[#0F172A] tracking-tight"
                >
                  Comparativa Económica Cara a Cara
                </h2>
                <span className="text-xs text-[#94A3B8]">·</span>
                <span className="text-xs font-semibold text-[#D93856]">
                  Suiza Regional (2012–2024)
                </span>
              </div>
              <p className="text-xs text-[#64748B] hidden sm:block">
                Contraste directo de productividad, VAB sectorial y perfiles de competitividad.
              </p>
            </div>
          </div>

          {/* Temporal Scrubber inside Modal */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F1F5F9] border border-[#E2E8F0] rounded-[4px] p-0.5">
              <span className="text-[11px] font-semibold text-[#64748B] px-2 uppercase tracking-wider">
                Año:
              </span>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-[#0F172A] py-1 px-1.5 focus:outline-none cursor-pointer"
              >
                {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012].map(
                  (yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              onClick={handleExportComparison}
              title="Descargar serie temporal comparativa en CSV"
              className="h-8 px-2.5 text-xs font-medium text-[#334155] bg-[#FFFFFF] border border-[#E2E8F0] rounded-[4px] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden md:inline">Exportar CSV</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-[4px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
              title="Cerrar comparativa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Presets Quick Selector Bar */}
        <div className="px-5 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-[11px] font-semibold uppercase text-[#64748B] tracking-wider whitespace-nowrap shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D93856]" />
            Comparativas Clave:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {COMPARISON_PRESETS.map((preset) => {
              const isActive =
                typeA === preset.typeA &&
                idA === preset.idA &&
                typeB === preset.typeB &&
                idB === preset.idB;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`px-2.5 py-1 text-xs rounded-[4px] transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#D93856] text-white font-semibold shadow-sm'
                      : 'bg-[#FFFFFF] text-[#334155] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F1F5F9]'
                  }`}
                  title={preset.description}
                >
                  <span>{preset.title}</span>
                  <span
                    className={`ml-1.5 text-[10px] ${
                      isActive ? 'text-white/80' : 'text-[#64748B]'
                    }`}
                  >
                    ({preset.tag})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Side-by-Side Dual Cockpit Selector */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-gradient-to-b from-[#FFFFFF] to-[#F8FAFC] shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Slot A (Left: Entity A) */}
            <div className="md:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-3.5 shadow-sm relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#D93856] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#D93856]" />
                  Entidad A (Referencia)
                </span>

                {/* Entity Type Selector */}
                <div className="flex items-center p-0.5 bg-[#F1F5F9] rounded text-[11px]">
                  <button
                    onClick={() => {
                      setTypeA('canton');
                      if (idA.length > 2) setIdA('ZH');
                    }}
                    className={`px-2 py-0.5 rounded transition-all font-medium ${
                      typeA === 'canton'
                        ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Cantón
                  </button>
                  <button
                    onClick={() => {
                      setTypeA('region');
                      if (idA.length === 2) setIdA('zurich');
                    }}
                    className={`px-2 py-0.5 rounded transition-all font-medium ${
                      typeA === 'region'
                        ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Región
                  </button>
                </div>
              </div>

              {/* Entity Picker Dropdown */}
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-[4px] bg-[#D93856] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                  {profileA?.code || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <select
                    value={idA}
                    onChange={(e) => setIdA(e.target.value)}
                    className="w-full text-sm font-bold text-[#0F172A] bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2.5 py-1.5 focus:outline-none focus:border-[#D93856] transition-colors cursor-pointer"
                  >
                    {typeA === 'canton' ? (
                      CANTONS_DATA.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} — {c.name} ({GREAT_REGIONS[c.regionId]?.nameEs.split(' ')[0]})
                        </option>
                      ))
                    ) : (
                      Object.values(GREAT_REGIONS).map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nameEs} ({r.cantons.join(', ')})
                        </option>
                      ))
                    )}
                  </select>

                  <div className="flex items-center gap-2 text-xs text-[#64748B] mt-1 truncate">
                    <span>{profileA?.capitalOrCantons}</span>
                    {profileA?.taxRank && (
                      <>
                        <span>·</span>
                        <span className="text-[#0F172A] font-semibold">
                          Fiscal #{profileA.taxRank}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Hero Metric */}
              <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Productividad ({selectedYear}):</span>
                <span className="font-bold text-[#0F172A] text-sm tabular-nums">
                  {dataA?.productivityPerHour.toFixed(1)} CHF/h
                </span>
              </div>
            </div>

            {/* Center Swap & VS Column */}
            <div className="md:col-span-2 flex flex-row md:flex-col items-center justify-center gap-2">
              <button
                onClick={handleSwap}
                title="Intercambiar Entidad A y Entidad B"
                className="px-3 py-1.5 sm:py-2 bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#D93856] hover:text-[#D93856] rounded-md text-xs font-semibold text-[#334155] shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Intercambiar</span>
              </button>
              <div className="w-7 h-7 rounded-full bg-[#E2E8F0] text-[#64748B] font-bold text-xs flex items-center justify-center">
                VS
              </div>
            </div>

            {/* Slot B (Right: Entity B) */}
            <div className="md:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-3.5 shadow-sm relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  Entidad B (Comparación)
                </span>

                {/* Entity Type Selector */}
                <div className="flex items-center p-0.5 bg-[#F1F5F9] rounded text-[11px]">
                  <button
                    onClick={() => {
                      setTypeB('canton');
                      if (idB.length > 2) setIdB('BS');
                    }}
                    className={`px-2 py-0.5 rounded transition-all font-medium ${
                      typeB === 'canton'
                        ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Cantón
                  </button>
                  <button
                    onClick={() => {
                      setTypeB('region');
                      if (idB.length === 2) setIdB('lemanique');
                    }}
                    className={`px-2 py-0.5 rounded transition-all font-medium ${
                      typeB === 'region'
                        ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Región
                  </button>
                </div>
              </div>

              {/* Entity Picker Dropdown */}
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-[4px] bg-[#2563EB] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                  {profileB?.code || 'B'}
                </div>
                <div className="flex-1 min-w-0">
                  <select
                    value={idB}
                    onChange={(e) => setIdB(e.target.value)}
                    className="w-full text-sm font-bold text-[#0F172A] bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2.5 py-1.5 focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer"
                  >
                    {typeB === 'canton' ? (
                      CANTONS_DATA.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} — {c.name} ({GREAT_REGIONS[c.regionId]?.nameEs.split(' ')[0]})
                        </option>
                      ))
                    ) : (
                      Object.values(GREAT_REGIONS).map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nameEs} ({r.cantons.join(', ')})
                        </option>
                      ))
                    )}
                  </select>

                  <div className="flex items-center gap-2 text-xs text-[#64748B] mt-1 truncate">
                    <span>{profileB?.capitalOrCantons}</span>
                    {profileB?.taxRank && (
                      <>
                        <span>·</span>
                        <span className="text-[#0F172A] font-semibold">
                          Fiscal #{profileB.taxRank}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Hero Metric */}
              <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Productividad ({selectedYear}):</span>
                <span className="font-bold text-[#0F172A] text-sm tabular-nums">
                  {dataB?.productivityPerHour.toFixed(1)} CHF/h
                </span>
              </div>
            </div>
          </div>

          {/* Verdict Banner */}
          {verdictSummary && (
            <div className="mt-3 p-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-md text-xs text-[#334155] leading-relaxed flex items-start gap-2 shadow-xs">
              <Award className="w-4 h-4 text-[#D93856] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0F172A] mr-1">Veredicto Ejecutivo:</span>
                <span>{verdictSummary}</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Navigation Sub-Tabs */}
        <div className="px-5 border-b border-[#E2E8F0] bg-[#FFFFFF] flex items-center gap-1 sm:gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'kpis'
                ? 'border-[#D93856] text-[#D93856]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Indicadores Macroeconómicos ({selectedYear})</span>
          </button>

          <button
            onClick={() => setActiveTab('evolution')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'evolution'
                ? 'border-[#D93856] text-[#D93856]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Evolución Histórica (2012–2024)</span>
          </button>

          <button
            onClick={() => setActiveTab('sectors')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sectors'
                ? 'border-[#D93856] text-[#D93856]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Estructura Sectorial y Clústeres</span>
          </button>
        </div>

        {/* 5. Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: KPIs MATRIX */}
          {activeTab === 'kpis' && dataA && dataB && (
            <div className="space-y-4">
              <div className="overflow-x-auto border border-[#E2E8F0] rounded-md shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#515F74] font-semibold">
                      <th className="py-2.5 px-4 w-[28%]">Indicador Macroeconómico</th>
                      <th className="py-2.5 px-4 w-[22%] text-right text-[#D93856]">
                        {profileA?.name} ({profileA?.code})
                      </th>
                      <th className="py-2.5 px-4 w-[22%] text-right text-[#2563EB]">
                        {profileB?.name} ({profileB?.code})
                      </th>
                      <th className="py-2.5 px-4 w-[14%] text-right">Diferencia (A vs B)</th>
                      <th className="py-2.5 px-4 w-[14%] text-center">Balance Proporcional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {/* Row: Productividad Laboral */}
                    {(() => {
                      const vA = dataA.productivityPerHour;
                      const vB = dataB.productivityPerHour;
                      const delta = vA - vB;
                      const deltaPct = vB ? (delta / vB) * 100 : 0;
                      const total = vA + vB || 1;
                      const pctA = Math.round((vA / total) * 100);

                      return (
                        <tr className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#0F172A]">
                            Productividad Laboral
                            <span className="block text-[10px] text-[#64748B] font-normal">
                              VAB generado por hora de trabajo (CHF)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vA.toFixed(1)}
                            </span>{' '}
                            <span className="text-[11px] text-[#64748B]">CHF/h</span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vB.toFixed(1)}
                            </span>{' '}
                            <span className="text-[11px] text-[#64748B]">CHF/h</span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`font-semibold text-xs px-1.5 py-0.5 rounded ${
                                delta > 0
                                  ? 'bg-[#FCE8EC] text-[#D93856]'
                                  : delta < 0
                                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                                  : 'text-[#64748B]'
                              }`}
                            >
                              {delta > 0 ? '+' : ''}
                              {delta.toFixed(1)} ({delta > 0 ? '+' : ''}
                              {deltaPct.toFixed(1)}%)
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-[#E2E8F0] rounded-full h-2 flex overflow-hidden">
                              <div
                                style={{ width: `${pctA}%` }}
                                className="bg-[#D93856] h-full"
                                title={`${profileA?.code}: ${pctA}%`}
                              />
                              <div
                                style={{ width: `${100 - pctA}%` }}
                                className="bg-[#2563EB] h-full"
                                title={`${profileB?.code}: ${100 - pctA}%`}
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-[#94A3B8] mt-0.5 font-mono">
                              <span>{pctA}%</span>
                              <span>{100 - pctA}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })()}

                    {/* Row: PIB Nominal */}
                    {(() => {
                      const vA = dataA.pibMillions;
                      const vB = dataB.pibMillions;
                      const delta = vA - vB;
                      const deltaPct = vB ? (delta / vB) * 100 : 0;
                      const total = vA + vB || 1;
                      const pctA = Math.round((vA / total) * 100);

                      return (
                        <tr className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#0F172A]">
                            PIB Nominal
                            <span className="block text-[10px] text-[#64748B] font-normal">
                              Volumen económico a precios de mercado (M CHF)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vA.toLocaleString('de-CH')}
                            </span>{' '}
                            <span className="text-[11px] text-[#64748B]">M CHF</span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vB.toLocaleString('de-CH')}
                            </span>{' '}
                            <span className="text-[11px] text-[#64748B]">M CHF</span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`font-semibold text-xs px-1.5 py-0.5 rounded ${
                                delta > 0
                                  ? 'bg-[#FCE8EC] text-[#D93856]'
                                  : delta < 0
                                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                                  : 'text-[#64748B]'
                              }`}
                            >
                              {delta > 0 ? '+' : ''}
                              {delta.toLocaleString('de-CH')} ({delta > 0 ? '+' : ''}
                              {deltaPct.toFixed(1)}%)
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-[#E2E8F0] rounded-full h-2 flex overflow-hidden">
                              <div
                                style={{ width: `${pctA}%` }}
                                className="bg-[#D93856] h-full"
                              />
                              <div
                                style={{ width: `${100 - pctA}%` }}
                                className="bg-[#2563EB] h-full"
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-[#94A3B8] mt-0.5 font-mono">
                              <span>{pctA}%</span>
                              <span>{100 - pctA}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })()}

                    {/* Row: PIB per Cápita */}
                    {(() => {
                      const vA = dataA.pibPerCapita;
                      const vB = dataB.pibPerCapita;
                      const delta = vA - vB;
                      const deltaPct = vB ? (delta / vB) * 100 : 0;
                      const total = vA + vB || 1;
                      const pctA = Math.round((vA / total) * 100);

                      return (
                        <tr className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#0F172A]">
                            PIB per Cápita
                            <span className="block text-[10px] text-[#64748B] font-normal">
                              Renta y producción por residente (CHF / hab.)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {Math.round(vA).toLocaleString('de-CH')}
                            </span>{' '}
                            <span className="text-[11px] text-[#64748B]">CHF</span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {Math.round(vB).toLocaleString('de-CH')}
                            </span>{' '}
                            <span className="text-[11px] text-[#64748B]">CHF</span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`font-semibold text-xs px-1.5 py-0.5 rounded ${
                                delta > 0
                                  ? 'bg-[#FCE8EC] text-[#D93856]'
                                  : delta < 0
                                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                                  : 'text-[#64748B]'
                              }`}
                            >
                              {delta > 0 ? '+' : ''}
                              {Math.round(delta).toLocaleString('de-CH')} ({delta > 0 ? '+' : ''}
                              {deltaPct.toFixed(1)}%)
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-[#E2E8F0] rounded-full h-2 flex overflow-hidden">
                              <div
                                style={{ width: `${pctA}%` }}
                                className="bg-[#D93856] h-full"
                              />
                              <div
                                style={{ width: `${100 - pctA}%` }}
                                className="bg-[#2563EB] h-full"
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-[#94A3B8] mt-0.5 font-mono">
                              <span>{pctA}%</span>
                              <span>{100 - pctA}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })()}

                    {/* Row: Empleo FTE */}
                    {(() => {
                      const vA = dataA.fteEmployment;
                      const vB = dataB.fteEmployment;
                      const delta = vA - vB;
                      const deltaPct = vB ? (delta / vB) * 100 : 0;
                      const total = vA + vB || 1;
                      const pctA = Math.round((vA / total) * 100);

                      return (
                        <tr className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#0F172A]">
                            Población Activa y Empleo FTE
                            <span className="block text-[10px] text-[#64748B] font-normal">
                              Puestos a tiempo completo (miles de empleos)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vA.toFixed(1)}k
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vB.toFixed(1)}k
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`font-semibold text-xs px-1.5 py-0.5 rounded ${
                                delta > 0
                                  ? 'bg-[#FCE8EC] text-[#D93856]'
                                  : delta < 0
                                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                                  : 'text-[#64748B]'
                              }`}
                            >
                              {delta > 0 ? '+' : ''}
                              {delta.toFixed(1)}k ({delta > 0 ? '+' : ''}
                              {deltaPct.toFixed(1)}%)
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-[#E2E8F0] rounded-full h-2 flex overflow-hidden">
                              <div
                                style={{ width: `${pctA}%` }}
                                className="bg-[#D93856] h-full"
                              />
                              <div
                                style={{ width: `${100 - pctA}%` }}
                                className="bg-[#2563EB] h-full"
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-[#94A3B8] mt-0.5 font-mono">
                              <span>{pctA}%</span>
                              <span>{100 - pctA}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })()}

                    {/* Row: Población Residente */}
                    {(() => {
                      const vA = dataA.population || 0;
                      const vB = dataB.population || 0;
                      const delta = vA - vB;
                      const deltaPct = vB ? (delta / vB) * 100 : 0;
                      const total = vA + vB || 1;
                      const pctA = Math.round((vA / total) * 100);

                      return (
                        <tr className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#0F172A]">
                            Población Permanente
                            <span className="block text-[10px] text-[#64748B] font-normal">
                              Población residente permanente (habitantes oficiales BFS)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vA.toLocaleString('de-CH')}
                            </span>{' '}
                            <span className="text-[11px] text-[#64748B]">hab.</span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vB.toLocaleString('de-CH')}
                            </span>{' '}
                            <span className="text-[11px] text-[#64748B]">hab.</span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`font-semibold text-xs px-1.5 py-0.5 rounded ${
                                delta > 0
                                  ? 'bg-[#FCE8EC] text-[#D93856]'
                                  : delta < 0
                                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                                  : 'text-[#64748B]'
                              }`}
                            >
                              {delta > 0 ? '+' : ''}
                              {delta.toLocaleString('de-CH')} ({delta > 0 ? '+' : ''}
                              {deltaPct.toFixed(1)}%)
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-[#E2E8F0] rounded-full h-2 flex overflow-hidden">
                              <div
                                style={{ width: `${pctA}%` }}
                                className="bg-[#D93856] h-full"
                              />
                              <div
                                style={{ width: `${100 - pctA}%` }}
                                className="bg-[#2563EB] h-full"
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-[#94A3B8] mt-0.5 font-mono">
                              <span>{pctA}%</span>
                              <span>{100 - pctA}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })()}

                    {/* Row: Tasa de Fecundidad */}
                    {(() => {
                      const vA = dataA.fertilityRate || 0;
                      const vB = dataB.fertilityRate || 0;
                      const delta = vA - vB;
                      const deltaPct = vB ? (delta / vB) * 100 : 0;
                      const total = vA + vB || 1;
                      const pctA = Math.round((vA / total) * 100);

                      return (
                        <tr className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#0F172A]">
                            Tasa de Fecundidad
                            <span className="block text-[10px] text-[#64748B] font-normal">
                              Hijos por mujer (umbral de reemplazo generacional: 2.10)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vA.toFixed(2)}
                            </span>{' '}
                            <span className="text-[11px] text-[#64748B]">hijos/m.</span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vB.toFixed(2)}
                            </span>{' '}
                            <span className="text-[11px] text-[#64748B]">hijos/m.</span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`font-semibold text-xs px-1.5 py-0.5 rounded ${
                                delta > 0
                                  ? 'bg-[#FCE8EC] text-[#D93856]'
                                  : delta < 0
                                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                                  : 'text-[#64748B]'
                              }`}
                            >
                              {delta > 0 ? '+' : ''}
                              {delta.toFixed(2)} ({delta > 0 ? '+' : ''}
                              {deltaPct.toFixed(1)}%)
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-[#E2E8F0] rounded-full h-2 flex overflow-hidden">
                              <div
                                style={{ width: `${pctA}%` }}
                                className="bg-[#D93856] h-full"
                              />
                              <div
                                style={{ width: `${100 - pctA}%` }}
                                className="bg-[#2563EB] h-full"
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-[#94A3B8] mt-0.5 font-mono">
                              <span>{pctA}%</span>
                              <span>{100 - pctA}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })()}

                    {/* Row: Tasa de Mortalidad Bruta */}
                    {(() => {
                      const vA = dataA.mortalityRate || 0;
                      const vB = dataB.mortalityRate || 0;
                      const delta = vA - vB;

                      return (
                        <tr className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#0F172A]">
                            Tasa de Mortalidad Bruta
                            <span className="block text-[10px] text-[#64748B] font-normal">
                              Defunciones por cada 1.000 residentes permanentes (‰)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vA.toFixed(1)}‰
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vB.toFixed(1)}‰
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`font-semibold text-xs px-1.5 py-0.5 rounded ${
                                delta < 0
                                  ? 'bg-[#FCE8EC] text-[#D93856]'
                                  : delta > 0
                                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                                  : 'text-[#64748B]'
                              }`}
                            >
                              {delta > 0 ? '+' : ''}
                              {delta.toFixed(1)}‰
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-[11px] font-semibold text-[#64748B]">
                              {vA < vB
                                ? `Menor mortalidad: ${profileA?.code}`
                                : vB < vA
                                ? `Menor mortalidad: ${profileB?.code}`
                                : 'Igual tasa'}
                            </span>
                          </td>
                        </tr>
                      );
                    })()}

                    {/* Row: Saldo Vegetativo Natural */}
                    {(() => {
                      const vA = dataA.naturalBalance ?? ((dataA.birthsCount || 0) - (dataA.deathsCount || 0));
                      const vB = dataB.naturalBalance ?? ((dataB.birthsCount || 0) - (dataB.deathsCount || 0));
                      const delta = vA - vB;

                      return (
                        <tr className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#0F172A]">
                            Saldo Vegetativo Natural
                            <span className="block text-[10px] text-[#64748B] font-normal">
                              Crecimiento vegetativo anual (Nacimientos menos Defunciones)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`font-bold text-sm ${
                                vA >= 0 ? 'text-[#0F172A]' : 'text-[#D93856]'
                              }`}
                            >
                              {vA > 0 ? '+' : ''}
                              {vA.toLocaleString('de-CH')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`font-bold text-sm ${
                                vB >= 0 ? 'text-[#0F172A]' : 'text-[#2563EB]'
                              }`}
                            >
                              {vB > 0 ? '+' : ''}
                              {vB.toLocaleString('de-CH')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`font-semibold text-xs px-1.5 py-0.5 rounded ${
                                delta > 0
                                  ? 'bg-[#FCE8EC] text-[#D93856]'
                                  : delta < 0
                                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                                  : 'text-[#64748B]'
                              }`}
                            >
                              {delta > 0 ? '+' : ''}
                              {delta.toLocaleString('de-CH')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-[11px] font-semibold text-[#64748B]">
                              {vA > 0 && vB > 0
                                ? 'Ambos con saldo positivo'
                                : vA < 0 && vB < 0
                                ? 'Ambos en déficit vegetativo'
                                : vA >= 0
                                ? `Saldo positivo en ${profileA?.code}`
                                : `Saldo positivo en ${profileB?.code}`}
                            </span>
                          </td>
                        </tr>
                      );
                    })()}

                    {/* Row: Tasa de Desempleo */}
                    {(() => {
                      const vA = dataA.unemploymentRate;
                      const vB = dataB.unemploymentRate;
                      const delta = vA - vB;

                      return (
                        <tr className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#0F172A]">
                            Tasa de Desempleo (SECO)
                            <span className="block text-[10px] text-[#64748B] font-normal">
                              Porcentaje de desempleo registrado (menor es más favorable)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vA.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vB.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`font-semibold text-xs px-1.5 py-0.5 rounded ${
                                delta < 0
                                  ? 'bg-[#FCE8EC] text-[#D93856]' // A is lower (better)
                                  : delta > 0
                                  ? 'bg-[#EFF6FF] text-[#2563EB]' // B is lower (better)
                                  : 'text-[#64748B]'
                              }`}
                            >
                              {delta > 0 ? '+' : ''}
                              {delta.toFixed(1)} pp
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-[11px] font-semibold text-[#64748B]">
                              {vA < vB
                                ? `Lidera ${profileA?.code} (-${(vB - vA).toFixed(1)}%)`
                                : vB < vA
                                ? `Lidera ${profileB?.code} (-${(vA - vB).toFixed(1)}%)`
                                : 'Empate técnico'}
                            </span>
                          </td>
                        </tr>
                      );
                    })()}

                    {/* Row: I+D % del PIB */}
                    {(() => {
                      const vA = dataA.rdIntensityPct;
                      const vB = dataB.rdIntensityPct;
                      const delta = vA - vB;
                      const total = vA + vB || 1;
                      const pctA = Math.round((vA / total) * 100);

                      return (
                        <tr className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#0F172A]">
                            Intensidad en I+D
                            <span className="block text-[10px] text-[#64748B] font-normal">
                              Gasto en Investigación y Desarrollo (% del PIB)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vA.toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span className="font-bold text-sm text-[#0F172A]">
                              {vB.toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`font-semibold text-xs px-1.5 py-0.5 rounded ${
                                delta > 0
                                  ? 'bg-[#FCE8EC] text-[#D93856]'
                                  : delta < 0
                                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                                  : 'text-[#64748B]'
                              }`}
                            >
                              {delta > 0 ? '+' : ''}
                              {delta.toFixed(2)} pp
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-[#E2E8F0] rounded-full h-2 flex overflow-hidden">
                              <div
                                style={{ width: `${pctA}%` }}
                                className="bg-[#D93856] h-full"
                              />
                              <div
                                style={{ width: `${100 - pctA}%` }}
                                className="bg-[#2563EB] h-full"
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-[#94A3B8] mt-0.5 font-mono">
                              <span>{pctA}%</span>
                              <span>{100 - pctA}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })()}

                    {/* Row: Ranking Fiscal Cantonal (if applicable) */}
                    {(profileA?.taxRank || profileB?.taxRank) && (
                      <tr className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#0F172A]">
                          Competitividad Fiscal Cantonal
                          <span className="block text-[10px] text-[#64748B] font-normal">
                            Posición fiscal relativa (Índice Credit Suisse / BAK, 1 = más atractivo)
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums">
                          {profileA?.taxRank ? (
                            <span className="font-bold text-sm text-[#D93856]">
                              #{profileA.taxRank} de 26
                            </span>
                          ) : (
                            <span className="text-[#94A3B8] text-xs">N/A (Región)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums">
                          {profileB?.taxRank ? (
                            <span className="font-bold text-sm text-[#2563EB]">
                              #{profileB.taxRank} de 26
                            </span>
                          ) : (
                            <span className="text-[#94A3B8] text-xs">N/A (Región)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums">
                          {profileA?.taxRank && profileB?.taxRank ? (
                            <span className="font-semibold text-xs text-[#334155]">
                              {profileA.taxRank < profileB.taxRank
                                ? `${profileA.code} más competitivo (+${
                                    profileB.taxRank - profileA.taxRank
                                  } pos.)`
                                : profileB.taxRank < profileA.taxRank
                                ? `${profileB.code} más competitivo (+${
                                    profileA.taxRank - profileB.taxRank
                                  } pos.)`
                                : 'Igual posición'}
                            </span>
                          ) : (
                            <span className="text-[#94A3B8] text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-[11px] text-[#64748B]">Baja tributación societaria</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* National Swiss Benchmark Footnote */}
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#64748B] gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
                  <span>
                    <strong>Referencia Nacional Suiza ({selectedYear}):</strong> Productividad:{' '}
                    <strong className="text-[#0F172A]">
                      {macroYear.avgProductivityPerHour.toFixed(1)} CHF/h
                    </strong>{' '}
                    · PIB:{' '}
                    <strong className="text-[#0F172A]">{macroYear.pibBillions} Mrd. CHF</strong> ·
                    Desempleo:{' '}
                    <strong className="text-[#0F172A]">{macroYear.unemploymentRate}%</strong>
                  </span>
                </div>
                <span className="text-[11px] text-[#94A3B8]">
                  Fuentes: OFS (BFS) / SECO / Credit Suisse Tax Index
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: HISTORICAL EVOLUTION CHART (2012-2024) */}
          {activeTab === 'evolution' && (
            <div className="space-y-4">
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 shadow-xs">
                {/* Chart Header & Metric Switcher */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#D93856]" />
                      <span>Trayectoria Comparada Multi-Anual (2012–2024)</span>
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Haga clic en cualquier punto del gráfico para sincronizar el año de análisis.
                    </p>
                  </div>

                  {/* Plotted Metric Toggle */}
                  <div className="flex items-center p-1 bg-[#F1F5F9] rounded text-xs gap-1 flex-wrap">
                    {[
                      { id: 'productivityPerHour', label: 'Productividad (CHF/h)' },
                      { id: 'pibMillions', label: 'PIB (M CHF)' },
                      { id: 'pibPerCapita', label: 'PIB / hab.' },
                      { id: 'fteEmployment', label: 'Empleo FTE' },
                      { id: 'fertilityRate', label: 'Fecundidad' },
                      { id: 'mortalityRate', label: 'Mortalidad' },
                      { id: 'population', label: 'Población' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setChartMetric(m.id as any)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                          chartMetric === m.id
                            ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                            : 'text-[#64748B] hover:text-[#0F172A]'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Comparative Chart */}
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[640px]">
                    <svg
                      viewBox={`0 0 ${chartW} ${chartH}`}
                      className="w-full h-auto select-none"
                    >
                      {/* Gridlines horizontal */}
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                        const y = pad.top + plotH * ratio;
                        const val = maxVal - ratio * (maxVal - minVal);
                        return (
                          <g key={ratio}>
                            <line
                              x1={pad.left}
                              y1={y}
                              x2={chartW - pad.right}
                              y2={y}
                              stroke="#E2E8F0"
                              strokeDasharray="2,2"
                            />
                            <text
                              x={pad.left - 8}
                              y={y + 3.5}
                              textAnchor="end"
                              className="text-[10px] fill-[#94A3B8] font-mono tabular-nums"
                            >
                              {chartMetric === 'pibMillions' || chartMetric === 'pibPerCapita' || chartMetric === 'population'
                                ? Math.round(val).toLocaleString('de-CH')
                                : chartMetric === 'fertilityRate'
                                ? val.toFixed(2)
                                : val.toFixed(1)}
                            </text>
                          </g>
                        );
                      })}

                      {/* Active Year Vertical Line Highlight */}
                      {(() => {
                        const activeIdx = chartYears.indexOf(selectedYear);
                        if (activeIdx >= 0) {
                          const x = getCoordX(activeIdx);
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
                                {selectedYear}
                              </text>
                            </g>
                          );
                        }
                        return null;
                      })()}

                      {/* Swiss Benchmark Line (Dashed) */}
                      {chartMetric === 'productivityPerHour' && (
                        <path
                          d={
                            'M ' +
                            chartSeriesCH
                              .map(
                                (v, i) => `${getCoordX(i).toFixed(1)},${getCoordY(v).toFixed(1)}`
                              )
                              .join(' L ')
                          }
                          fill="none"
                          stroke="#94A3B8"
                          strokeWidth="1.5"
                          strokeDasharray="4,4"
                        />
                      )}

                      {/* Line Entity B (Navy) */}
                      <path
                        d={'M ' + pathB}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Line Entity A (Crimson) */}
                      <path
                        d={'M ' + pathA}
                        fill="none"
                        stroke="#D93856"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data dots Entity A */}
                      {chartSeriesA.map((v, i) => {
                        const yr = chartYears[i];
                        const x = getCoordX(i);
                        const y = getCoordY(v);
                        const isCurrent = yr === selectedYear;

                        return (
                          <g
                            key={`dotA-${yr}`}
                            onClick={() => handleYearChange(yr)}
                            className="cursor-pointer group"
                          >
                            <circle
                              cx={x}
                              cy={y}
                              r={isCurrent ? 6 : 4}
                              fill={isCurrent ? '#D93856' : '#FFFFFF'}
                              stroke="#D93856"
                              strokeWidth={isCurrent ? 2.5 : 2}
                              className="transition-all hover:scale-125"
                            />
                            {/* Value label on current */}
                            {isCurrent && (
                              <text
                                x={x}
                                y={y - 10}
                                textAnchor="middle"
                                className="text-[11px] font-bold fill-[#D93856] font-mono"
                              >
                                {chartMetric === 'pibMillions' || chartMetric === 'pibPerCapita' || chartMetric === 'population'
                                  ? Math.round(v).toLocaleString('de-CH')
                                  : chartMetric === 'fertilityRate'
                                  ? v.toFixed(2)
                                  : v.toFixed(1)}
                              </text>
                            )}
                          </g>
                        );
                      })}

                      {/* Data dots Entity B */}
                      {chartSeriesB.map((v, i) => {
                        const yr = chartYears[i];
                        const x = getCoordX(i);
                        const y = getCoordY(v);
                        const isCurrent = yr === selectedYear;

                        return (
                          <g
                            key={`dotB-${yr}`}
                            onClick={() => handleYearChange(yr)}
                            className="cursor-pointer group"
                          >
                            <circle
                              cx={x}
                              cy={y}
                              r={isCurrent ? 6 : 4}
                              fill={isCurrent ? '#2563EB' : '#FFFFFF'}
                              stroke="#2563EB"
                              strokeWidth={isCurrent ? 2.5 : 2}
                              className="transition-all hover:scale-125"
                            />
                            {/* Value label on current */}
                            {isCurrent && (
                              <text
                                x={x}
                                y={y + 16}
                                textAnchor="middle"
                                className="text-[11px] font-bold fill-[#2563EB] font-mono"
                              >
                                {chartMetric === 'pibMillions' || chartMetric === 'pibPerCapita' || chartMetric === 'population'
                                  ? Math.round(v).toLocaleString('de-CH')
                                  : chartMetric === 'fertilityRate'
                                  ? v.toFixed(2)
                                  : v.toFixed(1)}
                              </text>
                            )}
                          </g>
                        );
                      })}

                      {/* X Axis Year Labels */}
                      {chartYears.map((yr, idx) => {
                        const x = getCoordX(idx);
                        const isCurrent = yr === selectedYear;
                        return (
                          <text
                            key={yr}
                            x={x}
                            y={pad.top + plotH + 18}
                            textAnchor="middle"
                            onClick={() => handleYearChange(yr)}
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

                {/* Chart Legend */}
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-1 bg-[#D93856] rounded-full" />
                      <span className="font-bold text-[#0F172A]">
                        {profileA?.name} ({profileA?.code})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-1 bg-[#2563EB] rounded-full" />
                      <span className="font-bold text-[#0F172A]">
                        {profileB?.name} ({profileB?.code})
                      </span>
                    </div>

                    {chartMetric === 'productivityPerHour' && (
                      <div className="flex items-center gap-1.5 text-[#64748B]">
                        <span className="w-3.5 h-0.5 border-t border-dashed border-[#94A3B8]" />
                        <span>Media Suiza</span>
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] text-[#64748B]">
                    Unidad: <strong>{metricUnitLabel}</strong>
                  </span>
                </div>
              </div>

              {/* Historical Compound Growth (CAGR) Box */}
              {profileA && profileB && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Entity A Historical Stats */}
                  <div className="p-3.5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-md shadow-xs">
                    <span className="text-xs font-bold text-[#D93856] block mb-1">
                      Crecimiento {profileA.name} (2012 vs 2024):
                    </span>
                    {(() => {
                      const d2012 = profileA.history[2012]?.[chartMetric] || 0;
                      const d2024 = profileA.history[2024]?.[chartMetric] || 0;
                      const growth = d2012 ? ((d2024 - d2012) / d2012) * 100 : 0;
                      return (
                        <div className="text-xs text-[#515F74] space-y-1">
                          <div className="flex justify-between">
                            <span>Valor 2012:</span>
                            <strong className="text-[#0F172A] tabular-nums">
                              {d2012.toLocaleString('de-CH')} {metricUnitLabel}
                            </strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor 2024:</span>
                            <strong className="text-[#0F172A] tabular-nums">
                              {d2024.toLocaleString('de-CH')} {metricUnitLabel}
                            </strong>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-[#F1F5F9] font-semibold text-[#0F172A]">
                            <span>Crecimiento Acumulado:</span>
                            <span className="text-[#D93856] tabular-nums">
                              {growth > 0 ? '+' : ''}
                              {growth.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Entity B Historical Stats */}
                  <div className="p-3.5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-md shadow-xs">
                    <span className="text-xs font-bold text-[#2563EB] block mb-1">
                      Crecimiento {profileB.name} (2012 vs 2024):
                    </span>
                    {(() => {
                      const d2012 = profileB.history[2012]?.[chartMetric] || 0;
                      const d2024 = profileB.history[2024]?.[chartMetric] || 0;
                      const growth = d2012 ? ((d2024 - d2012) / d2012) * 100 : 0;
                      return (
                        <div className="text-xs text-[#515F74] space-y-1">
                          <div className="flex justify-between">
                            <span>Valor 2012:</span>
                            <strong className="text-[#0F172A] tabular-nums">
                              {d2012.toLocaleString('de-CH')} {metricUnitLabel}
                            </strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor 2024:</span>
                            <strong className="text-[#0F172A] tabular-nums">
                              {d2024.toLocaleString('de-CH')} {metricUnitLabel}
                            </strong>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-[#F1F5F9] font-semibold text-[#0F172A]">
                            <span>Crecimiento Acumulado:</span>
                            <span className="text-[#2563EB] tabular-nums">
                              {growth > 0 ? '+' : ''}
                              {growth.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SECTORIAL COMPOSITION & CLUSTERS */}
          {activeTab === 'sectors' && dataA && dataB && (
            <div className="space-y-5">
              {/* Macro Sectors Breakdown Comparison */}
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-3">
                  Distribución del Valor Añadido Bruto por Sectores ({selectedYear})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Primario */}
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                    <span className="text-[11px] font-semibold text-[#64748B] block mb-1">
                      Sector Primario (Agricultura/Extracción)
                    </span>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#D93856]">{profileA?.code}:</span>
                        <span className="font-bold tabular-nums text-[#0F172A]">
                          {dataA.sectors.primary}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#2563EB]">{profileB?.code}:</span>
                        <span className="font-bold tabular-nums text-[#0F172A]">
                          {dataB.sectors.primary}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Secundario */}
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                    <span className="text-[11px] font-semibold text-[#64748B] block mb-1">
                      Sector Secundario (Industria/Farma/MEM)
                    </span>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#D93856]">{profileA?.code}:</span>
                        <span className="font-bold tabular-nums text-[#0F172A]">
                          {dataA.sectors.secondary}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#2563EB]">{profileB?.code}:</span>
                        <span className="font-bold tabular-nums text-[#0F172A]">
                          {dataB.sectors.secondary}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Terciario */}
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                    <span className="text-[11px] font-semibold text-[#64748B] block mb-1">
                      Sector Terciario (Servicios/Banca/IT)
                    </span>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#D93856]">{profileA?.code}:</span>
                        <span className="font-bold tabular-nums text-[#0F172A]">
                          {dataA.sectors.tertiary}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#2563EB]">{profileB?.code}:</span>
                        <span className="font-bold tabular-nums text-[#0F172A]">
                          {dataB.sectors.tertiary}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subsector Deep-Dive Bar Comparison */}
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-3">
                  Comparativa de Especialización en Subsectores Estratégicos (% del VAB)
                </h3>

                <div className="space-y-3.5 text-xs">
                  {[
                    {
                      label: 'Farmacéutica, Biotecnología y Química',
                      subKey: 'pharmaChemical',
                    },
                    {
                      label: 'Banca, Finanzas, Seguros y Gestión Patrimonial',
                      subKey: 'financeInsurance',
                    },
                    {
                      label: 'Maquinaria MEM, Relojería y Microtecnología',
                      subKey: 'precisionMEM',
                    },
                    {
                      label: 'Servicios Tecnológicos, Software y Consultoría',
                      subKey: 'techServices',
                    },
                    {
                      label: 'Sector Público, Sanidad y Servicios Generales',
                      subKey: 'publicOther',
                    },
                  ].map((sub) => {
                    const key = sub.subKey as keyof typeof dataA.sectors.subsectors;
                    const valA = dataA.sectors.subsectors[key];
                    const valB = dataB.sectors.subsectors[key];
                    const maxSub = Math.max(valA, valB, 1);

                    return (
                      <div key={sub.subKey} className="space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-semibold text-[#334155]">{sub.label}</span>
                          <span className="text-[#64748B] tabular-nums">
                            {profileA?.code}: <strong>{valA}%</strong> vs {profileB?.code}:{' '}
                            <strong>{valB}%</strong>
                          </span>
                        </div>

                        {/* Dual Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-7 text-right font-bold text-[#D93856] text-[10px]">
                              {profileA?.code}
                            </span>
                            <div className="flex-1 bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                              <div
                                style={{ width: `${Math.min(100, (valA / 60) * 100)}%` }}
                                className="bg-[#D93856] h-full rounded-full transition-all duration-300"
                              />
                            </div>
                            <span className="w-10 text-right tabular-nums text-[10px] font-bold text-[#0F172A]">
                              {valA}%
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="w-7 text-right font-bold text-[#2563EB] text-[10px]">
                              {profileB?.code}
                            </span>
                            <div className="flex-1 bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                              <div
                                style={{ width: `${Math.min(100, (valB / 60) * 100)}%` }}
                                className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
                              />
                            </div>
                            <span className="w-10 text-right tabular-nums text-[10px] font-bold text-[#0F172A]">
                              {valB}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Qualitative Ecosystem & Companies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Entity A Qualitative Profile */}
                <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-md shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded bg-[#D93856] text-white flex items-center justify-center font-bold text-xs">
                      {profileA?.code}
                    </span>
                    <h4 className="font-bold text-xs text-[#0F172A]">{profileA?.name}</h4>
                  </div>
                  <p className="text-xs text-[#515F74] leading-relaxed mb-3">
                    {profileA?.specialization}
                  </p>
                  <div>
                    <span className="text-[11px] font-semibold text-[#64748B] block mb-1">
                      Empresas e Instituciones Insignia:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profileA?.topCompanies.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 text-[11px] font-medium text-[#334155] bg-[#F1F5F9] border border-[#E2E8F0] rounded"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Entity B Qualitative Profile */}
                <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-md shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                      {profileB?.code}
                    </span>
                    <h4 className="font-bold text-xs text-[#0F172A]">{profileB?.name}</h4>
                  </div>
                  <p className="text-xs text-[#515F74] leading-relaxed mb-3">
                    {profileB?.specialization}
                  </p>
                  <div>
                    <span className="text-[11px] font-semibold text-[#64748B] block mb-1">
                      Empresas e Instituciones Insignia:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profileB?.topCompanies.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 text-[11px] font-medium text-[#334155] bg-[#F1F5F9] border border-[#E2E8F0] rounded"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. Modal Footer */}
        <div className="p-3.5 border-t border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-between text-xs text-[#64748B] shrink-0">
          <div className="flex items-center gap-2">
            <span>Series oficiales 2012–2024</span>
            <span>·</span>
            <span>BFS / SECO / Banco Nacional Suizo</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportComparison}
              className="px-3 py-1.5 text-xs font-semibold text-[#334155] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-[4px] transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar CSV</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#D93856] hover:bg-[#E05370] rounded-[4px] transition-colors shadow-xs"
            >
              Cerrar Comparativa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
