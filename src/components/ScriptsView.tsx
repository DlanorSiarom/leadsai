import React, { useState } from 'react';
import { FileText, Copy, Check, MessageSquare, Instagram, Phone, Sparkles } from 'lucide-react';

export const ScriptsView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const SCRIPTS = [
    {
      id: 'wa-amigavel',
      title: 'WhatsApp: Abordagem Amigável (Elogio + Demonstração)',
      channel: 'WhatsApp',
      icon: MessageSquare,
      color: 'text-emerald-400',
      description: 'Ideal para o primeiro contato. Quebra a barreira comercial com elogio real às avaliações do Google.',
      content: `Olá, tudo bem? Vi o perfil da *[Nome da Empresa]* no Google Maps e achei excelente a estrutura de vocês!

Estou entrando em contato porque reparei que vocês ainda não têm um site oficial vinculado no perfil da empresa. Trabalho com criação de páginas rápidas e otimizadas para o Google que atraem clientes locais todos os dias.

Gostaria de ver uma demonstração gratuita de como ficaria a presença digital da *[Nome da Empresa]* pronta no celular? É bem rápido e sem compromisso.`,
    },
    {
      id: 'wa-auditoria',
      title: 'WhatsApp: Auditoria de Concorrência & Dinheiro Perdido',
      channel: 'WhatsApp',
      icon: MessageSquare,
      color: 'text-emerald-400',
      description: 'Focado em despertar urgência mostrando concorrentes que possuem site na mesma região.',
      content: `Olá! Falo com o responsável pela *[Nome da Empresa]*?

Estava analisando negócios de destaque em [Cidade] e notei algo importante:
✅ O perfil de vocês no Google tem ótima reputação ([X] avaliações).
❌ Porém, não há link de site oficial registrado.

Fiz uma rápida auditoria de posicionamento: concorrentes diretos na sua rua/bairro estão captando clientes com páginas rápidas pelo celular com botão de WhatsApp e cardápio online.

Preparei uma proposta simples para colocar a *[Nome da Empresa]* no topo das buscas do Google. Teria 5 minutos para conversarmos hoje?`,
    },
    {
      id: 'wa-followup',
      title: 'WhatsApp: Follow-Up de 48 Horas (Reativação)',
      channel: 'WhatsApp',
      icon: MessageSquare,
      color: 'text-emerald-400',
      description: 'Para enviar caso o cliente visualize e demore a responder o primeiro contato.',
      content: `Opa, tudo bem? Sei que a rotina aí na *[Nome da Empresa]* é corrida!

Só passando para saber se conseguiu dar uma olhada na mensagem anterior. Finalizei um modelo de página web de alta conversão para o seu nicho e gostaria muito de mostrar como ficaria com a marca de vocês.

Posso te mandar o link aqui no WhatsApp mesmo para dar uma olhada de 1 minuto?`,
    },
    {
      id: 'insta-direct',
      title: 'Instagram Direct: Abordagem Direta com Link na Bio',
      channel: 'Instagram',
      icon: Instagram,
      color: 'text-pink-400',
      description: 'Mensagem descontraída para direct focando na ausência de site na bio do Instagram e no Maps.',
      content: `Opa! Tudo bem por aí? 👋

Acompanhei as publicações da *[Nome da Empresa]* e vi também as ótimas avaliações de vocês no Google Maps!

Percebi que vocês ainda não têm um site próprio no link da bio e no Maps. Para negócios do ramo de [Categoria], um site moderno gera muito mais credibilidade e dobra os agendamentos pelo WhatsApp.

Criamos projetos focados em vendas locais no celular. Se quiser, envio uma prévia de como ficaria o site de vocês! Bora trocar uma ideia?`,
    },
    {
      id: 'cold-call',
      title: 'Ligação Telefônica: Pitch Relâmpago de 45 Segundos',
      channel: 'Telefone',
      icon: Phone,
      color: 'text-blue-400',
      description: 'Roteiro direto para falar com o gerente ou proprietário ao ligar para o número fixo/celular do Maps.',
      content: `— Alô, bom dia! Por favor, quem cuida da divulgação ou é o proprietário da [Nome da Empresa]?

(Após atender o responsável):
— Olá [Nome], meu nome é [Seu Nome]. Sou especialista em presença digital local aqui na região. Vi que vocês têm nota excelente no Google Maps, mas notei que vocês ainda não têm um site oficial cadastrado. 

Estou com uma demonstração pronta de um site rápido com botão de WhatsApp e catálogo feito para o seu ramo. Gostaria de te enviar no WhatsApp sem compromisso para você ver como ficaria. Qual é o seu melhor número de WhatsApp?`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-8 pb-6 border-b border-purple-950/40">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Biblioteca de Conversão Comercial</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Scripts de Alta Conversão para Abordagem de Vendas
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Modelos testados para quebrar objeções e fechar vendas de sites com estabelecimentos listados no Google Maps.
        </p>
      </div>

      {/* Grid of Scripts */}
      <div className="space-y-4">
        {SCRIPTS.map((script) => {
          const Icon = script.icon;
          const isCopied = copiedId === script.id;

          return (
            <div
              key={script.id}
              className="bg-[#0c0a15] rounded-2xl border border-purple-950/50 p-5 hover:border-purple-800/60 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${script.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{script.title}</h3>
                    <p className="text-xs text-neutral-400">{script.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(script.id, script.content)}
                  className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#07050d] hover:bg-purple-950/50 border border-purple-950/60 hover:border-purple-700/60 text-neutral-200 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-purple-400" />
                      <span>Copiar Script</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 bg-[#07050d] rounded-xl border border-purple-950/60 font-mono text-xs text-neutral-300 whitespace-pre-line leading-relaxed">
                {script.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
