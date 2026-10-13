import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Trophy,
  Users,
  Target,
  Sparkles,
  ArrowUpRight,
  Briefcase,
} from 'lucide-react';
import { Lead } from '../types';

interface DashboardViewProps {
  crmLeads: Lead[];
  searchedLeads: Lead[];
  onSwitchToSearch: () => void;
  onSwitchToCrm: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  crmLeads,
  searchedLeads,
  onSwitchToSearch,
  onSwitchToCrm,
}) => {
  const allLeads = crmLeads.length > 0 ? crmLeads : searchedLeads;

  const totalScanned = Math.max(searchedLeads.length, crmLeads.length);
  const leadsWithoutSite = allLeads.filter((l) => !l.hasWebsite).length;
  
  const pipelineValue = crmLeads
    .filter((l) => l.stage !== 'perdido' && l.stage !== 'fechado')
    .reduce((sum, l) => sum + l.potentialValue, 0);

  const wonRevenue = crmLeads
    .filter((l) => l.stage === 'fechado')
    .reduce((sum, l) => sum + l.potentialValue, 0);

  const wonCount = crmLeads.filter((l) => l.stage === 'fechado').length;
  const contactedCount = crmLeads.filter((l) => l.stage !== 'novo').length;
  const conversionRate = contactedCount > 0 ? ((wonCount / contactedCount) * 100).toFixed(1) : '0.0';

  const avgTicket = wonCount > 0 ? Math.round(wonRevenue / wonCount) : 2400;

  // Breakdown por estágio
  const stageCounts = {
    novo: crmLeads.filter((l) => l.stage === 'novo').length,
    contatado: crmLeads.filter((l) => l.stage === 'contatado').length,
    proposta: crmLeads.filter((l) => l.stage === 'proposta').length,
    negociacao: crmLeads.filter((l) => l.stage === 'negociacao').length,
    fechado: crmLeads.filter((l) => l.stage === 'fechado').length,
    perdido: crmLeads.filter((l) => l.stage === 'perdido').length,
  };

  // Breakdown por nicho
  const nicheMap: Record<string, { count: number; totalVal: number }> = {};
  allLeads.forEach((l) => {
    const key = l.category || 'Outros';
    if (!nicheMap[key]) {
      nicheMap[key] = { count: 0, totalVal: 0 };
    }
    nicheMap[key].count += 1;
    nicheMap[key].totalVal += l.potentialValue;
  });

  const sortedNiches = Object.entries(nicheMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-purple-950/40">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Métricas de Desempenho em Tempo Real</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Dashboard de Prospecção & Vendas
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Indicadores de prospecção no Google Maps, taxa de conversão e receita de criação de sites.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSwitchToSearch}
            className="px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-[#0d0a17] hover:bg-purple-950/40 border border-purple-950/60 rounded-lg transition-colors"
          >
            Buscar Mais Leads
          </button>
          <button
            onClick={onSwitchToCrm}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md shadow-purple-950/40 transition-colors"
          >
            Ver Funil Kanban
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Pipeline Value */}
        <div className="bg-[#0c0a15] border border-purple-950/50 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Pipeline em Aberto</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums mb-1">
            R$ {pipelineValue.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center gap-1">
            <span className="text-purple-400 font-mono">{crmLeads.length}</span> leads no funil ativo
          </div>
        </div>

        {/* Won Revenue */}
        <div className="bg-[#0c0a15] border border-emerald-950/50 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Vendas Fechadas (Ganhos)</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 font-mono tabular-nums mb-1">
            R$ {wonRevenue.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center gap-1">
            <span className="text-emerald-400 font-mono">{wonCount}</span> contratos assinados
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-[#0c0a15] border border-purple-950/50 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Taxa de Conversão</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums mb-1">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center gap-1">
            De contatos iniciados para vendas
          </div>
        </div>

        {/* Average Ticket */}
        <div className="bg-[#0c0a15] border border-purple-950/50 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Ticket Médio por Site</span>
            <TrendingUp className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums mb-1">
            R$ {avgTicket.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center gap-1">
            Valor de venda recomendado
          </div>
        </div>
      </div>

      {/* Two Column Layout: Funnel Stage Distribution & Top Niches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Funnel Stage Bar */}
        <div className="bg-[#0c0a15] border border-purple-950/50 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Distribuição de Leads no Funil</span>
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Novos Leads (Sem contato)', count: stageCounts.novo, color: 'bg-purple-600' },
              { label: 'Em Contato (WhatsApp/DM)', count: stageCounts.contatado, color: 'bg-blue-600' },
              { label: 'Proposta Enviada', count: stageCounts.proposta, color: 'bg-amber-600' },
              { label: 'Em Negociação', count: stageCounts.negociacao, color: 'bg-indigo-600' },
              { label: 'Fechado / Ganho', count: stageCounts.fechado, color: 'bg-emerald-500' },
              { label: 'Perdido', count: stageCounts.perdido, color: 'bg-neutral-700' },
            ].map((item, idx) => {
              const total = crmLeads.length || 1;
              const pct = Math.round((item.count / total) * 100);

              return (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-300">{item.label}</span>
                    <span className="font-mono text-neutral-400 tabular-nums">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#07050d] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Niches Table */}
        <div className="bg-[#0c0a15] border border-purple-950/50 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span>Nichos Mais Lucrativos Identificados</span>
          </h3>

          <div className="space-y-3">
            {sortedNiches.length > 0 ? (
              sortedNiches.map(([name, data], idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#07050d] border border-purple-950/40 text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block">{name}</span>
                    <span className="text-neutral-500">{data.count} empresas analisadas</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-purple-300 block">
                      R$ {data.totalVal.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[11px] text-neutral-500">potencial total</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-neutral-500 py-6 text-center">
                Execute sua primeira busca para gerar as estatísticas de nicho.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Playbook / Pro Tips for Selling Websites */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 to-[#0c0a15] border border-purple-900/40">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Manual de Vendas · Como Abordar Empresas sem Site</span>
        </div>
        <h3 className="text-base font-bold text-white mb-2">
          3 Dicas para Fechar Clientes no WhatsApp em menos de 48 Horas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-300 mt-4">
          <div className="p-3.5 rounded-xl bg-[#07050d]/80 border border-purple-950/50">
            <div className="font-bold text-purple-300 mb-1">1. Elogie a Nota no Maps Primeiro</div>
            <p className="text-neutral-400 leading-relaxed">
              Negócios com 4.5+ estrelas têm orgulho do atendimento. Começar elogiando quebra o desarmamento antes de apontar que não têm site.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#07050d]/80 border border-purple-950/50">
            <div className="font-bold text-purple-300 mb-1">2. Envie o Link de Modelo Pronto</div>
            <p className="text-neutral-400 leading-relaxed">
              Não tente vender reuniões longas. Diga: "Fiz um rascunho de como ficaria a página de vocês no celular, quer ver?". A curiosidade converte 3x mais.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#07050d]/80 border border-purple-950/50">
            <div className="font-bold text-purple-300 mb-1">3. Mostre o Dinheiro Perdido</div>
            <p className="text-neutral-400 leading-relaxed">
              Use a auditoria do LeadMaps Pro para mostrar que concorrentes com site estão captando os clientes que buscam no Google com intenção de compra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
