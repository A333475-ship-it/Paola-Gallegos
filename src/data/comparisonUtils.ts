import { CantonCode, CantonProfile, GreatRegion, MetricType, RegionId } from '../types/dashboard';
import { CANTONS_DATA, GREAT_REGIONS, MACRO_SWISS_YEARS } from './swissEconomicData';

export type ComparisonEntityType = 'canton' | 'region';

export interface ComparisonEntityProfile {
  id: string;
  type: ComparisonEntityType;
  code: string;
  name: string;
  shortName: string;
  badgeBg: string;
  badgeTextColor: string;
  regionName?: string;
  capitalOrCantons: string;
  specialization: string;
  topCompanies: string[];
  taxRank?: number;
  history: Record<number, {
    year: number;
    pibMillions: number;
    pibRealMillions: number;
    pibPerCapita: number;
    productivityPerHour: number;
    fteEmployment: number;
    unemploymentRate: number;
    population: number;
    fertilityRate: number;
    mortalityRate: number;
    birthsCount: number;
    deathsCount: number;
    naturalBalance: number;
    rdIntensityPct: number;
    sectors: {
      primary: number;
      secondary: number;
      tertiary: number;
      subsectors: {
        pharmaChemical: number;
        financeInsurance: number;
        precisionMEM: number;
        techServices: number;
        publicOther: number;
      };
    };
  }>;
}

// Helper to calculate complete regional profile across all years 2012-2024
export function computeRegionalProfile(regionId: RegionId): ComparisonEntityProfile {
  const reg = GREAT_REGIONS[regionId];
  const cantonsInRegion = CANTONS_DATA.filter((c) => c.regionId === regionId);

  const history: ComparisonEntityProfile['history'] = {};
  const years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  years.forEach((yr) => {
    let totalPib = 0;
    let totalPibReal = 0;
    let totalPop = 0;
    let totalFte = 0;
    let sumProdWeight = 0;
    let sumUnempWeight = 0;
    let sumRdWeight = 0;

    let sumPrimaryPib = 0;
    let sumSecondaryPib = 0;
    let sumTertiaryPib = 0;

    let sumPharmaPib = 0;
    let sumFinancePib = 0;
    let sumPrecisionPib = 0;
    let sumTechPib = 0;
    let sumPublicPib = 0;

    cantonsInRegion.forEach((canton) => {
      const d = canton.history[yr];
      if (!d) return;

      totalPib += d.pibMillions;
      totalPibReal += d.pibRealMillions;
      totalPop += d.population;
      totalFte += d.fteEmployment;

      sumProdWeight += d.productivityPerHour * d.fteEmployment;
      sumUnempWeight += d.unemploymentRate * d.population;
      sumRdWeight += d.rdIntensityPct * d.pibMillions;

      sumPrimaryPib += (d.sectors.primary / 100) * d.pibMillions;
      sumSecondaryPib += (d.sectors.secondary / 100) * d.pibMillions;
      sumTertiaryPib += (d.sectors.tertiary / 100) * d.pibMillions;

      sumPharmaPib += (d.sectors.subsectors.pharmaChemical / 100) * d.pibMillions;
      sumFinancePib += (d.sectors.subsectors.financeInsurance / 100) * d.pibMillions;
      sumPrecisionPib += (d.sectors.subsectors.precisionMEM / 100) * d.pibMillions;
      sumTechPib += (d.sectors.subsectors.techServices / 100) * d.pibMillions;
      sumPublicPib += (d.sectors.subsectors.publicOther / 100) * d.pibMillions;
    });

    const safePib = totalPib || 1;
    const safeFte = totalFte || 1;
    const safePop = totalPop || 1;

    const weightedFert = cantonsInRegion.reduce(
      (sum, c) => sum + (c.history[yr]?.fertilityRate || 0) * (c.history[yr]?.population || 0),
      0
    ) / safePop;
    const weightedMort = cantonsInRegion.reduce(
      (sum, c) => sum + (c.history[yr]?.mortalityRate || 0) * (c.history[yr]?.population || 0),
      0
    ) / safePop;
    const totalBirths = cantonsInRegion.reduce(
      (sum, c) => sum + (c.history[yr]?.birthsCount || 0),
      0
    );
    const totalDeaths = cantonsInRegion.reduce(
      (sum, c) => sum + (c.history[yr]?.deathsCount || 0),
      0
    );

    history[yr] = {
      year: yr,
      pibMillions: totalPib,
      pibRealMillions: totalPibReal,
      pibPerCapita: Math.round((totalPib * 1000000) / safePop),
      productivityPerHour: Number((sumProdWeight / safeFte).toFixed(1)),
      fteEmployment: Number(totalFte.toFixed(1)),
      unemploymentRate: Number((sumUnempWeight / safePop).toFixed(1)),
      population: totalPop,
      fertilityRate: Number(weightedFert.toFixed(2)),
      mortalityRate: Number(weightedMort.toFixed(1)),
      birthsCount: totalBirths,
      deathsCount: totalDeaths,
      naturalBalance: totalBirths - totalDeaths,
      rdIntensityPct: Number((sumRdWeight / safePib).toFixed(2)),
      sectors: {
        primary: Number(((sumPrimaryPib / safePib) * 100).toFixed(1)),
        secondary: Number(((sumSecondaryPib / safePib) * 100).toFixed(1)),
        tertiary: Number(((sumTertiaryPib / safePib) * 100).toFixed(1)),
        subsectors: {
          pharmaChemical: Number(((sumPharmaPib / safePib) * 100).toFixed(1)),
          financeInsurance: Number(((sumFinancePib / safePib) * 100).toFixed(1)),
          precisionMEM: Number(((sumPrecisionPib / safePib) * 100).toFixed(1)),
          techServices: Number(((sumTechPib / safePib) * 100).toFixed(1)),
          publicOther: Number(((sumPublicPib / safePib) * 100).toFixed(1)),
        },
      },
    };
  });

  // Extract top companies across cantons
  const companySet = new Set<string>();
  cantonsInRegion.forEach((c) => {
    c.topCompanies.slice(0, 3).forEach((comp) => companySet.add(comp));
  });

  return {
    id: regionId,
    type: 'region',
    code: regionId.substring(0, 3).toUpperCase(),
    name: reg.nameEs,
    shortName: reg.nameDe || reg.nameEs,
    badgeBg: reg.color,
    badgeTextColor: '#FFFFFF',
    regionName: `Gran Región (${reg.cantons.join(', ')})`,
    capitalOrCantons: `${cantonsInRegion.length} Cantones: ${reg.cantons.join(', ')}`,
    specialization: reg.economicPillars.join(' · '),
    topCompanies: Array.from(companySet).slice(0, 6),
    history,
  };
}

