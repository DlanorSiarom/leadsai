import React from 'react';
import { Search, Kanban, BarChart3, FileText, Sparkles, ShieldCheck, Crown } from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  activeTab: 'search' | 'leads' | 'crm' | 'dashboard' | 'scripts';
  setActiveTab: (tab: 'search' | 'leads' | 'crm' | 'dashboard' | 'scripts') => void;
  user: UserAccount;
  onOpenPaywall: () => void;
  crmCount: number;
  leadsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenPaywall,
  crmCount,
  leadsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-950/40 bg-[#07050d]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('search')}
          className="flex items-center gap-2.5 text-left focus:outline-none group whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-purple-900/40 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-purple-200" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              LeadMaps <span className="text-purple-400">Pro</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'search'
                ? 'text-purple-400 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Search className="w-4 h-4" />
            Scanner
          </button>

          {leadsCount > 0 && (
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'leads'
                  ? 'text-purple-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Leads
              <span className="text-xs font-mono text-purple-400">({leadsCount})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('crm')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'crm'
                ? 'text-purple-400 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Kanban className="w-4 h-4" />
            Funil CRM
            {crmCount > 0 && (
              <span className="text-xs font-mono text-purple-400">({crmCount})</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dashboard'
                ? 'text-purple-400 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('scripts')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'scripts'
                ? 'text-purple-400 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Scripts de Venda
          </button>
        </nav>

        {/* Zone 3: Primary Action / User Subscription */}
        <div className="flex items-center gap-3 shrink-0">
          {user.isSubscribed ? (
            <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-950/60 border border-purple-800/40 px-3 py-1.5 rounded-lg whitespace-nowrap">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Assinante Pro</span>
            </div>
          ) : (
            <button
              onClick={onOpenPaywall}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md shadow-purple-950/50 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Plano Pro · Stripe</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
