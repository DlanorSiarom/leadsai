import React, { useState } from 'react';
import {
  MessageSquare,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Edit3,
  Check,
  Star,
  Search,
  Plus,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lead, CRMStage, StageId } from '../types';

interface CrmKanbanProps {
  leads: Lead[];
  onUpdateStage: (leadId: string, stage: StageId) => void;
  onUpdateNotes: (leadId: string, notes: string) => void;
  onUpdateValue: (leadId: string, value: number) => void;
  onRemoveLead: (leadId: string) => void;
  onOpenAudit: (lead: Lead) => void;
  onSwitchToSearch: () => void;
}

const STAGES: CRMStage[] = [
  {
    id: 'novo',
    title: 'Novos Leads',
    description: 'Encontrados no Maps sem contato',
    color: 'border-purple-600/40 text-purple-300',
    badgeBg: 'bg-purple-950/60',
  },
  {
    id: 'contatado',
    title: 'Em Contato',
    description: 'WhatsApp ou DM enviado',
    color: 'border-blue-600/40 text-blue-300',
    badgeBg: 'bg-blue-950/60',
  },
  {
    id: 'proposta',
    title: 'Proposta Enviada',
    description: 'Auditoria de site apresentada',
    color: 'border-amber-600/40 text-amber-300',
    badgeBg: 'bg-amber-950/60',
  },
  {
    id: 'negociacao',
    title: 'Em Negociação',
    description: 'Alinhando escopo ou valor',
    color: 'border-indigo-600/40 text-indigo-300',
    badgeBg: 'bg-indigo-950/60',
  },
  {
    id: 'fechado',
    title: 'Fechado / Ganho',
    description: 'Contrato fechado com sucesso!',
    color: 'border-emerald-600/40 text-emerald-300',
    badgeBg: 'bg-emerald-950/60',
  },
  {
    id: 'perdido',
    title: 'Perdido',
    description: 'Não teve interesse agora',
    color: 'border-neutral-700/40 text-neutral-400',
    badgeBg: 'bg-neutral-900',
  },
];

