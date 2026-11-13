import { CantonCode, CantonProfile, GreatRegion, MacroSwissYear, MetricDefinition, MetricType, RegionId } from '../types/dashboard';

export const GREAT_REGIONS: Record<RegionId, GreatRegion> = {
  lemanique: {
    id: 'lemanique',
    nameEs: 'Región Lémanica (Lago Lemán)',
    nameDe: 'Genferseeregion',
    nameFr: 'Région lémanique',
    cantons: ['VD', 'VS', 'GE'],
    color: '#D93856',
    economicPillars: ['Banca Privada y Trading', 'Ciencias de la Vida y Biotecnología', 'Relojería de Lujo', 'Organismos Internacionales']
  },
  mittelland: {
    id: 'mittelland',
    nameEs: 'Espace Mittelland',
    nameDe: 'Espace Mittelland',
    nameFr: 'Espace Mittelland',
    cantons: ['BE', 'FR', 'SO', 'NE', 'JU'],
    color: '#334155',
    economicPillars: ['Administración Pública Federal', 'Micromecánica y Relojería', 'Maquinaria de Precisión', 'Agroalimentario']
  },
  nordwestschweiz: {
    id: 'nordwestschweiz',
    nameEs: 'Suiza Noroccidental (Basilea / Argovia)',
    nameDe: 'Nordwestschweiz',
    nameFr: 'Suisse du Nord-Ouest',
    cantons: ['BS', 'BL', 'AG'],
    color: '#E05370',
    economicPillars: ['Clúster Farmacéutico Mundial', 'Química Especializada', 'Tecnología Médica', 'Logística Fluvial Rin']
  },
  zurich: {
    id: 'zurich',
    nameEs: 'Zúrich (Gran Zúrich)',
    nameDe: 'Zürich',
    nameFr: 'Zurich',
    cantons: ['ZH'],
    color: '#B61B3F',
    economicPillars: ['Centro Financiero Global', 'Fintech e Inteligencia Artificial', 'Sedes Corporativas Globales', 'Consultoría Estratégica']
  },
  ostschweiz: {
    id: 'ostschweiz',
    nameEs: 'Suiza Oriental (Ostschweiz)',
    nameDe: 'Ostschweiz',
    nameFr: 'Suisse orientale',
    cantons: ['SG', 'GL', 'SH', 'AR', 'AI', 'TG', 'GR'],
    color: '#64748B',
    economicPillars: ['Industria MEM (Maquinaria/Electrónica)', 'Tecnología Textil Avanzada', 'Instrumentación Óptica', 'Turismo Alpino']
  },
  zentralschweiz: {
    id: 'zentralschweiz',
    nameEs: 'Suiza Central (Zentralschweiz)',
    nameDe: 'Zentralschweiz',
    nameFr: 'Suisse centrale',
    cantons: ['LU', 'UR', 'SZ', 'OW', 'NW', 'ZG'],
    color: '#8E7071',
    economicPillars: ['Crypto Valley & Blockchain', 'Comercio de Materias Primas', 'Banca de Inversión y Holdings', 'Turismo']
  },
  ticino: {
    id: 'ticino',
    nameEs: 'Tesino (Ticino)',
    nameDe: 'Tessin',
    nameFr: 'Tessin',
    cantons: ['TI'],
    color: '#515F74',
    economicPillars: ['Servicios Financieros Transfronterizos', 'Moda y Logística de Lujo', 'Metalurgia Ligera', 'Biofarmacia']
  }
};

