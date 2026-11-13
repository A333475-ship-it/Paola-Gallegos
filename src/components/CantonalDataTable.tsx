import React, { useState, useMemo } from 'react';
import { CantonCode, CantonProfile, RegionId } from '../types/dashboard';
import { CANTONS_DATA, GREAT_REGIONS, MACRO_SWISS_YEARS } from '../data/swissEconomicData';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download, ChevronRight, ArrowLeftRight } from 'lucide-react';

interface CantonalDataTableProps {
  currentYear: number;
  selectedCantonCode: CantonCode | null;
  onSelectCanton: (canton: CantonProfile | null) => void;
  selectedRegionId: RegionId | 'all';
  onSelectRegion: (regionId: RegionId | 'all') => void;
  onExportCsv: () => void;
  onOpenCompare?: (cantonCode: string) => void;
}

type SortField =
  | 'code'
  | 'name'
  | 'region'
  | 'productivityPerHour'
  | 'pibMillions'
  | 'pibPerCapita'
  | 'fteEmployment'
  | 'rdIntensityPct'
  | 'unemploymentRate'
  | 'fertilityRate'
  | 'mortalityRate'
  | 'population';

export const CantonalDataTable: React.FC<CantonalDataTableProps> = ({
  currentYear,
  selectedCantonCode,
  onSelectCanton,
  selectedRegionId,
  onSelectRegion,
  onExportCsv,
  onOpenCompare,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('productivityPerHour');
  const [sortAsc, setSortAsc] = useState(false);

  const macro = MACRO_SWISS_YEARS[currentYear] || MACRO_SWISS_YEARS[2024];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      // Default to descending for numbers, ascending for names
      setSortAsc(field === 'name' || field === 'code' || field === 'region');
    }
  };

  const filteredAndSorted = useMemo(() => {
    return CANTONS_DATA.filter((canton) => {
      // Region filter
      if (selectedRegionId !== 'all' && canton.regionId !== selectedRegionId) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = canton.name.toLowerCase().includes(query);
        const matchesCode = canton.code.toLowerCase().includes(query);
        const matchesCapital = canton.capital.toLowerCase().includes(query);
        const matchesRegion = GREAT_REGIONS[canton.regionId]?.nameEs.toLowerCase().includes(query);
        const matchesSpec = canton.specialization.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesCapital && !matchesRegion && !matchesSpec) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const curA = a.history[currentYear];
      const curB = b.history[currentYear];

      let valA: any;
      let valB: any;

      switch (sortField) {
        case 'code':
          valA = a.code;
          valB = b.code;
          break;
        case 'name':
          valA = a.name;
          valB = b.name;
          break;
        case 'region':
          valA = GREAT_REGIONS[a.regionId]?.nameEs || '';
          valB = GREAT_REGIONS[b.regionId]?.nameEs || '';
          break;
        case 'productivityPerHour':
          valA = curA?.productivityPerHour || 0;
          valB = curB?.productivityPerHour || 0;
          break;
        case 'pibMillions':
          valA = curA?.pibMillions || 0;
          valB = curB?.pibMillions || 0;
          break;
        case 'pibPerCapita':
          valA = curA?.pibPerCapita || 0;
          valB = curB?.pibPerCapita || 0;
          break;
        case 'fteEmployment':
          valA = curA?.fteEmployment || 0;
          valB = curB?.fteEmployment || 0;
          break;
        case 'rdIntensityPct':
          valA = curA?.rdIntensityPct || 0;
          valB = curB?.rdIntensityPct || 0;
          break;
        case 'unemploymentRate':
          valA = curA?.unemploymentRate || 0;
          valB = curB?.unemploymentRate || 0;
          break;
        case 'fertilityRate':
          valA = curA?.fertilityRate || 0;
          valB = curB?.fertilityRate || 0;
          break;
        case 'mortalityRate':
          valA = curA?.mortalityRate || 0;
          valB = curB?.mortalityRate || 0;
          break;
        case 'population':
          valA = curA?.population || 0;
          valB = curB?.population || 0;
          break;
        default:
          valA = 0;
          valB = 0;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [currentYear, selectedRegionId, searchQuery, sortField, sortAsc]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#94A3B8] opacity-60 inline ml-1" />;
    }
    return sortAsc ? (
      <ArrowUp className="w-3 h-3 text-[#D93856] inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#D93856] inline ml-1" />
    );
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] overflow-hidden mb-6">
      {/* Control bar: search, region filter, record count, CSV button */}
      <div className="p-3.5 lg:p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF]">
        <div className="flex items-center gap-3">
          {/* Search Input: 36px height, body-md typography per design spec */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cantón, capital o sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#FFFFFF] border border-[#E2E8F0] rounded-[4px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#D93856] focus:ring-2 focus:ring-[#D93856]/15 transition-all"
            />
          </div>

          <span className="text-xs text-[#64748B] hidden md:inline">
            Mostrando <strong>{filteredAndSorted.length}</strong> de 26 cantones
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Region Selector dropdown */}
          <select
            value={selectedRegionId}
            onChange={(e) => onSelectRegion(e.target.value as RegionId | 'all')}
            className="h-9 px-2.5 text-xs bg-[#FFFFFF] border border-[#E2E8F0] rounded-[4px] text-[#334155] focus:outline-none focus:border-[#D93856]"
          >
            <option value="all">Todas las Regiones</option>
            {Object.entries(GREAT_REGIONS).map(([id, reg]) => (
              <option key={id} value={id}>
                {reg.nameEs}
              </option>
            ))}
          </select>

          {onOpenCompare && (
            <button
              onClick={() => onOpenCompare(selectedCantonCode || 'ZH')}
              className="h-9 px-3 text-xs font-semibold text-[#0F172A] bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#94A3B8] rounded-[4px] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
              title="Comparar dos cantones cara a cara"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#D93856]" />
              <span className="hidden sm:inline">Comparar</span>
            </button>
          )}

          <button
            onClick={onExportCsv}
            title="Exportar a CSV"
            className="h-9 px-3 text-xs font-medium text-[#334155] bg-[#FFFFFF] border border-[#E2E8F0] rounded-[4px] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll for Small Screens */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Header: Height 36px, alpine-subtle (#F8FAFC) background, label-sm uppercase with #64748B, 1px solid bottom border #E2E8F0 */}
          <thead>
            <tr className="h-9 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B] select-none">
              <th
                onClick={() => handleSort('code')}
                className="pl-4 pr-2 cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
              >
                Cantón {renderSortIcon('code')}
              </th>
              <th
                onClick={() => handleSort('region')}
                className="px-3 cursor-pointer hover:text-[#0F172A] whitespace-nowrap hidden sm:table-cell"
              >
                Gran Región {renderSortIcon('region')}
              </th>
              <th
                onClick={() => handleSort('productivityPerHour')}
                className="px-3 text-right cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
              >
                Productividad (CHF/h) {renderSortIcon('productivityPerHour')}
              </th>
              <th
                onClick={() => handleSort('pibMillions')}
                className="px-3 text-right cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
              >
                PIB (M CHF) {renderSortIcon('pibMillions')}
              </th>
              <th
                onClick={() => handleSort('pibPerCapita')}
                className="px-3 text-right cursor-pointer hover:text-[#0F172A] whitespace-nowrap hidden md:table-cell"
              >
                PIB / Hab. {renderSortIcon('pibPerCapita')}
              </th>
              <th
                onClick={() => handleSort('fteEmployment')}
                className="px-3 text-right cursor-pointer hover:text-[#0F172A] whitespace-nowrap hidden lg:table-cell"
              >
                Empleo (k FTE) {renderSortIcon('fteEmployment')}
              </th>
              <th
                onClick={() => handleSort('rdIntensityPct')}
                className="px-3 text-right cursor-pointer hover:text-[#0F172A] whitespace-nowrap hidden lg:table-cell"
              >
                I+D (% PIB) {renderSortIcon('rdIntensityPct')}
              </th>
              <th
                onClick={() => handleSort('unemploymentRate')}
                className="px-3 text-right cursor-pointer hover:text-[#0F172A] whitespace-nowrap hidden xl:table-cell"
              >
                Desempleo {renderSortIcon('unemploymentRate')}
              </th>
              <th
                onClick={() => handleSort('fertilityRate')}
                className="px-3 text-right cursor-pointer hover:text-[#0F172A] whitespace-nowrap hidden md:table-cell"
              >
                Fecundidad {renderSortIcon('fertilityRate')}
              </th>
              <th
                onClick={() => handleSort('mortalityRate')}
                className="px-3 text-right cursor-pointer hover:text-[#0F172A] whitespace-nowrap hidden lg:table-cell"
              >
                Mortalidad {renderSortIcon('mortalityRate')}
              </th>
              <th
                onClick={() => handleSort('population')}
                className="px-3 text-right cursor-pointer hover:text-[#0F172A] whitespace-nowrap hidden sm:table-cell"
              >
                Población {renderSortIcon('population')}
              </th>
              <th className="pr-4 pl-2 text-right">Acción</th>
            </tr>
          </thead>

          {/* Rows: Fixed 40px height for dense executive viewing, alternating subtle hover tint */}
          <tbody className="divide-y divide-[#E2E8F0] text-xs">
            {filteredAndSorted.map((canton) => {
              const cur = canton.history[currentYear];
              const isSelected = selectedCantonCode === canton.code;
              const prod = cur?.productivityPerHour || 0;
              const deltaSwiss = prod - macro.avgProductivityPerHour;

              return (
                <tr
                  key={canton.code}
                  onClick={() => onSelectCanton(isSelected ? null : canton)}
                  className={`h-10 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#FCE8EC]/50 font-medium'
                      : 'hover:bg-[#F8FAFC]'
                  }`}
                >
                  {/* Canton Code & Name */}
                  <td className="pl-4 pr-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-center font-bold text-[#0F172A] text-xs">
                        {canton.code}
                      </span>
                      <span className="text-[#334155] font-medium truncate max-w-[140px]">
                        {canton.name}
                      </span>
                    </div>
                  </td>

                  {/* Region Name */}
                  <td className="px-3 whitespace-nowrap text-[#64748B] text-[11px] hidden sm:table-cell truncate max-w-[160px]">
                    {GREAT_REGIONS[canton.regionId]?.nameEs}
                  </td>

                  {/* Productivity (Right-aligned, tabular-nums) */}
                  <td className="px-3 text-right whitespace-nowrap tabular-nums">
                    <div className="inline-flex items-baseline gap-1.5">
                      <span className="font-bold text-[#0F172A] text-xs">
                        {prod.toFixed(1)}
                      </span>
                      {/* Delta vs Swiss average indicator */}
                      <span
                        className={`text-[10px] font-semibold px-1 rounded ${
                          deltaSwiss >= 0
                            ? 'bg-[#F1F5F9] text-[#334155]'
                            : 'bg-[#FCE8EC] text-[#D93856]'
                        }`}
                      >
                        {deltaSwiss >= 0 ? '+' : ''}
                        {deltaSwiss.toFixed(1)}
                      </span>
                    </div>
                  </td>

                  {/* GDP Millions */}
                  <td className="px-3 text-right whitespace-nowrap text-[#0F172A] font-semibold tabular-nums">
                    {cur?.pibMillions.toLocaleString('de-CH')}
                  </td>

                  {/* GDP per Capita */}
                  <td className="px-3 text-right whitespace-nowrap text-[#515F74] tabular-nums hidden md:table-cell">
                    {cur?.pibPerCapita.toLocaleString('de-CH')} CHF
                  </td>

                  {/* FTE Employment */}
                  <td className="px-3 text-right whitespace-nowrap text-[#515F74] tabular-nums hidden lg:table-cell">
                    {cur?.fteEmployment.toFixed(1)}k
                  </td>

                  {/* R&D % */}
                  <td className="px-3 text-right whitespace-nowrap text-[#515F74] tabular-nums hidden lg:table-cell">
                    {cur?.rdIntensityPct.toFixed(2)}%
                  </td>

                  {/* Unemployment % */}
                  <td className="px-3 text-right whitespace-nowrap text-[#515F74] tabular-nums hidden xl:table-cell">
                    {cur?.unemploymentRate.toFixed(1)}%
                  </td>

                  {/* Fertility */}
                  <td className="px-3 text-right whitespace-nowrap font-medium text-[#0F172A] tabular-nums hidden md:table-cell">
                    {cur?.fertilityRate.toFixed(2)}
                  </td>

                  {/* Mortality */}
                  <td className="px-3 text-right whitespace-nowrap text-[#515F74] tabular-nums hidden lg:table-cell">
                    {cur?.mortalityRate.toFixed(1)}‰
                  </td>

                  {/* Population */}
                  <td className="px-3 text-right whitespace-nowrap text-[#515F74] tabular-nums hidden sm:table-cell">
                    {cur?.population.toLocaleString('de-CH')}
                  </td>

                  {/* Action */}
                  <td className="pr-4 pl-2 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {onOpenCompare && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenCompare(canton.code);
                          }}
                          className="text-[#64748B] hover:text-[#D93856] p-1 rounded hover:bg-[#F1F5F9] transition-colors"
                          title={`Comparar ${canton.name} (${canton.code})`}
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5 inline" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCanton(canton);
                        }}
                        className="text-[#64748B] hover:text-[#D93856] p-1 rounded hover:bg-[#F1F5F9] transition-colors"
                        title="Abrir expediente cantonal"
                      >
                        <ChevronRight className="w-4 h-4 inline" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
