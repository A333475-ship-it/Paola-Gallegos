import React from 'react';
import { CantonProfile, RegionId } from '../types/dashboard';
import { CANTONS_DATA, GREAT_REGIONS } from '../data/swissEconomicData';
import { PieChart, Briefcase } from 'lucide-react';

interface SectorialBreakdownChartProps {
  currentYear: number;
  selectedCanton: CantonProfile | null;
  selectedRegionId: RegionId | 'all';
}

export const SectorialBreakdownChart: React.FC<SectorialBreakdownChartProps> = ({
  currentYear,
  selectedCanton,
  selectedRegionId,
}) => {
  // Aggregate sectors based on active selection (Canton, Region, or National)
  let pharmaChemical = 0;
  let financeInsurance = 0;
  let precisionMEM = 0;
  let techServices = 0;
  let publicOther = 0;
  let contextTitle = 'Media Nacional Suiza';

  if (selectedCanton) {
    const s = selectedCanton.history[currentYear]?.sectors.subsectors;
    if (s) {
      pharmaChemical = s.pharmaChemical;
      financeInsurance = s.financeInsurance;
      precisionMEM = s.precisionMEM;
      techServices = s.techServices;
      publicOther = s.publicOther;
    }
    contextTitle = `Cantón ${selectedCanton.name} (${selectedCanton.code})`;
  } else if (selectedRegionId !== 'all') {
    const cantons = CANTONS_DATA.filter((c) => c.regionId === selectedRegionId);
    const count = cantons.length || 1;
    cantons.forEach((c) => {
      const s = c.history[currentYear]?.sectors.subsectors;
      if (s) {
        pharmaChemical += s.pharmaChemical;
        financeInsurance += s.financeInsurance;
        precisionMEM += s.precisionMEM;
        techServices += s.techServices;
        publicOther += s.publicOther;
      }
    });
    pharmaChemical = Number((pharmaChemical / count).toFixed(1));
    financeInsurance = Number((financeInsurance / count).toFixed(1));
    precisionMEM = Number((precisionMEM / count).toFixed(1));
    techServices = Number((techServices / count).toFixed(1));
    publicOther = Number((publicOther / count).toFixed(1));
    contextTitle = GREAT_REGIONS[selectedRegionId]?.nameEs;
  } else {
    // National average weighted
    pharmaChemical = 12.8;
    financeInsurance = 18.4;
    precisionMEM = 19.2;
    techServices = 21.6;
    publicOther = 28.0;
  }

  // Normalize to 100%
  const total = pharmaChemical + financeInsurance + precisionMEM + techServices + publicOther;
  const sectors = [
    {
      id: 'pharma',
      name: 'Ciencias de la Vida y Farmacéutica',
      pct: ((pharmaChemical / total) * 100).toFixed(1),
      rawPct: pharmaChemical,
      color: '#D93856', // Swiss Rose / Crimson
      companies: 'Roche, Novartis, Lonza, Bachem',
      desc: 'Sector de ultra-alta productividad (>160 CHF/h).',
    },
    {
      id: 'finance',
      name: 'Banca, Seguros y Wealth Management',
      pct: ((financeInsurance / total) * 100).toFixed(1),
      rawPct: financeInsurance,
      color: '#334155', // Slate Navy
      companies: 'UBS, Swiss Re, Zurich Ins., Pictet',
      desc: 'Pilar financiero de Zúrich y Ginebra.',
    },
    {
      id: 'tech',
      name: 'Tecnología, Trading e Inteligencia Artificial',
      pct: ((techServices / total) * 100).toFixed(1),
      rawPct: techServices,
      color: '#E05370', // Rose Vibrance
      companies: 'Google EMEA, Glencore, Logitech, EPFL',
      desc: 'Crecimiento más rápido en empleo FTE de alta cualificación.',
    },
    {
      id: 'mem',
      name: 'Industria MEM y Relojería de Precisión',
      pct: ((precisionMEM / total) * 100).toFixed(1),
      rawPct: precisionMEM,
      color: '#64748B', // Precision Slate
      companies: 'Rolex, Swatch, ABB, Bühler, Stadler',
      desc: 'Corazón exportador del Arco del Jura y Suiza Oriental.',
    },
    {
      id: 'public',
      name: 'Administración, Salud y Servicios Locales',
      pct: ((publicOther / total) * 100).toFixed(1),
      rawPct: publicOther,
      color: '#94A3B8', // Precision Muted
      companies: 'Insel Gruppe, CHUV, SBB/CFF, Administración',
      desc: 'Servicios de soporte y cohesión territorial.',
    },
  ];

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 lg:p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-[#F1F5F9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#64748B]">
              Composición Económica Estructural
            </span>
            <span className="text-[#CBD5E1]">·</span>
            <span className="text-xs font-semibold text-[#D93856]">
              {contextTitle}
            </span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-[#0F172A] mt-0.5">
            Desglose del Valor Añadido Bruto (VAB) por Sectores Clave
          </h2>
        </div>
      </div>

      {/* Segmented Stacked Progress Bar */}
      <div className="mb-4">
        <div className="h-3 w-full rounded-[3px] overflow-hidden flex shadow-inner bg-[#F1F5F9]">
          {sectors.map((sec) => (
            <div
              key={sec.id}
              style={{
                width: `${sec.pct}%`,
                backgroundColor: sec.color,
              }}
              title={`${sec.name}: ${sec.pct}%`}
              className="h-full transition-all duration-300 relative group cursor-pointer hover:opacity-90"
            />
          ))}
        </div>
      </div>

      {/* High-Density Sector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sectors.map((sec) => (
          <div
            key={sec.id}
            className="p-3 rounded-[4px] border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-[2px] shrink-0"
                    style={{ backgroundColor: sec.color }}
                  />
                  <span className="text-xs font-semibold text-[#0F172A] truncate">
                    {sec.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-[#0F172A] tabular-nums shrink-0">
                  {sec.pct}%
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mb-2">{sec.desc}</p>
            </div>

            <div className="pt-2 border-t border-[#F1F5F9] text-[10px] text-[#94A3B8] truncate">
              <span className="font-semibold text-[#515F74]">Líderes: </span>
              {sec.companies}
            </div>
          </div>
        ))}

        {/* Informative Benchmark Box */}
        <div className="p-3 rounded-[4px] border border-dashed border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#334155] mb-1">
            <Briefcase className="w-3.5 h-3.5 text-[#D93856]" />
            <span>Elasticidad de Productividad</span>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Las regiones con cuota en Farma y Fintech &gt;35% (Basilea y Zúrich) experimentan una prima de productividad del +42% frente a la media nacional suiza.
          </p>
          <span className="text-[10px] font-medium text-[#D93856] uppercase tracking-wider mt-1">
            Resiliencia Estructural Supranacional
          </span>
        </div>
      </div>
    </div>
  );
};