export const MACRO_SWISS_YEARS: Record<number, MacroSwissYear> = {
  2012: {
    year: 2012,
    pibBillions: 645.2,
    pibGrowthRealPct: 1.2,
    avgProductivityPerHour: 84.1,
    totalFteEmploymentMillions: 4.12,
    unemploymentRate: 2.9,
    exportBillions: 212.4,
    rdIntensityPct: 3.01,
    inflationPct: -0.7,
    totalPopulationMillions: 8.01,
    avgFertilityRate: 1.52,
    avgMortalityRate: 8.0,
    totalBirthsThousands: 82.2,
    totalDeathsThousands: 64.1,
    naturalBalanceThousands: 18.1,
    milestoneTitle: 'Consolidación post-crisis europea',
    milestoneDescription: 'La economía suiza mantiene un suelo de 1.20 CHF por EUR fijado por el Banco Nacional Suizo (BNS).'
  },
  2013: {
    year: 2013,
    pibBillions: 658.9,
    pibGrowthRealPct: 1.9,
    avgProductivityPerHour: 85.6,
    totalFteEmploymentMillions: 4.18,
    unemploymentRate: 3.2,
    exportBillions: 214.1,
    rdIntensityPct: 3.05,
    inflationPct: -0.2,
    totalPopulationMillions: 8.13,
    avgFertilityRate: 1.52,
    avgMortalityRate: 8.1,
    totalBirthsThousands: 82.7,
    totalDeathsThousands: 64.9,
    naturalBalanceThousands: 17.8,
    milestoneTitle: 'Expansión de servicios avanzados',
    milestoneDescription: 'Fuerte dinamismo del sector químico-farmacéutico y absorción del empleo cualificado internacional.'
  },
  2014: {
    year: 2014,
    pibBillions: 670.3,
    pibGrowthRealPct: 2.5,
    avgProductivityPerHour: 87.2,
    totalFteEmploymentMillions: 4.24,
    unemploymentRate: 3.0,
    exportBillions: 220.8,
    rdIntensityPct: 3.12,
    inflationPct: 0.0,
    totalPopulationMillions: 8.24,
    avgFertilityRate: 1.54,
    avgMortalityRate: 7.9,
    totalBirthsThousands: 85.3,
    totalDeathsThousands: 63.9,
    naturalBalanceThousands: 21.4,
    milestoneTitle: 'Récord de exportaciones industriales',
    milestoneDescription: 'Crecimiento de la demanda de maquinaria y tecnología médica en mercados de Norteamérica y Asia.'
  },
  2015: {
    year: 2015,
    pibBillions: 673.5,
    pibGrowthRealPct: 1.6,
    avgProductivityPerHour: 88.0,
    totalFteEmploymentMillions: 4.29,
    unemploymentRate: 3.3,
    exportBillions: 216.5,
    rdIntensityPct: 3.16,
    inflationPct: -1.1,
    totalPopulationMillions: 8.33,
    avgFertilityRate: 1.54,
    avgMortalityRate: 8.1,
    totalBirthsThousands: 86.6,
    totalDeathsThousands: 67.6,
    naturalBalanceThousands: 19.0,
    milestoneTitle: 'Desanclaje del Franco Suizo (Frankenschock)',
    milestoneDescription: 'El 15 de enero de 2015 el BNS elimina el tipo de cambio mínimo de 1.20 EUR/CHF; salto de productividad defensiva en la industria exportadora.'
  },
  2016: {
    year: 2016,
    pibBillions: 686.1,
    pibGrowthRealPct: 2.1,
    avgProductivityPerHour: 89.8,
    totalFteEmploymentMillions: 4.34,
    unemploymentRate: 3.3,
    exportBillions: 228.3,
    rdIntensityPct: 3.20,
    inflationPct: -0.4,
    totalPopulationMillions: 8.42,
    avgFertilityRate: 1.55,
    avgMortalityRate: 7.9,
    totalBirthsThousands: 87.9,
    totalDeathsThousands: 65.0,
    naturalBalanceThousands: 22.9,
    milestoneTitle: 'Ajuste estructural de alta gama',
    milestoneDescription: 'Reorientación hacia productos de ultra-alto valor añadido: biotecnología y alta relojería con márgenes resistentes.'
  },
  2017: {
    year: 2017,
    pibBillions: 701.2,
    pibGrowthRealPct: 1.8,
    avgProductivityPerHour: 91.5,
    totalFteEmploymentMillions: 4.39,
    unemploymentRate: 3.1,
    exportBillions: 240.2,
    rdIntensityPct: 3.24,
    inflationPct: 0.5,
    totalPopulationMillions: 8.48,
    avgFertilityRate: 1.52,
    avgMortalityRate: 8.0,
    totalBirthsThousands: 85.9,
    totalDeathsThousands: 66.9,
    naturalBalanceThousands: 19.0,
    milestoneTitle: 'Impulso del Crypto Valley en Zug',
    milestoneDescription: 'Suiza se consolida como epicentro global de fintech y criptoactivos con marco regulatorio pionero de la FINMA.'
  },
  2018: {
    year: 2018,
    pibBillions: 724.8,
    pibGrowthRealPct: 2.9,
    avgProductivityPerHour: 93.9,
    totalFteEmploymentMillions: 4.46,
    unemploymentRate: 2.5,
    exportBillions: 254.7,
    rdIntensityPct: 3.29,
    inflationPct: 0.9,
    totalPopulationMillions: 8.54,
    avgFertilityRate: 1.52,
    avgMortalityRate: 7.9,
    totalBirthsThousands: 87.8,
    totalDeathsThousands: 67.1,
    naturalBalanceThousands: 20.7,
    milestoneTitle: 'Máxima tasa de empleo y auge fabril',
    milestoneDescription: 'El desempleo cae al 2.5%, con récord histórico de ingresos por exportaciones farmacéuticas superando los 100.000 millones.'
  },
  2019: {
    year: 2019,
    pibBillions: 735.6,
    pibGrowthRealPct: 1.2,
    avgProductivityPerHour: 95.3,
    totalFteEmploymentMillions: 4.51,
    unemploymentRate: 2.3,
    exportBillions: 260.4,
    rdIntensityPct: 3.33,
    inflationPct: 0.4,
    totalPopulationMillions: 8.61,
    avgFertilityRate: 1.48,
    avgMortalityRate: 7.9,
    totalBirthsThousands: 86.2,
    totalDeathsThousands: 67.8,
    naturalBalanceThousands: 18.4,
    milestoneTitle: 'Reforma Fiscal y de Financiación (TRAF)',
    milestoneDescription: 'Modernización del marco tributario empresarial cantonal homologado con estándares de la OCDE.'
  },
  2020: {
    year: 2020,
    pibBillions: 712.4,
    pibGrowthRealPct: -2.4,
    avgProductivityPerHour: 94.6,
    totalFteEmploymentMillions: 4.47,
    unemploymentRate: 3.1,
    exportBillions: 245.9,
    rdIntensityPct: 3.38,
    inflationPct: -0.7,
    totalPopulationMillions: 8.67,
    avgFertilityRate: 1.46,
    avgMortalityRate: 8.8,
    totalBirthsThousands: 85.9,
    totalDeathsThousands: 76.2,
    naturalBalanceThousands: 9.7,
    milestoneTitle: 'Pandemia COVID-19 y amortiguador farmacéutico',
    milestoneDescription: 'Caída del PIB contenida al -2.4% (una de las más suaves de la OCDE) gracias al vigor de Roche, Novartis y Lonza (Moderna).'
  },
  2021: {
    year: 2021,
    pibBillions: 757.2,
    pibGrowthRealPct: 4.3,
    avgProductivityPerHour: 98.9,
    totalFteEmploymentMillions: 4.56,
    unemploymentRate: 2.6,
    exportBillions: 279.1,
    rdIntensityPct: 3.36,
    inflationPct: 0.6,
    totalPopulationMillions: 8.74,
    avgFertilityRate: 1.52,
    avgMortalityRate: 8.2,
    totalBirthsThousands: 89.6,
    totalDeathsThousands: 71.1,
    naturalBalanceThousands: 18.5,
    milestoneTitle: 'Rebote en V y liderazgo exportador',
    milestoneDescription: 'Rápida reapertura de la economía; auge del sector servicios digitales, gestión de patrimonios y compras industriales.'
  },
  2022: {
    year: 2022,
    pibBillions: 791.5,
    pibGrowthRealPct: 2.7,
    avgProductivityPerHour: 102.1,
    totalFteEmploymentMillions: 4.65,
    unemploymentRate: 2.2,
    exportBillions: 298.5,
    rdIntensityPct: 3.39,
    inflationPct: 2.8,
    totalPopulationMillions: 8.82,
    avgFertilityRate: 1.39,
    avgMortalityRate: 8.4,
    totalBirthsThousands: 82.4,
    totalDeathsThousands: 74.4,
    naturalBalanceThousands: 8.0,
    milestoneTitle: 'Estabilidad macro frente a la crisis energética europea',
    milestoneDescription: 'La inflación suiza (2.8%) se mantiene como la menor del mundo desarrollado gracias a la generación hidroeléctrica y nuclear.'
  },
  2023: {
    year: 2023,
    pibBillions: 812.8,
    pibGrowthRealPct: 0.8,
    avgProductivityPerHour: 104.4,
    totalFteEmploymentMillions: 4.72,
    unemploymentRate: 2.0,
    exportBillions: 304.2,
    rdIntensityPct: 3.42,
    inflationPct: 2.1,
    totalPopulationMillions: 8.90,
    avgFertilityRate: 1.33,
    avgMortalityRate: 8.1,
    totalBirthsThousands: 80.0,
    totalDeathsThousands: 72.0,
    naturalBalanceThousands: 8.0,
    milestoneTitle: 'Integración Credit Suisse - UBS y reestructuración',
    milestoneDescription: 'El gobierno federal facilita la absorción de Credit Suisse por UBS; la plaza financiera de Zúrich y Ginebra preserva el flujo de capital.'
  },
  2024: {
    year: 2024,
    pibBillions: 832.6,
    pibGrowthRealPct: 1.4,
    avgProductivityPerHour: 106.8,
    totalFteEmploymentMillions: 4.79,
    unemploymentRate: 2.3,
    exportBillions: 312.8,
    rdIntensityPct: 3.45,
    inflationPct: 1.3,
    totalPopulationMillions: 8.96,
    avgFertilityRate: 1.31,
    avgMortalityRate: 8.0,
    totalBirthsThousands: 79.5,
    totalDeathsThousands: 71.5,
    naturalBalanceThousands: 8.0,
    milestoneTitle: 'Consolidación de alta productividad e IA industrial',
    milestoneDescription: 'Suiza alcanza los 106.8 CHF/hora en productividad media; Zúrich y Basilea lideran la inversión mundial en patentes per cápita.'
  }
};

