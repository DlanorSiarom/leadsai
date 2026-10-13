import React, { useState } from 'react';
import { X, Check, Copy, MessageSquare, Printer, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Lead } from '../types';
import { generateAuditReport, generateWhatsAppPitch } from '../services/pitchGenerator';

interface AuditProposalModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export const AuditProposalModal: React.FC<AuditProposalModalProps> = ({ lead, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [scriptTone, setScriptTone] = useState<'amigavel' | 'direto' | 'auditoria'>('auditoria');

  if (!lead) return null;

  const audit = generateAuditReport(lead);
  const pitchText = generateWhatsAppPitch(lead, scriptTone);

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(pitchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-[#0c0a15] border border-purple-800/50 shadow-2xl shadow-purple-950/60 overflow-hidden">
        {/* Top Header Glow */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diagnóstico Comercial Automático</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1">
            {lead.name}
          </h2>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
            <span>{lead.category}</span>
            <span aria-hidden="true">·</span>
            <span>{lead.city}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400">★ {lead.rating.toFixed(1)} ({lead.reviewCount} avaliações no Maps)</span>
          </div>

          {/* Metric Box: Estimated Loss */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-[#07050d] p-3.5 rounded-xl border border-purple-950/60">
              <span className="text-[11px] text-neutral-400 block mb-0.5">Visitas Perdidas/mês</span>
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                ~{audit.estimatedLostClientsPerMonth} clientes
              </span>
            </div>

            <div className="bg-[#07050d] p-3.5 rounded-xl border border-purple-950/60">
              <span className="text-[11px] text-neutral-400 block mb-0.5">Ticket Médio Estimado</span>
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                R$ {audit.estimatedAverageTicket}
              </span>
            </div>

            <div className="bg-rose-950/30 p-3.5 rounded-xl border border-rose-900/40">
              <span className="text-[11px] text-rose-300 block mb-0.5 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" /> Perda Estimada
              </span>
              <span className="text-lg font-bold font-mono text-rose-300 tabular-nums">
                R$ {audit.estimatedLostRevenue.toLocaleString('pt-BR')}/mês
              </span>
            </div>
          </div>

          {/* Diagnostics list */}
          <div className="mb-6 space-y-2.5">
            <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Pontos Críticos Identificados no Perfil
            </div>

            {audit.diagnostics.map((diag, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#07050d] border border-purple-950/50 flex items-start gap-2.5 text-xs"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    diag.status === 'crítico'
                      ? 'bg-rose-500'
                      : diag.status === 'alerta'
                      ? 'bg-amber-500'
                      : 'bg-purple-500'
                  }`}
                />
                <div>
                  <span className="font-semibold text-white block mb-0.5">{diag.title}</span>
                  <span className="text-neutral-400 leading-relaxed">{diag.description}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Website Package */}
          <div className="mb-6 p-4 rounded-xl bg-purple-950/30 border border-purple-800/40">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Solução Recomendada</span>
              </div>
              <div className="text-base font-extrabold font-mono text-purple-300">
                R$ {audit.recommendedPackage.suggestedPrice.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="text-xs text-neutral-300 mb-3 font-medium">
              {audit.recommendedPackage.name} · Prazo de entrega: {audit.recommendedPackage.deliveryTime}
            </div>

            <ul className="space-y-1.5 text-xs text-neutral-300">
              {audit.recommendedPackage.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tone Selector for Pitch */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-neutral-400 mb-2">
              Tom da Abordagem no WhatsApp:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScriptTone('auditoria')}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors ${
                  scriptTone === 'auditoria'
                    ? 'bg-purple-900/60 border-purple-500 text-white'
                    : 'bg-[#07050d] border-purple-950/60 text-neutral-400 hover:text-white'
                }`}
              >
                Auditoria Técnica
              </button>
              <button
                type="button"
                onClick={() => setScriptTone('amigavel')}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors ${
                  scriptTone === 'amigavel'
                    ? 'bg-purple-900/60 border-purple-500 text-white'
                    : 'bg-[#07050d] border-purple-950/60 text-neutral-400 hover:text-white'
                }`}
              >
                Amigável
              </button>
              <button
                type="button"
                onClick={() => setScriptTone('direto')}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors ${
                  scriptTone === 'direto'
                    ? 'bg-purple-900/60 border-purple-500 text-white'
                    : 'bg-[#07050d] border-purple-950/60 text-neutral-400 hover:text-white'
                }`}
              >
                Direto ao Ponto
              </button>
            </div>
          </div>

          {/* Message preview */}
          <div className="mb-6 p-3 bg-[#07050d] rounded-xl border border-purple-950/60 font-mono text-[11px] text-neutral-300 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
            {pitchText}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={handleCopyPitch}
              className="py-2.5 px-3 text-xs font-semibold text-neutral-200 bg-[#07050d] hover:bg-purple-950/40 border border-purple-950/60 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-400" />
                  <span>Copiar Mensagem</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/${lead.cleanPhone}?text=${encodeURIComponent(pitchText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 text-xs font-semibold text-emerald-200 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Abrir no WhatsApp</span>
            </a>

            <button
              onClick={handlePrint}
              className="py-2.5 px-3 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-purple-950/50"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
