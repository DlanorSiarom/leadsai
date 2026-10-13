import React, { useState } from 'react';
import { X, Check, ShieldCheck, Lock, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { UserAccount } from '../types';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeSuccess: (plan: 'pro_monthly' | 'pro_yearly') => void;
  user: UserAccount;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onSubscribeSuccess,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'pro_monthly' | 'pro_yearly'>('pro_monthly');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState('Ronalld Robert');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simula validação e processamento seguro no Stripe
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onSubscribeSuccess(selectedPlan);
        onClose();
        setSuccess(false);
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0c0a15] border border-purple-800/50 shadow-2xl shadow-purple-950/60 overflow-hidden">
        {/* Top Header Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Assinatura LeadMaps Pro · Stripe Checkout</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
            Desbloqueie acesso ilimitado a todos os leads sem site
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mb-6">
            Você atingiu o limite de 3 leads da degustação gratuita. Assine agora para prospectar em qualquer cidade com WhatsApp liberado.
          </p>

          {/* Plan Toggle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setSelectedPlan('pro_monthly')}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                selectedPlan === 'pro_monthly'
                  ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500/50'
                  : 'bg-[#07050d] border-purple-950/50 hover:border-purple-800/40'
              }`}
            >
              <div className="text-xs font-medium text-neutral-400 mb-1">Plano Mensal</div>
              <div className="text-xl font-extrabold text-white font-mono">
                R$ 97<span className="text-xs text-neutral-400 font-sans font-normal">/mês</span>
              </div>
              <div className="text-[11px] text-purple-400 mt-1">Cancele quando quiser</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan('pro_yearly')}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                selectedPlan === 'pro_yearly'
                  ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500/50'
                  : 'bg-[#07050d] border-purple-950/50 hover:border-purple-800/40'
              }`}
            >
              <span className="absolute -top-2.5 right-3 bg-purple-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Economize 25%
              </span>
              <div className="text-xs font-medium text-neutral-400 mb-1">Plano Anual</div>
              <div className="text-xl font-extrabold text-white font-mono">
                R$ 890<span className="text-xs text-neutral-400 font-sans font-normal">/ano</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">Equivalente a R$ 74/mês</div>
            </button>
          </div>

          {/* Features Included */}
          <div className="space-y-2 mb-6 bg-[#07050d] p-3.5 rounded-xl border border-purple-950/50 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Buscas ilimitadas de empresas sem site no Google Maps</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Desbloqueio de WhatsApp direto com mensagem pré-formatada</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>CRM Kanban completo para gerenciar seu funil de vendas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Gerador de auditorias de posicionamento e propostas comerciais</span>
            </div>
          </div>

          {/* Stripe Card Checkout Simulation */}
          <form onSubmit={handleCheckout} className="space-y-3">
            <div className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
              <span>Dados do Cartão (Stripe Elements)</span>
              <span className="text-neutral-500 flex items-center gap-1 font-normal text-[11px]">
                <Lock className="w-3 h-3 text-emerald-400" />
                Criptografia SSL 256-bit
              </span>
            </div>

            <div>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="Nome Impresso no Cartão"
                required
                className="w-full px-3 py-2 bg-[#07050d] border border-purple-950/60 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <CreditCard className="w-4 h-4 text-purple-400" />
              </div>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Número do Cartão"
                required
                className="w-full pl-9 pr-3 py-2 bg-[#07050d] border border-purple-950/60 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/AA"
                required
                className="w-full px-3 py-2 bg-[#07050d] border border-purple-950/60 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 font-mono"
              />
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="CVC"
                required
                className="w-full px-3 py-2 bg-[#07050d] border border-purple-950/60 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing || success}
              className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validando com Stripe...</span>
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Assinatura Confirmada! Desbloqueando...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    Confirmar Assinatura ({selectedPlan === 'pro_monthly' ? 'R$ 97/mês' : 'R$ 890/ano'})
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Footer security badges */}
          <div className="mt-4 pt-4 border-t border-purple-950/40 flex items-center justify-center gap-6 text-[11px] text-neutral-500">
            <span>Powered by Stripe</span>
            <span aria-hidden="true">·</span>
            <span>Garantia incondicional de 7 dias</span>
            <span aria-hidden="true">·</span>
            <span>Pagamento Seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
};
