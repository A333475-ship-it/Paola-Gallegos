import React, { useState, useCallback } from 'react';
import { TopNav } from './components/TopNav';
import { TimelineScrubber } from './components/TimelineScrubber';
import { MacroKpiStrip } from './components/MacroKpiStrip';
import { SwissChoroplethMap } from './components/SwissChoroplethMap';
import { ProductivityEvolutionChart } from './components/ProductivityEvolutionChart';
import { SectorialBreakdownChart } from './components/SectorialBreakdownChart';
import { RegionalScatterPlot } from './components/RegionalScatterPlot';
import { CantonalDataTable } from './components/CantonalDataTable';
import { CantonInspectorModal } from './components/CantonInspectorModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { ComparisonModal } from './components/ComparisonModal';
import { DemographicDynamicsChart } from './components/DemographicDynamicsChart';
import { CantonProfile, MetricType, RegionId } from './types/dashboard';
import { CANTONS_DATA, GREAT_REGIONS, MACRO_SWISS_YEARS } from './data/swissEconomicData';
import { ComparisonEntityType } from './data/comparisonUtils';
import { MapPin, ArrowRight, BarChart3, ShieldCheck, ArrowLeftRight } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<string>('overview');
  const [currentYear, setCurrentYear] = useState<number>(2024);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedCanton, setSelectedCanton] = useState<CantonProfile | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId | 'all'>('all');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('productivityPerHour');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Comparison Overlay State
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareTypeA, setCompareTypeA] = useState<ComparisonEntityType>('canton');
  const [compareIdA, setCompareIdA] = useState<string>('ZH');
  const [compareTypeB, setCompareTypeB] = useState<ComparisonEntityType>('canton');
  const [compareIdB, setCompareIdB] = useState<string>('BS');

  // Open comparison helper
  const handleOpenCompare = useCallback(
    (targetId?: string, isRegion: boolean = false) => {
      if (targetId) {
        if (isRegion) {
          setCompareTypeA('region');
          setCompareIdA(targetId);
          setCompareTypeB('region');
          setCompareIdB(targetId === 'zurich' ? 'lemanique' : 'zurich');
        } else {
          setCompareTypeA('canton');
          setCompareIdA(targetId);
          setCompareTypeB('canton');
          setCompareIdB(targetId === 'ZH' ? 'BS' : targetId === 'BS' ? 'ZH' : 'ZH');
        }
      }
      setIsCompareOpen(true);
    },
    []
  );

  // Playback handlers
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleToggleSpeed = useCallback(() => {
    setPlaybackSpeed((prev) => (prev === 1 ? 2 : 1));
  }, []);

  // CSV Export logic
  const handleExportCsv = useCallback(() => {
    const headers = [
      'Codigo_Canton',
      'Nombre_Canton',
      'Gran_Region',
      'Anio',
      'Productividad_Laboral_CHF_Hora',
      'PIB_Nominal_Millones_CHF',
      'PIB_Real_Millones_CHF',
      'PIB_Per_Capita_CHF',
      'Empleo_FTE_Miles',
      'Tasa_Desempleo_Pct',
      'Poblacion',
      'Tasa_Fecundidad_Hijos_Mujer',
      'Tasa_Mortalidad_Por_Mil',
      'Nacimientos_Anuales',
      'Defunciones_Anuales',
      'Saldo_Vegetativo_Natural',
      'Gasto_ID_Pct_PIB',
      'Cuota_VAB_Farma_Quimica_Pct',
      'Cuota_VAB_Finanzas_Seguros_Pct',
      'Cuota_VAB_MEM_Relojeria_Pct',
      'Cuota_VAB_Tecnologia_Servicios_Pct',
    ];

    const rows: string[] = [];
    rows.push(headers.join(';'));

    CANTONS_DATA.forEach((canton) => {
      const regionName = GREAT_REGIONS[canton.regionId]?.nameEs || canton.regionId;
      for (let yr = 2012; yr <= 2024; yr++) {
        const d = canton.history[yr];
        if (!d) continue;
        const row = [
          canton.code,
          `"${canton.name}"`,
          `"${regionName}"`,
          yr,
          d.productivityPerHour,
          d.pibMillions,
          d.pibRealMillions,
          d.pibPerCapita,
          d.fteEmployment,
          d.unemploymentRate,
          d.population,
          d.fertilityRate,
          d.mortalityRate,
          d.birthsCount,
          d.deathsCount,
          d.naturalBalance,
          d.rdIntensityPct,
          d.sectors.subsectors.pharmaChemical,
          d.sectors.subsectors.financeInsurance,
          d.sectors.subsectors.precisionMEM,
          d.sectors.subsectors.techServices,
        ];
        rows.push(row.join(';'));
      }
    });

    const csvContent = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `suiza_productividad_regional_2012_2024.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // Top 5 and Bottom 3 cantons by productivity in currentYear for executive quick-rank
  const rankedCantons = [...CANTONS_DATA].sort((a, b) => {
    const valA = a.history[currentYear]?.productivityPerHour || 0;
    const valB = b.history[currentYear]?.productivityPerHour || 0;
    return valB - valA;
  });

  const top5 = rankedCantons.slice(0, 5);
  const macroYear = MACRO_SWISS_YEARS[currentYear] || MACRO_SWISS_YEARS[2024];

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] flex flex-col font-sans">
      {/* 1. Top Navigation Bar (Zone 1: Brand, Zone 2: Links, Zone 3: Primary Action) */}
      <TopNav
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenReport={() => setIsReportOpen(true)}
        onExportCsv={handleExportCsv}
        onOpenCompare={() => handleOpenCompare()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6">
        {/* Screen Title & Subtitle banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D93856] mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D93856]" />
              <span>Plataforma de Inteligencia Económica y Competitividad</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#0F172A]">
              Dashboard Ejecutivo: Productividad y Economía Regional de Suiza (2012-2024)
            </h1>
            <p className="text-xs sm:text-sm text-[#515F74] mt-1 max-w-3xl">
              Análisis comparativo de los 26 cantones helvéticos y las 7 Grandes Regiones económicas: evolución del Valor Añadido Bruto (VAB), intensidad tecnológica, mercado laboral y resiliencia monetaria.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-[#64748B]">
              Base temporal: <strong>2012 — 2024</strong>
            </span>
            <span className="text-xs px-2 py-0.5 bg-[#FFFFFF] border border-[#E2E8F0] rounded text-[#334155] font-semibold">
              Oficial BFS / SECO
            </span>
          </div>
        </div>

        {/* 2. Precision Timeline Scrubber (Matches Helvetia Analytical spec) */}
        <TimelineScrubber
          currentYear={currentYear}
          onYearChange={setCurrentYear}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          playbackSpeed={playbackSpeed}
          onToggleSpeed={handleToggleSpeed}
        />

        {/* 3. Executive Macro KPI Strip (4 KPIs with sparklines and YoY deltas) */}
        <MacroKpiStrip currentYear={currentYear} />

        {/* 4. Conditional Screen View Renderer */}
        {activeView === 'overview' && (
          <div className="space-y-5">
            {/* Grid 12 columns: 8 cols Map & Cartography + 4 cols Executive Ranking & Fast Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 8 Cols: Swiss Choropleth Map */}
              <div className="lg:col-span-8">
                <SwissChoroplethMap
                  currentYear={currentYear}
                  selectedCantonCode={selectedCanton?.code || null}
                  onSelectCanton={setSelectedCanton}
                  selectedRegionId={selectedRegionId}
                  onSelectRegion={setSelectedRegionId}
                  selectedMetric={selectedMetric}
                  onChangeMetric={setSelectedMetric}
                />
              </div>

              {/* 4 Cols: Executive Leaders & Cantonal Inspector Preview */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {/* Ranking Card */}
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] flex-1">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#334155]">
                      <BarChart3 className="w-3.5 h-3.5 text-[#D93856]" />
                      <span>Líderes de Productividad ({currentYear})</span>
                    </div>
                    <span className="text-[11px] text-[#64748B] tabular-nums">
                      Media: {macroYear.avgProductivityPerHour.toFixed(1)} CHF/h
                    </span>
                  </div>

                  <div className="space-y-2">
                    {top5.map((c, idx) => {
                      const prod = c.history[currentYear]?.productivityPerHour || 0;
                      const delta = prod - macroYear.avgProductivityPerHour;
                      return (
                        <div
                          key={c.code}
                          onClick={() => setSelectedCanton(c)}
                          className="flex items-center justify-between p-2 rounded-[4px] hover:bg-[#F8FAFC] cursor-pointer transition-colors border border-transparent hover:border-[#E2E8F0]"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 text-center text-xs font-bold text-[#64748B] tabular-nums">
                              0{idx + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-[#0F172A]">
                                  {c.code}
                                </span>
                                <span className="text-xs text-[#515F74] truncate">
                                  {c.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-[#94A3B8] block truncate">
                                {c.specialization.split(',')[0]}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="text-right tabular-nums">
                              <span className="text-xs font-bold text-[#0F172A] block">
                                {prod.toFixed(1)} CHF/h
                              </span>
                              <span className="text-[10px] font-semibold text-[#334155]">
                                +{delta.toFixed(1)} vs Suiza
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCompare(c.code);
                              }}
                              className="p-1 text-[#94A3B8] hover:text-[#D93856] rounded hover:bg-[#FFFFFF] transition-colors"
                              title={`Comparar ${c.name} (${c.code})`}
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Footer */}
                  <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleOpenCompare()}
                      className="text-[#334155] hover:text-[#D93856] font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <ArrowLeftRight className="w-3 h-3 text-[#D93856]" />
                      <span>Comparativa</span>
                    </button>
                    <button
                      onClick={() => setActiveView('data')}
                      className="text-[#D93856] hover:text-[#E05370] font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <span>Ver Tabla</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Selected Canton Quick Insight */}
                {selectedCanton ? (
                  <div className="bg-[#FFFFFF] border border-[#D93856]/40 rounded-md p-4 shadow-sm bg-gradient-to-br from-[#FFFFFF] to-[#FCE8EC]/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-[#D93856] text-white flex items-center justify-center font-bold text-xs">
                          {selectedCanton.code}
                        </span>
                        <span className="font-bold text-xs text-[#0F172A]">
                          {selectedCanton.name}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedCanton(null)}
                        className="text-xs text-[#94A3B8] hover:text-[#0F172A]"
                      >
                        Limpiar
                      </button>
                    </div>

                    <div className="text-xs text-[#515F74] space-y-1.5 mb-3">
                      <div>
                        <span className="text-[#64748B]">Productividad:</span>{' '}
                        <strong className="text-[#0F172A] tabular-nums">
                          {selectedCanton.history[currentYear]?.productivityPerHour} CHF/h
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#64748B]">PIB Total:</span>{' '}
                        <strong className="text-[#0F172A] tabular-nums">
                          {selectedCanton.history[currentYear]?.pibMillions.toLocaleString('de-CH')} M CHF
                        </strong>
                      </div>
                      <div className="truncate">
                        <span className="text-[#64748B]">Empresas:</span>{' '}
                        <span>{selectedCanton.topCompanies.slice(0, 3).join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsInspectorOpen(true)}
                        className="flex-1 py-1.5 text-xs font-semibold text-white bg-[#D93856] hover:bg-[#E05370] rounded-[4px] transition-colors"
                      >
                        Ver Expediente
                      </button>
                      <button
                        onClick={() => handleOpenCompare(selectedCanton.code)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#0F172A] bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#94A3B8] rounded-[4px] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1 shadow-xs"
                        title="Comparar este cantón cara a cara con otro"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5 text-[#D93856]" />
                        <span>Comparar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs text-[#64748B] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D93856] shrink-0" />
                    <span>Haga clic en cualquier cantón del mapa para inspeccionar sus clústeres y evolución histórica.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Time Series Evolution */}
            <ProductivityEvolutionChart
              currentYear={currentYear}
              onSelectYear={setCurrentYear}
              selectedRegionId={selectedRegionId}
            />

            {/* Structural GVA Breakdown */}
            <SectorialBreakdownChart
              currentYear={currentYear}
              selectedCanton={selectedCanton}
              selectedRegionId={selectedRegionId}
            />

            {/* Regional Strategic Matrix (Scatter) */}
            <RegionalScatterPlot
              currentYear={currentYear}
              selectedCantonCode={selectedCanton?.code || null}
              onSelectCanton={setSelectedCanton}
              selectedRegionId={selectedRegionId}
            />

            {/* Demographics & Population Dynamics (Fecundidad, Mortalidad y Pirámide) */}
            <DemographicDynamicsChart
              currentYear={currentYear}
              onSelectYear={setCurrentYear}
              selectedRegionId={selectedRegionId}
              onSelectRegion={setSelectedRegionId}
              selectedCanton={selectedCanton}
              onSelectCanton={setSelectedCanton}
            />

            {/* Full Cantonal Data Table */}
            <CantonalDataTable
              currentYear={currentYear}
              selectedCantonCode={selectedCanton?.code || null}
              onSelectCanton={(canton) => {
                setSelectedCanton(canton);
              }}
              selectedRegionId={selectedRegionId}
              onSelectRegion={setSelectedRegionId}
              onExportCsv={handleExportCsv}
              onOpenCompare={(code) => handleOpenCompare(code)}
            />
          </div>
        )}

        {/* Dedicated Demographics & Population Screen */}
        {activeView === 'demographics' && (
          <div className="space-y-5">
            <DemographicDynamicsChart
              currentYear={currentYear}
              onSelectYear={setCurrentYear}
              selectedRegionId={selectedRegionId}
              onSelectRegion={setSelectedRegionId}
              selectedCanton={selectedCanton}
              onSelectCanton={setSelectedCanton}
            />
            <SwissChoroplethMap
              currentYear={currentYear}
              selectedCantonCode={selectedCanton?.code || null}
              onSelectCanton={setSelectedCanton}
              selectedRegionId={selectedRegionId}
              onSelectRegion={setSelectedRegionId}
              selectedMetric={selectedMetric}
              onChangeMetric={setSelectedMetric}
            />
            <CantonalDataTable
              currentYear={currentYear}
              selectedCantonCode={selectedCanton?.code || null}
              onSelectCanton={setSelectedCanton}
              selectedRegionId={selectedRegionId}
              onSelectRegion={setSelectedRegionId}
              onExportCsv={handleExportCsv}
              onOpenCompare={(code) => handleOpenCompare(code)}
            />
          </div>
        )}

        {/* Dedicated Map Screen */}
        {activeView === 'map' && (
          <div className="space-y-5">
            <SwissChoroplethMap
              currentYear={currentYear}
              selectedCantonCode={selectedCanton?.code || null}
              onSelectCanton={setSelectedCanton}
              selectedRegionId={selectedRegionId}
              onSelectRegion={setSelectedRegionId}
              selectedMetric={selectedMetric}
              onChangeMetric={setSelectedMetric}
            />
            <CantonalDataTable
              currentYear={currentYear}
              selectedCantonCode={selectedCanton?.code || null}
              onSelectCanton={setSelectedCanton}
              selectedRegionId={selectedRegionId}
              onSelectRegion={setSelectedRegionId}
              onExportCsv={handleExportCsv}
              onOpenCompare={(code) => handleOpenCompare(code)}
            />
          </div>
        )}

        {/* Dedicated Evolution Screen */}
        {activeView === 'evolution' && (
          <div className="space-y-5">
            <ProductivityEvolutionChart
              currentYear={currentYear}
              onSelectYear={setCurrentYear}
              selectedRegionId={selectedRegionId}
            />
            <RegionalScatterPlot
              currentYear={currentYear}
              selectedCantonCode={selectedCanton?.code || null}
              onSelectCanton={setSelectedCanton}
              selectedRegionId={selectedRegionId}
            />
          </div>
        )}

        {/* Dedicated Sectors Screen */}
        {activeView === 'sectors' && (
          <div className="space-y-5">
            <SectorialBreakdownChart
              currentYear={currentYear}
              selectedCanton={selectedCanton}
              selectedRegionId={selectedRegionId}
            />
            <CantonalDataTable
              currentYear={currentYear}
              selectedCantonCode={selectedCanton?.code || null}
              onSelectCanton={setSelectedCanton}
              selectedRegionId={selectedRegionId}
              onSelectRegion={setSelectedRegionId}
              onExportCsv={handleExportCsv}
              onOpenCompare={(code) => handleOpenCompare(code)}
            />
          </div>
        )}

        {/* Dedicated Matrix Screen */}
        {activeView === 'matrix' && (
          <div className="space-y-5">
            <RegionalScatterPlot
              currentYear={currentYear}
              selectedCantonCode={selectedCanton?.code || null}
              onSelectCanton={setSelectedCanton}
              selectedRegionId={selectedRegionId}
            />
            <ProductivityEvolutionChart
              currentYear={currentYear}
              onSelectYear={setCurrentYear}
              selectedRegionId={selectedRegionId}
            />
          </div>
        )}

        {/* Dedicated Data Table Screen */}
        {activeView === 'data' && (
          <div className="space-y-5">
            <CantonalDataTable
              currentYear={currentYear}
              selectedCantonCode={selectedCanton?.code || null}
              onSelectCanton={setSelectedCanton}
              selectedRegionId={selectedRegionId}
              onSelectRegion={setSelectedRegionId}
              onExportCsv={handleExportCsv}
              onOpenCompare={(code) => handleOpenCompare(code)}
            />
          </div>
        )}
      </main>

      {/* Drill-down Canton Inspector Modal */}
      <CantonInspectorModal
        canton={isInspectorOpen ? selectedCanton : null}
        currentYear={currentYear}
        onClose={() => setIsInspectorOpen(false)}
        onYearSelect={setCurrentYear}
        onOpenCompare={(code) => handleOpenCompare(code)}
      />

      {/* Side-by-Side Comparison Modal */}
      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentYear={currentYear}
        initialTypeA={compareTypeA}
        initialIdA={compareIdA}
        initialTypeB={compareTypeB}
        idB={compareIdB}
        onYearSelect={setCurrentYear}
      />

      {/* Strategic Executive Report Modal */}
      <ExecutiveReportModal
        currentYear={currentYear}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* Modernist Footer conforming to Anti-Slop & Swiss standards */}
      <footer className="bg-[#FFFFFF] border-t border-[#E2E8F0] mt-auto py-5 px-4 sm:px-6 lg:px-10 text-xs text-[#64748B]">
        <div className="max-w-[1536px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0F172A]">Helvetia Analytical</span>
            <span className="text-[#94A3B8]">·</span>
            <span>Plataforma Ejecutiva de Productividad y Economía Regional de Suiza</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#515F74]">
            <span>Series estadísticas: 2012–2024</span>
            <span>·</span>
            <span>Fuentes: BFS / OFS / SECO / Banco Nacional Suizo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