export const METRIC_DEFINITIONS: Record<MetricType, MetricDefinition> = {
  productivityPerHour: {
    id: 'productivityPerHour',
    label: 'Productividad Laboral',
    shortLabel: 'Productividad',
    unit: 'CHF / h',
    description: 'Valor Añadido Bruto generado por cada hora efectivamente trabajada.',
    format: (val) => `${val.toFixed(1)} CHF/h`
  },
  pibMillions: {
    id: 'pibMillions',
    label: 'PIB Regional Nominal',
    shortLabel: 'PIB Total',
    unit: 'M CHF',
    description: 'Producto Interior Bruto cantonal en millones de francos suizos.',
    format: (val) => `${(val / 1000).toFixed(1)}k M CHF`
  },
  pibPerCapita: {
    id: 'pibPerCapita',
    label: 'PIB per Cápita',
    shortLabel: 'PIB / hab.',
    unit: 'CHF',
    description: 'Nivel de riqueza regional por habitante residente.',
    format: (val) => `${Math.round(val).toLocaleString('de-CH')} CHF`
  },
  fteEmployment: {
    id: 'fteEmployment',
    label: 'Puestos Equivalentes a Tiempo Completo',
    shortLabel: 'Empleo FTE',
    unit: 'k FTE',
    description: 'Puestos de trabajo equivalentes a tiempo completo (FTE en miles).',
    format: (val) => `${val.toFixed(1)}k FTE`
  },
  rdIntensityPct: {
    id: 'rdIntensityPct',
    label: 'Intensidad en I+D',
    shortLabel: 'Gasto I+D',
    unit: '% PIB',
    description: 'Porcentaje del PIB regional destinado a investigación y desarrollo.',
    format: (val) => `${val.toFixed(2)}%`
  },
  fertilityRate: {
    id: 'fertilityRate',
    label: 'Tasa Global de Fecundidad',
    shortLabel: 'Fecundidad',
    unit: 'hijos / mujer',
    description: 'Promedio de hijos por mujer en edad fértil (BFS / OFS). Umbral de reemplazo generacional: 2.1.',
    format: (val) => `${val.toFixed(2)} hijos/m`
  },
  mortalityRate: {
    id: 'mortalityRate',
    label: 'Tasa Bruta de Mortalidad',
    shortLabel: 'Mortalidad',
    unit: '‰ (defunciones / 1k)',
    description: 'Defunciones registradas anualmente por cada 1.000 habitantes residentes (BFS).',
    format: (val) => `${val.toFixed(1)} ‰`
  },
  population: {
    id: 'population',
    label: 'Población Residente Permanente',
    shortLabel: 'Población',
    unit: 'habitantes',
    description: 'Número de habitantes censados con residencia permanente en el territorio.',
    format: (val) => `${Math.round(val).toLocaleString('de-CH')} hab.`
  }
};

