import React, { useState } from 'react';
import {
  MessageSquare,
  Instagram,
  MapPin,
  Star,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  FileCheck,
  Lock,
  Sparkles,
  Download,
  AlertTriangle,
  RotateCcw,
  Globe,
} from 'lucide-react';
import { Lead, UserAccount } from '../types';

interface LeadsViewProps {
  leads: Lead[];
  user: UserAccount;
  crmLeads: Lead[];
  onAddToCrm: (lead: Lead) => void;
  onOpenAudit: (lead: Lead) => void;
  onOpenPaywall: () => void;
  onResetSearch: () => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  user,
  crmLeads,
  onAddToCrm,
  onOpenAudit,
  onOpenPaywall,
  onResetSearch,
}) => {
  const withoutWebsiteCount = leads.filter((l) => !l.hasWebsite).length;
  // Se não houver nenhum sem site na busca, exibe todos por padrão para nunca deixar a tela vazia
  const [filterWebsiteMode, setFilterWebsiteMode] = useState<'without_website' | 'all'>(
    withoutWebsiteCount > 0 ? 'without_website' : 'all'
  );
  const [filterQuery, setFilterQuery] = useState('');
  const [onlyHighOpp, setOnlyHighOpp] = useState(false);

  const crmLeadIds = new Set(crmLeads.map((l) => l.id));

  const filteredLeads = leads.filter((l) => {
    const matchSite = filterWebsiteMode === 'all' || !l.hasWebsite;
    const matchText =
      l.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.address.toLowerCase().includes(filterQuery.toLowerCase());
    const matchOpp = !onlyHighOpp || l.opportunityScore >= 70;
    return matchSite && matchText && matchOpp;
  });

  const exportCsv = () => {
    if (!user.isSubscribed) {
      onOpenPaywall();
      return;
    }

    const headers = [
      'Nome',
      'Categoria',
      'Cidade',
      'Telefone',
      'WhatsApp',
      'Instagram',
      'Avaliacao',
      'Total Avaliacoes',
      'Sem Site',
      'Valor Estimado',
    ];
    const rows = filteredLeads.map((l) => [
      `"${l.name}"`,
      `"${l.category}"`,
      `"${l.city}"`,
      `"${l.phone}"`,
      `"${l.cleanPhone}"`,
      `"${l.instagramHandle || ''}"`,
      l.rating,
      l.reviewCount,
      l.hasWebsite ? 'Nao' : 'Sim',
      l.potentialValue,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_maps_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Controls & Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-purple-950/40">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resultado da Varredura Google Maps</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {leads.length} empresas encontradas no Google Maps
          </h2>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
            <span>
              <strong className="text-purple-300 font-mono">{withoutWebsiteCount}</strong> sem site próprio
              cadastrado
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Potencial estimado:{' '}
              <strong className="text-purple-300 font-mono">
                R$ {leads.reduce((acc, l) => acc + l.potentialValue, 0).toLocaleString('pt-BR')}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onResetSearch}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-[#0d0a17] hover:bg-purple-950/50 border border-purple-950/60 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
            Nova Pesquisa
          </button>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-purple-200 hover:text-white bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/50 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Quick Filters & Website Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 bg-[#0c0a15] p-3 rounded-xl border border-purple-950/40">
        <div className="flex items-center gap-2">
          {/* Segmented control for website filter */}
          <div className="flex items-center p-1 bg-[#07050d] rounded-lg border border-purple-950/60">
            <button
              onClick={() => setFilterWebsiteMode('without_website')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterWebsiteMode === 'without_website'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sem Site ({withoutWebsiteCount})
            </button>
            <button
              onClick={() => setFilterWebsiteMode('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterWebsiteMode === 'all'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Todas ({leads.length})
            </button>
          </div>

          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filtrar por nome, rua..."
            className="w-full sm:w-60 px-3 py-1.5 bg-[#07050d] border border-purple-950/60 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-neutral-400">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyHighOpp}
              onChange={(e) => setOnlyHighOpp(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-neutral-700 bg-neutral-900 text-purple-600 focus:ring-0"
            />
            <span>Apenas Alta Oportunidade (Score 70+)</span>
          </label>
        </div>
      </div>

      {/* Degustation Mode Banner */}
      {!user.isSubscribed && (
        <div className="mb-6 p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-900/50 flex items-center justify-center text-purple-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                Modo Degustação Ativo: 3 Primeiros Leads Liberados Gratuitamente
              </div>
              <div className="text-xs text-neutral-400">
                Teste o envio de WhatsApp e auditoria nos leads abaixo. Assine o Plano Pro via Stripe para liberar a lista inteira.
              </div>
            </div>
          </div>
          <button
            onClick={onOpenPaywall}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow transition-colors whitespace-nowrap shrink-0"
          >
            Desbloquear Todos os Leads
          </button>
        </div>
      )}

      {/* Leads Grid or Empty State */}
      {filteredLeads.length === 0 ? (
        <div className="bg-[#0c0a15] border border-purple-950/40 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <AlertTriangle className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-2">
            Nenhuma empresa sem site na primeira página de resultados
          </h3>
          <p className="text-xs text-neutral-400 mb-6">
            Nesta área específica, os estabelecimentos no topo do ranking já possuem links cadastrados. Você pode alternar para ver todas as empresas ou buscar por bairros adjacentes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {filterWebsiteMode === 'without_website' && leads.length > 0 && (
              <button
                onClick={() => setFilterWebsiteMode('all')}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
              >
                Ver Todas as {leads.length} Empresas Encontradas
              </button>
            )}
            <button
              onClick={onResetSearch}
              className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-[#07050d] border border-purple-950/60 rounded-lg transition-colors"
            >
              Fazer Nova Pesquisa
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead, idx) => {
            const isLocked = !user.isSubscribed && idx >= 3;
            const isInCrm = crmLeadIds.has(lead.id);

            if (isLocked) {
              return (
                <div
                  key={lead.id}
                  className="relative rounded-2xl bg-[#0c0a15] border border-purple-950/40 p-5 overflow-hidden flex flex-col justify-between"
                >
                  {/* Blurred Content Background */}
                  <div className="filter blur-md select-none opacity-40 pointer-events-none">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-neutral-400">{lead.category}</span>
                      <span className="text-xs text-neutral-400">★ {lead.rating}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{lead.name}</h3>
                    <p className="text-xs text-neutral-400 mb-4">{lead.address}</p>
                    <div className="h-8 bg-neutral-800 rounded-lg w-full mb-2" />
                    <div className="h-8 bg-neutral-800 rounded-lg w-full" />
                  </div>

                  {/* Secure Lock Overlay */}
                  <div className="absolute inset-0 bg-[#07050d]/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-purple-300 mb-3 shadow-lg shadow-purple-950/50">
                      <Lock className="w-5 h-5 text-purple-300" />
                    </div>
                    <div className="text-sm font-bold text-white mb-1">Lead #{idx + 1} Bloqueado</div>
                    <p className="text-xs text-neutral-400 mb-4 max-w-xs">
                      Empresa verificada no Google Maps em {lead.city}. Desbloqueie contato e WhatsApp direto.
                    </p>
                    <button
                      onClick={onOpenPaywall}
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md transition-all hover:scale-[1.02]"
                    >
                      Desbloquear via Stripe
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={lead.id}
                className="rounded-2xl bg-[#0c0a15] hover:bg-[#100d1c] border border-purple-950/50 hover:border-purple-800/60 transition-all p-5 flex flex-col justify-between shadow-lg shadow-purple-950/20"
              >
                <div>
                  {/* Header Card: Category & Opportunity Score */}
                  <div className="flex items-center justify-between gap-2 text-xs text-neutral-400 mb-2">
                    <span className="truncate max-w-[150px] font-medium text-neutral-300">
                      {lead.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-purple-400 font-mono font-semibold">
                        {lead.opportunityScore} pts
                      </span>
                      <span className="text-neutral-500">score</span>
                    </div>
                  </div>

                  {/* Company Name */}
                  <h3 className="text-base font-bold text-white tracking-tight mb-1.5 flex items-start justify-between gap-2">
                    <span>{lead.name}</span>
                  </h3>

                  {/* Google Maps Reviews */}
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
                    <div className="flex items-center text-amber-400 font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      <span>{lead.rating.toFixed(1)}</span>
                    </div>
                    <span aria-hidden="true">·</span>
                    <span>({lead.reviewCount} avaliações no Maps)</span>
                  </div>

                  {/* Website Status Badge */}
                  {!lead.hasWebsite ? (
                    <div className="mb-4 p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30 flex items-start gap-2 text-xs text-rose-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-rose-200">
                          {lead.websiteUrl ? 'Sem Site Oficial (Usa apenas rede social/link provisório)' : 'Sem Website Oficial'}
                        </span>
                        <span className="text-[11px] text-rose-400/90 leading-tight">
                          Excelente oportunidade: perfil listado no Maps perde até R$ {lead.potentialValue} em pedidos diretos.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-2 rounded-lg bg-neutral-900/40 border border-neutral-800/40 flex items-center justify-between text-xs text-neutral-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate text-neutral-300">Possui Website Cadastrado</span>
                      </div>
                      {lead.websiteUrl && (
                        <a
                          href={lead.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-purple-400 hover:text-purple-300 underline shrink-0 ml-2"
                        >
                          Visitar
                        </a>
                      )}
                    </div>
                  )}

                  {/* Address */}
                  <div className="flex items-start gap-1.5 text-xs text-neutral-400 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{lead.address}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-3 border-t border-purple-950/40">
                  {/* WhatsApp Direct Pitch */}
                  <a
                    href={lead.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chamar no WhatsApp ({lead.phone})</span>
                  </a>

                  {/* Row: Instagram & Google Maps */}
                  <div className="grid grid-cols-2 gap-2">
                    {lead.instagramUrl ? (
                      <a
                        href={lead.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs text-neutral-300 hover:text-white bg-[#07050d] hover:bg-purple-950/40 border border-purple-950/60 rounded-lg transition-colors"
                      >
                        <Instagram className="w-3.5 h-3.5 text-pink-400" />
                        <span className="truncate">Instagram</span>
                      </a>
                    ) : (
                      <div className="flex items-center justify-center py-1.5 px-2 text-xs text-neutral-500 bg-[#07050d] rounded-lg border border-purple-950/30">
                        Sem Instagram
                      </div>
                    )}

                    {lead.googleMapsUrl && (
                      <a
                        href={lead.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs text-neutral-300 hover:text-white bg-[#07050d] hover:bg-purple-950/40 border border-purple-950/60 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                        <span>Ver no Maps</span>
                      </a>
                    )}
                  </div>

                  {/* Row: CRM Button & Audit Report */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onOpenAudit(lead)}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 rounded-lg transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Ver Proposta</span>
                    </button>

                    <button
                      onClick={() => onAddToCrm(lead)}
                      disabled={isInCrm}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors ${
                        isInCrm
                          ? 'text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 cursor-default'
                          : 'text-white bg-purple-600 hover:bg-purple-500 shadow-sm shadow-purple-950'
                      }`}
                    >
                      {isInCrm ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>No CRM</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Adicionar CRM</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