export const CrmKanban: React.FC<CrmKanbanProps> = ({
  leads,
  onUpdateStage,
  onUpdateNotes,
  onUpdateValue,
  onRemoveLead,
  onOpenAudit,
  onSwitchToSearch,
}) => {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState('');

  const handleStageChange = (leadId: string, currentStage: StageId, direction: 'next' | 'prev') => {
    const stageOrder: StageId[] = ['novo', 'contatado', 'proposta', 'negociacao', 'fechado', 'perdido'];
    const currentIndex = stageOrder.indexOf(currentStage);

    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0 || nextIndex >= stageOrder.length) return;

    const nextStage = stageOrder[nextIndex];
    onUpdateStage(leadId, nextStage);

    // Efeito de celebração ao fechar negócio!
    if (nextStage === 'fechado') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9333ea', '#7c3aed', '#10b981', '#3b82f6', '#f59e0b'],
      });
    }
  };

  const handleSaveNotes = (leadId: string) => {
    onUpdateNotes(leadId, tempNotes);
    setEditingNotesId(null);
  };

  const handleSaveValue = (leadId: string) => {
    onUpdateValue(leadId, tempValue);
    setEditingValueId(null);
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.city.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalPipeline = leads
    .filter((l) => l.stage !== 'perdido')
    .reduce((sum, l) => sum + l.potentialValue, 0);

  const totalWon = leads
    .filter((l) => l.stage === 'fechado')
    .reduce((sum, l) => sum + l.potentialValue, 0);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Pipeline Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-purple-950/40">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Funil de Vendas CRM
            <span className="text-xs font-mono font-medium text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              {leads.length} leads
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Acompanhe o status das abordagens de venda de site, envie mensagens no WhatsApp e registre notas.
          </p>
        </div>

        {/* Financial Overview */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-[#0c0a15] border border-purple-950/60 px-4 py-2 rounded-xl">
            <span className="text-[11px] text-neutral-400 block">Pipeline Ativo</span>
            <span className="text-sm sm:text-base font-bold font-mono text-purple-300 tabular-nums">
              R$ {totalPipeline.toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="bg-[#0c0a15] border border-emerald-950/60 px-4 py-2 rounded-xl">
            <span className="text-[11px] text-neutral-400 block flex items-center gap-1">
              <Trophy className="w-3 h-3 text-emerald-400" /> Vendas Concluídas
            </span>
            <span className="text-sm sm:text-base font-bold font-mono text-emerald-400 tabular-nums">
              R$ {totalWon.toLocaleString('pt-BR')}
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar no funil..."
              className="pl-8 pr-3 py-2 bg-[#0c0a15] border border-purple-950/60 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {leads.length === 0 ? (
        <div className="bg-[#0c0a15] border border-purple-950/40 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 mx-auto mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Seu funil está vazio</h3>
          <p className="text-xs text-neutral-400 mb-6">
            Faça uma varredura de empresas no Google Maps e adicione os negócios sem site ao seu CRM com 1 clique.
          </p>
          <button
            onClick={onSwitchToSearch}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors shadow-md shadow-purple-950/50"
          >
            Buscar Empresas no Maps
          </button>
        </div>
      ) : (
        /* Kanban Columns Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3.5 items-start overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const columnLeads = filteredLeads.filter((l) => l.stage === stage.id);
            const columnValue = columnLeads.reduce((acc, l) => acc + l.potentialValue, 0);

            return (
              <div
                key={stage.id}
                className="bg-[#0a0812] rounded-xl border border-purple-950/40 p-3 min-w-[240px] flex flex-col min-h-[500px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-purple-950/50">
                  <div>
                    <h3 className={`text-xs font-bold tracking-tight ${stage.color}`}>
                      {stage.title}
                    </h3>
                    <div className="text-[10px] text-neutral-500 font-mono tabular-nums">
                      R$ {columnValue.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-950/40 text-neutral-300 border border-purple-900/30">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-[#100d1c] hover:bg-[#141024] rounded-lg border border-purple-950/60 hover:border-purple-800/60 p-3 transition-all shadow-sm"
                    >
                      {/* Category & Score */}
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                        <span className="truncate max-w-[120px] font-medium text-neutral-300">
                          {lead.category}
                        </span>
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                          <span className="font-mono text-[10px]">{lead.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Lead Name */}
                      <h4 className="text-xs font-bold text-white leading-snug mb-1">
                        {lead.name}
                      </h4>

                      <div className="text-[11px] text-neutral-400 truncate mb-2">
                        {lead.city}
                      </div>

                      {/* Deal Value Editor */}
                      <div className="flex items-center justify-between text-xs mb-2.5 bg-[#07050d] px-2 py-1 rounded border border-purple-950/50">
                        <span className="text-[10px] text-neutral-400 flex items-center gap-0.5">
                          <DollarSign className="w-3 h-3 text-emerald-400" /> Valor
                        </span>
                        {editingValueId === lead.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempValue}
                              onChange={(e) => setTempValue(Number(e.target.value))}
                              className="w-16 px-1 py-0.5 text-[11px] bg-neutral-900 text-white rounded font-mono"
                            />
                            <button
                              onClick={() => handleSaveValue(lead.id)}
                              className="text-emerald-400 hover:text-emerald-300"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingValueId(lead.id);
                              setTempValue(lead.potentialValue);
                            }}
                            className="font-mono font-semibold text-purple-300 hover:text-purple-200 text-[11px]"
                          >
                            R$ {lead.potentialValue.toLocaleString('pt-BR')}
                          </button>
                        )}
                      </div>

                      {/* Notes Section */}
                      <div className="mb-2.5">
                        {editingNotesId === lead.id ? (
                          <div className="space-y-1">
                            <textarea
                              value={tempNotes}
                              onChange={(e) => setTempNotes(e.target.value)}
                              placeholder="Anotações de contato..."
                              rows={2}
                              className="w-full p-1.5 text-[11px] bg-[#07050d] border border-purple-950/60 rounded text-neutral-200 focus:outline-none focus:border-purple-500"
                            />
                            <button
                              onClick={() => handleSaveNotes(lead.id)}
                              className="w-full py-0.5 text-[10px] font-semibold bg-purple-700 hover:bg-purple-600 text-white rounded"
                            >
                              Salvar Nota
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingNotesId(lead.id);
                              setTempNotes(lead.notes || '');
                            }}
                            className="cursor-pointer group flex items-start justify-between text-[10px] text-neutral-400 bg-[#07050d]/60 hover:bg-[#07050d] p-1.5 rounded border border-purple-950/30"
                          >
                            <span className="truncate max-w-[150px]">
                              {lead.notes ? lead.notes : 'Clique para adicionar nota...'}
                            </span>
                            <Edit3 className="w-2.5 h-2.5 text-neutral-500 group-hover:text-purple-400 shrink-0 ml-1 mt-0.5" />
                          </div>
                        )}
                      </div>

                      {/* Action buttons on card */}
                      <div className="space-y-1.5 pt-2 border-t border-purple-950/40">
                        {/* WhatsApp direct trigger */}
                        <a
                          href={lead.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1 py-1 px-2 text-[11px] font-medium text-emerald-300 bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-800/30 rounded transition-colors"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Proposal & Delete */}
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          <button
                            onClick={() => onOpenAudit(lead)}
                            className="text-purple-400 hover:text-purple-300 hover:underline"
                          >
                            Ver Proposta
                          </button>
                          <button
                            onClick={() => onRemoveLead(lead.id)}
                            className="text-neutral-500 hover:text-rose-400 p-0.5"
                            title="Remover do CRM"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Stage Stepper Arrows */}
                        <div className="flex items-center justify-between pt-1 gap-1">
                          <button
                            disabled={stage.id === 'novo'}
                            onClick={() => handleStageChange(lead.id, stage.id, 'prev')}
                            className="flex-1 py-1 flex items-center justify-center bg-[#07050d] hover:bg-purple-950/50 rounded border border-purple-950/40 text-neutral-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
                            title="Etapa anterior"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                          <button
                            disabled={stage.id === 'perdido'}
                            onClick={() => handleStageChange(lead.id, stage.id, 'next')}
                            className="flex-1 py-1 flex items-center justify-center bg-purple-900/30 hover:bg-purple-800/40 rounded border border-purple-800/40 text-purple-200 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
                            title="Avançar etapa"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnLeads.length === 0 && (
                    <div className="h-28 flex items-center justify-center text-[11px] text-neutral-600 border border-dashed border-purple-950/40 rounded-lg">
                      Nenhum lead nesta etapa
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