// Convert CantonProfile to ComparisonEntityProfile
export function convertCantonToProfile(canton: CantonProfile): ComparisonEntityProfile {
  const reg = GREAT_REGIONS[canton.regionId];
  return {
    id: canton.code,
    type: 'canton',
    code: canton.code,
    name: canton.name,
    shortName: canton.name,
    badgeBg: '#D93856',
    badgeTextColor: '#FFFFFF',
    regionName: reg?.nameEs || canton.regionId,
    capitalOrCantons: `Capital: ${canton.capital}`,
    specialization: canton.specialization,
    topCompanies: canton.topCompanies,
    taxRank: canton.taxCompetitivenessRank,
    history: canton.history,
  };
}

// Cached regional profiles
const REGIONAL_PROFILES_CACHE: Partial<Record<RegionId, ComparisonEntityProfile>> = {};

export function getEntityProfile(type: ComparisonEntityType, id: string): ComparisonEntityProfile | null {
  if (type === 'canton') {
    const c = CANTONS_DATA.find((item) => item.code === id);
    if (!c) return null;
    return convertCantonToProfile(c);
  }

  if (type === 'region') {
    const regId = id as RegionId;
    if (!GREAT_REGIONS[regId]) return null;
    if (!REGIONAL_PROFILES_CACHE[regId]) {
      REGIONAL_PROFILES_CACHE[regId] = computeRegionalProfile(regId);
    }
    return REGIONAL_PROFILES_CACHE[regId]!;
  }

  return null;
}

export interface ComparisonPreset {
  id: string;
  title: string;
  category: 'cantons' | 'regions';
  tag: string;
  typeA: ComparisonEntityType;
  idA: string;
  typeB: ComparisonEntityType;
  idB: string;
  description: string;
}

export const COMPARISON_PRESETS: ComparisonPreset[] = [
  {
    id: 'zh-vs-bs',
    title: 'Zúrich (ZH) vs Basilea-Ciudad (BS)',
    category: 'cantons',
    tag: 'Finanzas vs Farma',
    typeA: 'canton',
    idA: 'ZH',
    typeB: 'canton',
    idB: 'BS',
    description: 'Duelo entre el epicentro bancario/IT y la capital mundial de las ciencias de la vida.',
  },
  {
    id: 'ge-vs-vd',
    title: 'Ginebra (GE) vs Vaud (VD)',
    category: 'cantons',
    tag: 'Eje Lémanico',
    typeA: 'canton',
    idA: 'GE',
    typeB: 'canton',
    idB: 'VD',
    description: 'Los dos motores del Lago Lemán: banca privada y diplomacia frente al campus EPFL y nutrición.',
  },
  {
    id: 'zg-vs-be',
    title: 'Zug (ZG) vs Berna (BE)',
    category: 'cantons',
    tag: 'Fiscalidad vs Capital',
    typeA: 'canton',
    idA: 'ZG',
    typeB: 'canton',
    idB: 'BE',
    description: 'Crypto Valley y ultra-baja presión fiscal frente a la sede institucional federal y micromecánica.',
  },
  {
    id: 'ti-vs-vs',
    title: 'Tesino (TI) vs Valais (VS)',
    category: 'cantons',
    tag: 'Regiones Alpinas',
    typeA: 'canton',
    idA: 'TI',
    typeB: 'canton',
    idB: 'VS',
    description: 'Enfoques periféricos: la puerta italiana de servicios frente a hidroeléctrica, turismo y enología.',
  },
  {
    id: 'reg-zurich-vs-lemanique',
    title: 'Gran Zúrich vs Región Lémanica',
    category: 'regions',
    tag: 'Macro-Regiones',
    typeA: 'region',
    idA: 'zurich',
    typeB: 'region',
    idB: 'lemanique',
    description: 'Las dos mayores áreas metropolitanas y polos económicos de Suiza cara a cara.',
  },
  {
    id: 'reg-nordwest-vs-mittelland',
    title: 'Suiza Noroccidental vs Espace Mittelland',
    category: 'regions',
    tag: 'Farma vs Industrial',
    typeA: 'region',
    idA: 'nordwestschweiz',
    typeB: 'region',
    idB: 'mittelland',
    description: 'La vanguardia biofarmacéutica renana frente al corazón industrial y administrativo federal.',
  },
  {
    id: 'reg-zentral-vs-ost',
    title: 'Suiza Central vs Suiza Oriental',
    category: 'regions',
    tag: 'Trading vs MEM',
    typeA: 'region',
    idA: 'zentralschweiz',
    typeB: 'region',
    idB: 'ostschweiz',
    description: 'Atractivo tributario y trading global frente al tejido fabril de maquinaria y óptica.',
  },
];
