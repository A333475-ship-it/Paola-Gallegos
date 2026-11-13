import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Info } from 'lucide-react';
import { MACRO_SWISS_YEARS } from '../data/swissEconomicData';

interface TimelineScrubberProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onToggleSpeed: () => void;
}

const YEARS = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  currentYear,
  onYearChange,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onToggleSpeed,
}) => {
  // Timer loop for playback
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 1600 / playbackSpeed;
    const timer = setInterval(() => {
      onYearChange(currentYear >= 2024 ? 2012 : currentYear + 1);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isPlaying, currentYear, playbackSpeed, onYearChange]);

  const progressPct = ((currentYear - 2012) / (2024 - 2012)) * 100;
  const currentMacro = MACRO_SWISS_YEARS[currentYear];

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-3.5 lg:p-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] mb-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        {/* Temporal control buttons and active year tag */}
        <div className="flex items-center gap-2.5">
          {/* Play / Pause button (28px x 28px square-icon button per design spec) */}
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pausar reproducción temporal' : 'Reproducir serie histórica'}
            title={isPlaying ? 'Pausar' : 'Reproducir'}
            className="w-7 h-7 flex items-center justify-center bg-[#D93856] hover:bg-[#E05370] text-white rounded-[4px] transition-colors shadow-sm shrink-0"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
          </button>

          {/* Reset button */}
          <button
            onClick={() => onYearChange(2012)}
            title="Volver al año base 2012"
            className="w-7 h-7 flex items-center justify-center bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#515F74] hover:text-[#0F172A] border border-[#E2E8F0] rounded-[4px] transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed toggle */}
          <button
            onClick={onToggleSpeed}
            title="Alternar velocidad de animación"
            className="h-7 px-2 text-[11px] font-medium text-[#334155] bg-[#FFFFFF] border border-[#E2E8F0] rounded-[4px] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1 shrink-0 tabular-nums"
          >
            <FastForward className="w-3 h-3 text-[#64748B]" />
            <span>{playbackSpeed}x</span>
          </button>

          {/* Active year display */}
          <div className="flex items-baseline gap-2 pl-1.5 border-l border-[#E2E8F0]">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#64748B]">
              Período de Análisis
            </span>
            <span className="text-xl font-bold tracking-tight text-[#0F172A] tabular-nums">
              {currentYear}
            </span>
            <span className="text-xs text-[#94A3B8] font-medium hidden sm:inline">
              (Serie oficial BFS / SECO)
            </span>
          </div>
        </div>

        {/* Milestone Callout for current year */}
        {currentMacro?.milestoneTitle && (
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px] text-xs text-[#334155] max-w-xl">
            <Info className="w-3.5 h-3.5 text-[#D93856] shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-[#0F172A]">{currentMacro.milestoneTitle}: </span>
              <span className="text-[#64748B]">{currentMacro.milestoneDescription}</span>
            </div>
          </div>
        )}
      </div>

      {/* Scrubber Rail & Handle matching design specs */}
      <div className="relative pt-2 pb-1">
        {/* Track Rail: 4px track styled in precision-border (#E2E8F0) with played segment in #D93856 */}
        <div className="relative w-full h-1 bg-[#E2E8F0] rounded-full cursor-pointer overflow-hidden">
          <div
            className="h-full bg-[#D93856] transition-all duration-200"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Interactive native input overlay with opacity for precise drag */}
        <input
          type="range"
          min={2012}
          max={2024}
          step={1}
          value={currentYear}
          onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
          className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer z-10 -top-1"
          aria-label="Seleccionar año del informe"
        />

        {/* Custom Visual Thumb Indicator */}
        <div
          className="absolute top-1 pointer-events-none transition-all duration-200 -translate-x-1/2"
          style={{ left: `${progressPct}%` }}
        >
          {/* 14px circular disc in #FFFFFF with a 2px #D93856 ring and a delicate ambient shadow */}
          <div className="w-3.5 h-3.5 rounded-full bg-[#FFFFFF] border-2 border-[#D93856] shadow-[0_2px_4px_rgba(15,23,42,0.18)]" />
        </div>

        {/* Year Tick Marks (Tabular Figures) */}
        <div className="flex justify-between items-center mt-2.5 px-0.5">
          {YEARS.map((yr) => {
            const isSelected = yr === currentYear;
            const isMilestone = [2012, 2015, 2020, 2024].includes(yr);
            return (
              <button
                key={yr}
                onClick={() => onYearChange(yr)}
                className={`flex flex-col items-center group transition-colors focus:outline-none ${
                  isSelected ? 'text-[#D93856] font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <span
                  className={`text-[11px] tabular-nums ${
                    isSelected ? 'font-bold' : isMilestone ? 'font-medium text-[#334155]' : 'font-normal'
                  }`}
                >
                  {yr}
                </span>
                <span
                  className={`w-0.5 mt-0.5 rounded-full transition-all ${
                    isSelected
                      ? 'h-2 bg-[#D93856]'
                      : isMilestone
                      ? 'h-1.5 bg-[#94A3B8]'
                      : 'h-1 bg-[#CBD5E1] group-hover:bg-[#94A3B8]'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