// Helper to generate consistent, realistic 2012-2024 annual data for each canton
const POP_TO_CANTON_MAP: Record<number, CantonCode> = {
  1580000: 'ZH', 1055000: 'BE', 428000: 'LU', 37500: 'UR', 165000: 'SZ',
  39000: 'OW', 44500: 'NW', 41500: 'GL', 132000: 'ZG', 338000: 'FR',
  283000: 'SO', 206000: 'BS', 295000: 'BL', 86000: 'SH', 56000: 'AR',
  16500: 'AI', 528000: 'SG', 203000: 'GR', 715000: 'AG', 290000: 'TG',
  354000: 'TI', 835000: 'VD', 358000: 'VS', 178000: 'NE', 518000: 'GE',
  74000: 'JU'
};

const CANTON_DEMO_PROFILES: Record<string, { fertMult: number; mortRate: number }> = {
  AI: { fertMult: 1.18, mortRate: 7.9 },
  FR: { fertMult: 1.14, mortRate: 6.9 },
  VS: { fertMult: 1.10, mortRate: 7.8 },
  UR: { fertMult: 1.12, mortRate: 8.4 },
  SZ: { fertMult: 1.09, mortRate: 7.2 },
  JU: { fertMult: 1.08, mortRate: 8.7 },
  NW: { fertMult: 1.07, mortRate: 7.4 },
  OW: { fertMult: 1.08, mortRate: 7.5 },
  AR: { fertMult: 1.07, mortRate: 8.5 },
  LU: { fertMult: 1.05, mortRate: 7.4 },
  SG: { fertMult: 1.04, mortRate: 7.8 },
  AG: { fertMult: 1.04, mortRate: 7.7 },
  TG: { fertMult: 1.05, mortRate: 7.8 },
  VD: { fertMult: 1.02, mortRate: 7.2 },
  BE: { fertMult: 0.99, mortRate: 8.3 },
  SO: { fertMult: 1.01, mortRate: 8.5 },
  GL: { fertMult: 1.03, mortRate: 8.6 },
  ZG: { fertMult: 1.02, mortRate: 6.4 },
  ZH: { fertMult: 0.96, mortRate: 7.3 },
  GE: { fertMult: 0.94, mortRate: 7.1 },
  NE: { fertMult: 0.98, mortRate: 8.6 },
  BL: { fertMult: 0.98, mortRate: 8.9 },
  GR: { fertMult: 0.97, mortRate: 8.8 },
  SH: { fertMult: 0.98, mortRate: 9.3 },
  BS: { fertMult: 0.91, mortRate: 9.9 },
  TI: { fertMult: 0.86, mortRate: 10.1 }
};

function generateCantonTimeline(
  basePib2024: number,
  baseProd2024: number,
  baseFte2024: number,
  population2024: number,
  baseRd2024: number,
  sectorBase: [number, number, number],
  subsectors: {
    pharmaChemical: number;
    financeInsurance: number;
    precisionMEM: number;
    techServices: number;
    publicOther: number;
  }
) {
  const result: Record<number, any> = {};
  const cantonCode = POP_TO_CANTON_MAP[population2024] || 'ZH';
  const demoProfile = CANTON_DEMO_PROFILES[cantonCode] || { fertMult: 1.0, mortRate: 8.0 };
  
  // Annual growth curve calibration factor based on actual Swiss macro cycle
  const yearFactors: Record<number, { pibMult: number; prodMult: number; fteMult: number; unemp: number }> = {
    2012: { pibMult: 0.775, prodMult: 0.785, fteMult: 0.865, unemp: 3.1 },
    2013: { pibMult: 0.792, prodMult: 0.801, fteMult: 0.875, unemp: 3.3 },
    2014: { pibMult: 0.806, prodMult: 0.816, fteMult: 0.887, unemp: 3.1 },
    2015: { pibMult: 0.810, prodMult: 0.824, fteMult: 0.898, unemp: 3.4 },
    2016: { pibMult: 0.825, prodMult: 0.841, fteMult: 0.908, unemp: 3.3 },
    2017: { pibMult: 0.842, prodMult: 0.857, fteMult: 0.919, unemp: 3.2 },
    2018: { pibMult: 0.871, prodMult: 0.879, fteMult: 0.933, unemp: 2.6 },
    2019: { pibMult: 0.884, prodMult: 0.892, fteMult: 0.943, unemp: 2.4 },
    2020: { pibMult: 0.856, prodMult: 0.885, fteMult: 0.935, unemp: 3.2 },
    2021: { pibMult: 0.910, prodMult: 0.925, fteMult: 0.954, unemp: 2.7 },
    2022: { pibMult: 0.951, prodMult: 0.956, fteMult: 0.973, unemp: 2.3 },
    2023: { pibMult: 0.976, prodMult: 0.978, fteMult: 0.988, unemp: 2.1 },
    2024: { pibMult: 1.000, prodMult: 1.000, fteMult: 1.000, unemp: 2.3 }
  };

  for (let year = 2012; year <= 2024; year++) {
    const factor = yearFactors[year];
    const macroYear = MACRO_SWISS_YEARS[year];
    const pibMillions = Number((basePib2024 * factor.pibMult).toFixed(1));
    const pibRealMillions = Number((pibMillions * (1 / (1 + (year - 2012) * 0.007))).toFixed(1));
    const productivityPerHour = Number((baseProd2024 * factor.prodMult).toFixed(1));
    const fteEmployment = Number((baseFte2024 * factor.fteMult).toFixed(1));
    
    // Population trajectory based on Swiss BFS growth curve
    const pop = Math.round(population2024 * (0.894 + (year - 2012) * (0.106 / 12)));
    const prevPop = year > 2012 ? Math.round(population2024 * (0.894 + (year - 2013) * (0.106 / 12))) : pop * 0.991;
    const populationGrowthPct = Number((((pop - prevPop) / prevPop) * 100).toFixed(2));

    const pibPerCapita = Math.round((pibMillions * 1000000) / pop);
    const rdIntensityPct = Number((baseRd2024 * (0.88 + (year - 2012) * 0.01)).toFixed(2));

    // Demographic dynamics
    const fertilityRate = Number((macroYear.avgFertilityRate * demoProfile.fertMult).toFixed(2));
    const mortalityRate = Number(((macroYear.avgMortalityRate / 8.0) * demoProfile.mortRate).toFixed(1));
    const birthsCount = Math.round((pop * (fertilityRate * 7.15)) / 1000);
    const deathsCount = Math.round((pop * mortalityRate) / 1000);
    const naturalBalance = birthsCount - deathsCount;

    result[year] = {
      year,
      pibMillions,
      pibRealMillions,
      pibPerCapita,
      productivityPerHour,
      fteEmployment,
      unemploymentRate: factor.unemp,
      population: pop,
      populationGrowthPct,
      fertilityRate,
      mortalityRate,
      birthsCount,
      deathsCount,
      naturalBalance,
      rdIntensityPct,
      sectors: {
        primary: sectorBase[0],
        secondary: sectorBase[1],
        tertiary: sectorBase[2],
        subsectors: {
          pharmaChemical: Math.max(1, subsectors.pharmaChemical),
          financeInsurance: Math.max(2, subsectors.financeInsurance),
          precisionMEM: Math.max(3, subsectors.precisionMEM),
          techServices: Math.max(4, subsectors.techServices),
          publicOther: Math.max(5, 100 - (subsectors.pharmaChemical + subsectors.financeInsurance + subsectors.precisionMEM + subsectors.techServices))
        }
      }
    };
  }

  return result;
}

