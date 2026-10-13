import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Filter, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { SearchFilters } from '../types';

interface ZeroStateSearchProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading: boolean;
}

const POPULAR_NICHES = [
  'Pizzarias',
  'Clínica Odontológica',
  'Barbearias',
  'Oficina Mecânica',
  'Pet Shop',
  'Estética & Beleza',
  'Marcenaria',
  'Restaurantes',
];

const POPULAR_LOCATIONS = [
  'São Paulo - SP',
  'Rio de Janeiro - RJ',
  'Belo Horizonte - MG',
  'Curitiba - PR',
  'Porto Alegre - RS',
  'Santos - SP',
];

export const ZeroStateSearch: React.FC<ZeroStateSearchProps> = ({ onSearch, isLoading }) => {
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('');
  const [onlyWithoutWebsite, setOnlyWithoutWebsite] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim() && !location.trim()) {
      onSearch({
        niche: 'Comércio Local',
        location: 'São Paulo',
        onlyWithoutWebsite,
        minRating: 4.0,
      });
      return;
    }
    onSearch({
      niche: niche.trim(),
      location: location.trim(),
      onlyWithoutWebsite,
      minRating: 4.0,
    });
  };

  const handleQuickSelect = (nicheVal: string, locVal?: string) => {
    setNiche(nicheVal);
    if (locVal) setLocation(locVal);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Subtle purple radial background lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10 flex flex-col items-center text-center">
        {/* Editorial Subtitle / Kicker */}
        <div className="flex items-center gap-2 text-xs font-medium text-purple-400 mb-3 tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Scanner de Oportunidades Google Maps</span>
        </div>

        {/* Clean Hero Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mb-4 text-balance">
          Encontre empresas no Google Maps que <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">ainda não têm site</span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mb-10 text-balance">
          Digite a área ou cidade desejada. Varremos as listagens oficiais para entregar leads qualificados com WhatsApp e Instagram prontos para abordagem comercial.
        </p>

        {/* The Requested Central Search Box */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-[#0d0a17]/90 border border-purple-900/40 hover:border-purple-600/60 transition-all rounded-2xl p-3 sm:p-4 shadow-2xl shadow-purple-950/30"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {/* Campo Nicho */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Briefcase className="w-4 h-4 text-purple-400" />
              </div>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Nicho (ex: Pizzarias, Mecânicas...)"
                className="w-full pl-10 pr-4 py-3 bg-[#07050d] border border-purple-950/60 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>

            {/* Campo Localização / Cidade */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <MapPin className="w-4 h-4 text-purple-400" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Cidade ou Região (ex: Moema - SP)"
                className="w-full pl-10 pr-4 py-3 bg-[#07050d] border border-purple-950/60 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-purple-950/40">
            {/* Filtro sem site */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300 select-none">
              <input
                type="checkbox"
                checked={onlyWithoutWebsite}
                onChange={(e) => setOnlyWithoutWebsite(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-0"
              />
              <span className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-purple-400" />
                Filtrar apenas negócios sem site oficial
              </span>
            </label>

            {/* Botão de Busca */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                  <span>Escaneando Google Maps...</span>
                </>
              ) : (
                <>
                  <span>Varrer Google Maps</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sugestões Rápidas de Nicho */}
        <div className="mt-8 w-full max-w-2xl">
          <div className="text-xs text-neutral-500 mb-2.5">Exemplos populares para prospectar:</div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {POPULAR_NICHES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleQuickSelect(n, location || 'São Paulo')}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#0d0a17] hover:bg-purple-950/60 border border-purple-950/50 hover:border-purple-700/50 text-neutral-300 transition-colors"
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Sugestões de Região */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500">
          <span>Cidades rápidas:</span>
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocation(loc)}
              className="hover:text-purple-300 underline underline-offset-4 decoration-purple-800/60 transition-colors"
            >
              {loc}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
