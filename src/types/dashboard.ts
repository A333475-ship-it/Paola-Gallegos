export type RegionId = 
  | 'lemanique'
  | 'mittelland'
  | 'nordwestschweiz'
  | 'zurich'
  | 'ostschweiz'
  | 'zentralschweiz'
  | 'ticino';

export interface GreatRegion {
  id: RegionId;
  nameEs: string;
  nameDe: string;
  nameFr: string;
  cantons: string[]; // Codes e.g. ['ZH']
  color: string;
  economicPillars: string[];
}

export type CantonCode = 
  | 'ZH' | 'BE' | 'LU' | 'UR' | 'SZ' | 'OW' | 'NW' | 'GL' | 'ZG'
  | 'FR' | 'SO' | 'BS' | 'BL' | 'SH' | 'AR' | 'AI' | 'SG' | 'GR'
  | 'AG' | 'TG' | 'TI' | 'VD' | 'VS' | 'NE' | 'GE' | 'JU';

export interface SectorShare {
  primary: number;       // % Agricultura y extracción
  secondary: number;     // % Industria, Farma, Maquinaria, Relojería
  tertiary: number;      // % Servicios, Banca, Seguros, Consultoría, IT
  subsectors: {
    pharmaChemical: number; // % VAB
    financeInsurance: number;
    precisionMEM: number;    // Relojería y Maquinaria
    techServices: number;
    publicOther: number;
  };
}

export interface CantonYearData {
  year: number;
  pibMillions: number;          // CHF Millones nominales
  pibRealMillions: number;      // CHF Millones a precios constantes 2012
  pibPerCapita: number;         // CHF por habitante
  productivityPerHour: number;  // CHF de VAB por hora trabajada (Productividad Laboral)
  fteEmployment: number;        // Miles de puestos a tiempo completo
  unemploymentRate: number;     // %
  population: number;           // Habitantes residentes permanentes
  populationGrowthPct?: number; // Crecimiento interanual de la población %
  fertilityRate: number;        // Tasa Global de Fecundidad (hijos por mujer, BFS)
  mortalityRate: number;        // Tasa Bruta de Mortalidad (defunciones por 1.000 hab., BFS)
  birthsCount: number;          // Nacimientos vivos anuales estimados
  deathsCount: number;          // Defunciones anuales estimadas
  naturalBalance: number;       // Saldo vegetativo natural (nacimientos - defunciones)
  rdIntensityPct: number;       // % del PIB en I+D
  sectors: SectorShare;
}

export interface CantonProfile {
  code: CantonCode;
  name: string;
  regionId: RegionId;
  capital: string;
  flagUrl?: string;
  coordinates: { x: number; y: number }; // Relative map coordinate for visual layout
  pathD?: string;
  specialization: string;
  topCompanies: string[];
  taxCompetitivenessRank: number; // 1 to 26
  history: Record<number, CantonYearData>;
}

export interface MacroSwissYear {
  year: number;
  pibBillions: number;           // CHF Miles de Millones
  pibGrowthRealPct: number;      // Crecimiento PIB Real %
  avgProductivityPerHour: number;// CHF / hora
  totalFteEmploymentMillions: number; // Millones FTE
  unemploymentRate: number;      // %
  exportBillions: number;        // CHF Miles de Millones
  rdIntensityPct: number;        // %
  inflationPct: number;          // %
  totalPopulationMillions: number; // Millones de residentes en Suiza (BFS)
  avgFertilityRate: number;      // Hijos por mujer promedio nacional
  avgMortalityRate: number;      // Defunciones por cada 1.000 habitantes
  totalBirthsThousands: number;  // Miles de nacimientos anuales en Suiza
  totalDeathsThousands: number;  // Miles de defunciones anuales en Suiza
  naturalBalanceThousands: number; // Saldo vegetativo natural nacional en miles
  milestoneTitle?: string;
  milestoneDescription?: string;
}

export type MetricType = 
  | 'productivityPerHour'
  | 'pibMillions'
  | 'pibPerCapita'
  | 'fteEmployment'
  | 'rdIntensityPct'
  | 'fertilityRate'
  | 'mortalityRate'
  | 'population';

export interface MetricDefinition {
  id: MetricType;
  label: string;
  shortLabel: string;
  unit: string;
  description: string;
  format: (val: number) => string;
}