// Precise canton profiles with coordinates for our custom SVG Switzerland map
// Map coordinates in a 780 x 520 viewBox representing Switzerland geography
export const CANTONS_DATA: CantonProfile[] = [
  {
    code: 'ZH',
    name: 'Zürich',
    regionId: 'zurich',
    capital: 'Zürich',
    coordinates: { x: 440, y: 155 },
    specialization: 'Finanzas globales, Fintech, Inteligencia Artificial e Ingeniería de Software',
    topCompanies: ['UBS', 'Swiss Re', 'Google EMEA Hub', 'Zurich Insurance', 'ABB'],
    taxCompetitivenessRank: 5,
    history: generateCantonTimeline(148500, 102.5, 785.4, 1580000, 3.8, [1.1, 16.4, 82.5], {
      pharmaChemical: 4.8,
      financeInsurance: 28.5,
      precisionMEM: 9.2,
      techServices: 24.0,
      publicOther: 16.0
    })
  },
  {
    code: 'BE',
    name: 'Bern / Berne',
    regionId: 'mittelland',
    capital: 'Bern',
    coordinates: { x: 335, y: 260 },
    specialization: 'Administración federal, telecomunicaciones, energía e ingeniería médica',
    topCompanies: ['Swisscom', 'PostFinance', 'BKW Energie', 'Ypsomed', 'Insel Gruppe'],
    taxCompetitivenessRank: 19,
    history: generateCantonTimeline(84200, 89.2, 532.0, 1055000, 2.6, [2.8, 22.1, 75.1], {
      pharmaChemical: 5.5,
      financeInsurance: 12.0,
      precisionMEM: 14.8,
      techServices: 18.2,
      publicOther: 24.6
    })
  },
  {
    code: 'LU',
    name: 'Luzern',
    regionId: 'zentralschweiz',
    capital: 'Luzern',
    coordinates: { x: 405, y: 245 },
    specialization: 'Logística, turismo internacional, servicios de seguridad e ingeniería',
    topCompanies: ['Schindler', 'Komax', 'Emmi', 'Suva', 'Luzerner Kantonalbank'],
    taxCompetitivenessRank: 4,
    history: generateCantonTimeline(30500, 88.5, 215.0, 428000, 2.4, [3.2, 24.8, 72.0], {
      pharmaChemical: 3.5,
      financeInsurance: 14.2,
      precisionMEM: 18.5,
      techServices: 14.8,
      publicOther: 21.0
    })
  },
  {
    code: 'UR',
    name: 'Uri',
    regionId: 'zentralschweiz',
    capital: 'Altdorf',
    coordinates: { x: 450, y: 295 },
    specialization: 'Corredor alpino del Gotardo, turismo de lujo y metalurgia',
    topCompanies: ['Dätwyler', 'Andermatt Swiss Alps', 'Gotthard Bahninfrastruktur'],
    taxCompetitivenessRank: 14,
    history: generateCantonTimeline(2250, 77.0, 16.2, 37500, 1.8, [4.5, 30.5, 65.0], {
      pharmaChemical: 1.0,
      financeInsurance: 8.5,
      precisionMEM: 24.0,
      techServices: 9.5,
      publicOther: 22.0
    })
  },
  {
    code: 'SZ',
    name: 'Schwyz',
    regionId: 'zentralschweiz',
    capital: 'Schwyz',
    coordinates: { x: 465, y: 230 },
    specialization: 'Banca privada, navajas suizas (Victorinox), gestión patrimonial',
    topCompanies: ['Victorinox', 'Kühne + Nagel', 'Estée Lauder AG', 'Schwyzer KB'],
    taxCompetitivenessRank: 2,
    history: generateCantonTimeline(11800, 96.0, 74.5, 165000, 2.1, [2.5, 26.5, 71.0], {
      pharmaChemical: 4.2,
      financeInsurance: 22.0,
      precisionMEM: 19.5,
      techServices: 14.3,
      publicOther: 11.0
    })
  },
  {
    code: 'OW',
    name: 'Obwalden',
    regionId: 'zentralschweiz',
    capital: 'Sarnen',
    coordinates: { x: 385, y: 285 },
    specialization: 'Motores de ultra-precisión espacial (micromotores) y turismo',
    topCompanies: ['Maxon Motor', 'Leister Technologies', 'Pilatus Bahnen'],
    taxCompetitivenessRank: 3,
    history: generateCantonTimeline(2780, 83.2, 19.8, 39000, 2.2, [4.0, 34.0, 62.0], {
      pharmaChemical: 2.0,
      financeInsurance: 10.5,
      precisionMEM: 28.5,
      techServices: 11.0,
      publicOther: 10.0
    })
  },
  {
    code: 'NW',
    name: 'Nidwalden',
    regionId: 'zentralschweiz',
    capital: 'Stans',
    coordinates: { x: 420, y: 275 },
    specialization: 'Aviación de negocios y defensa (Pilatus Aircraft)',
    topCompanies: ['Pilatus Aircraft', 'Schurter Holding', 'Nidwaldner KB'],
    taxCompetitivenessRank: 1,
    history: generateCantonTimeline(3450, 99.8, 24.2, 44500, 2.5, [2.2, 36.8, 61.0], {
      pharmaChemical: 1.5,
      financeInsurance: 12.5,
      precisionMEM: 32.0,
      techServices: 11.0,
      publicOther: 4.0
    })
  },
  {
    code: 'GL',
    name: 'Glarus',
    regionId: 'ostschweiz',
    capital: 'Glarus',
    coordinates: { x: 520, y: 235 },
    specialization: 'Chocolatería de lujo (Läderach), hidroeléctricas e ingeniería',
    topCompanies: ['Läderach Chocolatier', 'Netstal Maschinen', 'Axpo Hydro'],
    taxCompetitivenessRank: 13,
    history: generateCantonTimeline(3120, 81.0, 21.5, 41500, 2.0, [3.8, 34.2, 62.0], {
      pharmaChemical: 3.5,
      financeInsurance: 7.5,
      precisionMEM: 26.0,
      techServices: 10.0,
      publicOther: 15.0
    })
  },
  {
    code: 'ZG',
    name: 'Zug',
    regionId: 'zentralschweiz',
    capital: 'Zug',
    coordinates: { x: 435, y: 215 },
    specialization: 'Crypto Valley, trading global de commodities, farmacéutica y holdings',
    topCompanies: ['Glencore', 'Roche Diagnostics (Rotkreuz)', 'Partners Group', 'Ethereum Foundation', 'Siemens Smart Infra'],
    taxCompetitivenessRank: 1,
    history: generateCantonTimeline(23800, 138.4, 118.5, 132000, 4.4, [0.6, 22.4, 77.0], {
      pharmaChemical: 16.5,
      financeInsurance: 26.0,
      precisionMEM: 12.5,
      techServices: 28.0,
      publicOther: -6.0 // normalized
    })
  },
  {
    code: 'FR',
    name: 'Fribourg / Freiburg',
    regionId: 'mittelland',
    capital: 'Fribourg',
    coordinates: { x: 285, y: 295 },
    specialization: 'Biotecnología agroalimentaria, polímeros avanzados y logística',
    topCompanies: ['Scott Sports', 'Liebherr Machines', 'Nespresso Centro'],
    taxCompetitivenessRank: 15,
    history: generateCantonTimeline(20800, 80.4, 138.2, 335000, 2.7, [3.8, 27.2, 69.0], {
      pharmaChemical: 6.2,
      financeInsurance: 10.5,
      precisionMEM: 18.0,
      techServices: 14.3,
      publicOther: 20.0
    })
  },
  {
    code: 'SO',
    name: 'Solothurn',
    regionId: 'mittelland',
    capital: 'Solothurn',
    coordinates: { x: 330, y: 195 },
    specialization: 'Tecnología médica implantable, componentes de precisión y relojería',
    topCompanies: ['Synthes (J&J MedTech)', 'Mathys Medical', 'Bielomatik'],
    taxCompetitivenessRank: 18,
    history: generateCantonTimeline(19500, 84.5, 126.0, 283000, 2.9, [1.8, 35.2, 63.0], {
      pharmaChemical: 8.5,
      financeInsurance: 9.0,
      precisionMEM: 27.5,
      techServices: 12.0,
      publicOther: 6.0
    })
  },
  {
    code: 'BS',
    name: 'Basel-Stadt',
    regionId: 'nordwestschweiz',
    capital: 'Basel',
    coordinates: { x: 330, y: 140 },
    specialization: 'Capital mundial de las ciencias de la vida, farmacéutica e I+D',
    topCompanies: ['Novartis', 'F. Hoffmann-La Roche', 'Lonza Group', 'Baloise', 'Straumann'],
    taxCompetitivenessRank: 7,
    history: generateCantonTimeline(42500, 168.2, 195.4, 203000, 7.8, [0.2, 38.8, 61.0], {
      pharmaChemical: 38.5,
      financeInsurance: 16.0,
      precisionMEM: 6.5,
      techServices: 18.0,
      publicOther: -18.0
    })
  },
  {
    code: 'BL',
    name: 'Basel-Landschaft',
    regionId: 'nordwestschweiz',
    capital: 'Liestal',
    coordinates: { x: 345, y: 165 },
    specialization: 'Industria química fina, componentes de laboratorio y biotecnología',
    topCompanies: ['Endress+Hauser', 'Bachem', 'Rondo', 'Basellandschaftliche KB'],
    taxCompetitivenessRank: 16,
    history: generateCantonTimeline(22400, 93.6, 134.0, 296000, 3.6, [1.5, 33.5, 65.0], {
      pharmaChemical: 22.0,
      financeInsurance: 11.0,
      precisionMEM: 16.5,
      techServices: 14.5,
      publicOther: 1.0
    })
  },
  {
    code: 'SH',
    name: 'Schaffhausen',
    regionId: 'ostschweiz',
    capital: 'Schaffhausen',
    coordinates: { x: 450, y: 105 },
    specialization: 'Relojería de lujo (IWC), sistemas de tuberías y maquinaria (GF)',
    topCompanies: ['IWC Schaffhausen', 'Georg Fischer', 'Unilever Europe HQ'],
    taxCompetitivenessRank: 6,
    history: generateCantonTimeline(7950, 92.4, 46.5, 86000, 2.9, [1.8, 31.2, 67.0], {
      pharmaChemical: 4.5,
      financeInsurance: 11.5,
      precisionMEM: 25.0,
      techServices: 16.0,
      publicOther: 10.0
    })
  },
  {
    code: 'AR',
    name: 'Appenzell Ausserrhoden',
    regionId: 'ostschweiz',
    capital: 'Herisau',
    coordinates: { x: 550, y: 175 },
    specialization: 'Microtecnología, componentes electrónicos y medicina natural',
    topCompanies: ['Huber+Suhner', 'Metrohm', 'Tisca'],
    taxCompetitivenessRank: 10,
    history: generateCantonTimeline(3450, 81.2, 23.5, 56000, 2.3, [3.5, 32.5, 64.0], {
      pharmaChemical: 5.0,
      financeInsurance: 9.0,
      precisionMEM: 25.0,
      techServices: 12.0,
      publicOther: 13.0
    })
  },
  {
    code: 'AI',
    name: 'Appenzell Innerrhoden',
    regionId: 'ostschweiz',
    capital: 'Appenzell',
    coordinates: { x: 565, y: 190 },
    specialization: 'Tecnología médica, turismo de senderismo y productos lácteos',
    topCompanies: ['Appenzeller Käse', 'Brauerei Locher', 'Innerrhoder KB'],
    taxCompetitivenessRank: 9,
    history: generateCantonTimeline(1120, 80.5, 8.8, 16500, 1.9, [6.5, 28.5, 65.0], {
      pharmaChemical: 2.0,
      financeInsurance: 11.0,
      precisionMEM: 20.0,
      techServices: 12.0,
      publicOther: 20.0
    })
  },
  {
    code: 'SG',
    name: 'St. Gallen',
    regionId: 'ostschweiz',
    capital: 'St. Gallen',
    coordinates: { x: 535, y: 180 },
    specialization: 'Ingeniería MEM, gestión empresarial (HSG), óptica y software',
    topCompanies: ['Bühler Group', 'Geberit', 'Leica Geosystems', 'SFS Group'],
    taxCompetitivenessRank: 12,
    history: generateCantonTimeline(41200, 87.8, 268.0, 528000, 3.1, [2.5, 32.5, 65.0], {
      pharmaChemical: 4.8,
      financeInsurance: 13.2,
      precisionMEM: 26.5,
      techServices: 15.5,
      publicOther: 5.0
    })
  },
  {
    code: 'GR',
    name: 'Graubünden / Grisons',
    regionId: 'ostschweiz',
    capital: 'Chur',
    coordinates: { x: 575, y: 285 },
    specialization: 'Turismo alpino de élite (St. Moritz, Davos), sensores y energía hidroeléctrica',
    topCompanies: ['EMS-Chemie', 'Hamilton Medical', 'Weisse Arena', 'Repower'],
    taxCompetitivenessRank: 11,
    history: generateCantonTimeline(16200, 79.5, 112.0, 204000, 2.7, [3.2, 23.8, 73.0], {
      pharmaChemical: 9.5,
      financeInsurance: 10.0,
      precisionMEM: 16.5,
      techServices: 13.0,
      publicOther: 24.0
    })
  },
  {
    code: 'AG',
    name: 'Aargau',
    regionId: 'nordwestschweiz',
    capital: 'Aarau',
    coordinates: { x: 390, y: 155 },
    specialization: 'Generación energética, semiconductores de potencia e industria plástica',
    topCompanies: ['Hitachi Energy (ABB Power)', 'Axpo Holding', 'Rockwell Automation', 'Franke'],
    taxCompetitivenessRank: 8,
    history: generateCantonTimeline(47500, 92.5, 318.0, 715000, 3.3, [1.6, 33.4, 65.0], {
      pharmaChemical: 12.0,
      financeInsurance: 10.2,
      precisionMEM: 24.8,
      techServices: 14.0,
      publicOther: 4.0
    })
  },
  {
    code: 'TG',
    name: 'Thurgau',
    regionId: 'ostschweiz',
    capital: 'Frauenfeld',
    coordinates: { x: 495, y: 140 },
    specialization: 'Vehículos ferroviarios (Stadler Rail), empaquetado y electrónica',
    topCompanies: ['Stadler Rail', 'SIG Group', 'Model Holding', 'Thurgauer KB'],
    taxCompetitivenessRank: 10,
    history: generateCantonTimeline(19200, 84.6, 134.5, 290000, 2.6, [3.2, 34.8, 62.0], {
      pharmaChemical: 4.2,
      financeInsurance: 9.5,
      precisionMEM: 29.5,
      techServices: 12.8,
      publicOther: 6.0
    })
  },
  {
    code: 'TI',
    name: 'Ticino',
    regionId: 'ticino',
    capital: 'Bellinzona',
    coordinates: { x: 460, y: 395 },
    specialization: 'Centro financiero de la Suiza italiana, biofarmacia, moda y logística',
    topCompanies: ['Helsinn Healthcare', 'BancaStato', 'VF Corporation EMEA', 'Kering Logistics', 'Cerios'],
    taxCompetitivenessRank: 20,
    history: generateCantonTimeline(33800, 82.5, 218.0, 354000, 2.8, [1.2, 21.8, 77.0], {
      pharmaChemical: 11.5,
      financeInsurance: 17.5,
      precisionMEM: 12.0,
      techServices: 17.0,
      publicOther: 19.0
    })
  },
  {
    code: 'VD',
    name: 'Vaud',
    regionId: 'lemanique',
    capital: 'Lausanne',
    coordinates: { x: 205, y: 335 },
    specialization: 'Nutrición global (Nestlé), ecosistema DeepTech EPFL, Medtech y ciberseguridad',
    topCompanies: ['Nestlé', 'Logitech', 'EPFL Innovation Park', 'Kudelski', 'Bobst'],
    taxCompetitivenessRank: 17,
    history: generateCantonTimeline(63500, 97.4, 385.0, 840000, 4.1, [1.5, 18.5, 80.0], {
      pharmaChemical: 10.5,
      financeInsurance: 15.2,
      precisionMEM: 11.8,
      techServices: 26.5,
      publicOther: 16.0
    })
  },
  {
    code: 'VS',
    name: 'Valais / Wallis',
    regionId: 'lemanique',
    capital: 'Sion',
    coordinates: { x: 300, y: 390 },
    specialization: 'Biomanufactura farmacéutica (Lonza Visp), hidroelectricidad y aluminio',
    topCompanies: ['Lonza (Visp Biocampus)', 'Alcan Constellium', 'Hydro Exploitation', 'Noveldis'],
    taxCompetitivenessRank: 22,
    history: generateCantonTimeline(21500, 87.5, 142.0, 360000, 3.4, [3.2, 28.8, 68.0], {
      pharmaChemical: 18.5,
      financeInsurance: 8.5,
      precisionMEM: 13.0,
      techServices: 14.0,
      publicOther: 14.0
    })
  },
  {
    code: 'NE',
    name: 'Neuchâtel',
    regionId: 'mittelland',
    capital: 'Neuchâtel',
    coordinates: { x: 235, y: 250 },
    specialization: 'Alta relojería suiza, centros de I+D en microtecnología (CSEM) y tabaco',
    topCompanies: ['CSEM', 'Cartier / Richemont', 'Panerai', 'Philip Morris International R&D', 'Baxter'],
    taxCompetitivenessRank: 23,
    history: generateCantonTimeline(17800, 96.5, 96.5, 178000, 5.2, [1.4, 37.6, 61.0], {
      pharmaChemical: 7.5,
      financeInsurance: 8.5,
      precisionMEM: 36.0,
      techServices: 18.0,
      publicOther: -9.0
    })
  },
  {
    code: 'GE',
    name: 'Genève',
    regionId: 'lemanique',
    capital: 'Genève',
    coordinates: { x: 140, y: 390 },
    specialization: 'Ginebra internacional, banca privada, trading de materias primas y fragancias',
    topCompanies: ['Rolex', 'Patek Philippe', 'Givaudan', 'Firmenich (dsm-firmenich)', 'Pictet & Cie', 'Lombard Odier', 'Trafigura'],
    taxCompetitivenessRank: 21,
    history: generateCantonTimeline(61800, 118.2, 335.0, 520000, 4.3, [0.3, 14.7, 85.0], {
      pharmaChemical: 12.0,
      financeInsurance: 27.5,
      precisionMEM: 12.5,
      techServices: 22.0,
      publicOther: 11.0
    })
  },
  {
    code: 'JU',
    name: 'Jura',
    regionId: 'mittelland',
    capital: 'Delémont',
    coordinates: { x: 260, y: 175 },
    specialization: 'Mecanizado de súper-precisión para relojería y tecnología médica',
    topCompanies: ['Louis Vuitton Horlogerie', 'Tornos', 'Wenger', 'Biwi'],
    taxCompetitivenessRank: 24,
    history: generateCantonTimeline(5200, 78.4, 34.8, 74000, 2.7, [3.2, 41.8, 55.0], {
      pharmaChemical: 4.5,
      financeInsurance: 6.5,
      precisionMEM: 38.0,
      techServices: 11.0,
      publicOther: -5.0
    })
  }
];

// Get regional aggregated metrics for any given year
export function getRegionAggregates(regionId: RegionId, year: number) {
  const cantonsInRegion = CANTONS_DATA.filter(c => c.regionId === regionId);
  const totalPib = cantonsInRegion.reduce((sum, c) => sum + (c.history[year]?.pibMillions || 0), 0);
  const totalFte = cantonsInRegion.reduce((sum, c) => sum + (c.history[year]?.fteEmployment || 0), 0);
  const weightedProd = cantonsInRegion.reduce(
    (sum, c) => sum + (c.history[year]?.productivityPerHour || 0) * (c.history[year]?.fteEmployment || 0),
    0
  ) / (totalFte || 1);
  const totalPop = cantonsInRegion.reduce((sum, c) => sum + (c.history[year]?.population || 0), 0);
  
  const weightedFert = cantonsInRegion.reduce(
    (sum, c) => sum + (c.history[year]?.fertilityRate || 0) * (c.history[year]?.population || 0),
    0
  ) / (totalPop || 1);
  const weightedMort = cantonsInRegion.reduce(
    (sum, c) => sum + (c.history[year]?.mortalityRate || 0) * (c.history[year]?.population || 0),
    0
  ) / (totalPop || 1);
  const totalBirths = cantonsInRegion.reduce((sum, c) => sum + (c.history[year]?.birthsCount || 0), 0);
  const totalDeaths = cantonsInRegion.reduce((sum, c) => sum + (c.history[year]?.deathsCount || 0), 0);

  return {
    region: GREAT_REGIONS[regionId],
    cantons: cantonsInRegion,
    totalPib,
    totalFte,
    productivityPerHour: Number(weightedProd.toFixed(1)),
    pibPerCapita: Math.round((totalPib * 1000000) / (totalPop || 1)),
    totalPop,
    fertilityRate: Number(weightedFert.toFixed(2)),
    mortalityRate: Number(weightedMort.toFixed(1)),
    totalBirths,
    totalDeaths,
    naturalBalance: totalBirths - totalDeaths
  };
}
