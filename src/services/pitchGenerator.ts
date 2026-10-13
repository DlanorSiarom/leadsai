import { Lead } from '../types';

export function generateWhatsAppPitch(lead: Lead, scriptType: 'amigavel' | 'direto' | 'auditoria' = 'amigavel'): string {
  const firstName = lead.name.split(' ')[0];
  
  if (scriptType === 'direto') {
    return `Olá, equipe da *${lead.name}*! Tudo bem?

Encontrei vocês com destaque no Google Maps (nota ${lead.rating.toFixed(1)} ⭐ com ${lead.reviewCount} avaliações, parabéns pelo trabalho!).

Notei que vocês ainda não possuem um site profissional cadastrado no perfil da empresa. Hoje mais de 70% dos clientes que buscam "${lead.category}" no Google acabam clicando no concorrente que tem botão de catálogo ou agendamento online.

Desenvolvo sites modernos de alta conversão específicos para o ramo de ${lead.category}. Posso enviar um modelo demonstrativo sem compromisso para vocês verem como ficaria?`;
  }

  if (scriptType === 'auditoria') {
    return `Olá! Falo com o responsável pela *${lead.name}*?

Estava analisando negócios de destaque em ${lead.city} e notei algo importante:
✅ O perfil de vocês no Google tem ótima reputação (${lead.reviewCount} avaliações).
❌ Porém, não há link de site oficial registrado.

Fiz uma rápida auditoria de posicionamento: concorrentes diretos estão captando clientes com páginas rápidas pelo celular e botão de WhatsApp automático.

Preparei uma proposta simples para colocar a ${lead.name} no topo das buscas orgânicas. Teria 5 minutos para conversarmos hoje?`;
  }

  // Amigável (padrão)
  return `Olá, tudo bem? Vi o perfil da *${lead.name}* no Google Maps e achei excelente a estrutura de vocês!

Estou entrando em contato porque reparei que vocês ainda não têm um site oficial vinculado. Trabalho com criação de sites rápidos e otimizados para o Google que atraem clientes todos os dias para ${lead.category}.

Gostaria de ver uma demonstração de como ficaria a presença digital da ${lead.name} pronta no celular? É bem rápido e sem custo.`;
}

export function generateInstagramPitch(lead: Lead): string {
  return `Opa! Tudo bem por aí? 👋

Acompanhei o perfil da *${lead.name}* e vi também as ótimas avaliações de vocês no Google Maps!

Percebi que vocês ainda não têm um site próprio no link da bio e no Maps. Para negócios do nicho de ${lead.category}, um site moderno gera muito mais credibilidade e dobra os contatos pelo WhatsApp.

Criamos projetos focados em vendas locais. Se quiser, envio uma prévia de como ficaria o site de vocês! Bora trocar uma ideia?`;
}

export function generateAuditReport(lead: Lead) {
  const estimatedLostClientsPerMonth = Math.max(12, Math.round(lead.reviewCount * 0.45));
  const estimatedAverageTicket = lead.category.toLowerCase().includes('pizzaria') || lead.category.toLowerCase().includes('restaurante')
    ? 85
    : lead.category.toLowerCase().includes('odonto') || lead.category.toLowerCase().includes('clínica')
    ? 350
    : lead.category.toLowerCase().includes('mecanic') || lead.category.toLowerCase().includes('oficina')
    ? 450
    : 180;

  const estimatedLostRevenue = estimatedLostClientsPerMonth * estimatedAverageTicket;

  return {
    businessName: lead.name,
    category: lead.category,
    city: lead.city,
    googleRating: lead.rating,
    totalReviews: lead.reviewCount,
    hasOfficialWebsite: lead.hasWebsite,
    estimatedLostClientsPerMonth,
    estimatedAverageTicket,
    estimatedLostRevenue,
    diagnostics: [
      {
        title: 'Ausência de Página Própria no Google',
        status: 'crítico',
        description: 'Usuários pesquisam no Google pelo celular mas não encontram link oficial, migrando para concorrentes listados.',
      },
      {
        title: 'Reputação sem Conversão Direta',
        status: 'alerta',
        description: `Nota de ${lead.rating.toFixed(1)} com ${lead.reviewCount} avaliações positivas não está sendo aproveitada para captar leads via formulário ou botão WhatsApp otimizado.`,
      },
      {
        title: 'Velocidade de Contato Móvel',
        status: 'oportunidade',
        description: 'Uma One-Page profissional aumentaria a taxa de conversão em até 140% com carregamento ultrarrápido.',
      },
      {
        title: 'Cardápio / Tabela de Serviços Online',
        status: 'oportunidade',
        description: 'Clientes preferem consultar preços e diferenciais antes de ligar ou mandar mensagem no WhatsApp.',
      }
    ],
    recommendedPackage: {
      name: `Website One-Page Pro · ${lead.name}`,
      deliveryTime: '3 a 5 dias úteis',
      suggestedPrice: lead.potentialValue,
      features: [
        'Design responsivo mobile-first de alto impacto',
        'Integração direta com WhatsApp e Instagram',
        'Otimização de SEO Local para o Google Maps',
        'Botão de agendamento / localização com 1 toque',
        'Hospedagem segura e certificado SSL incluso',
      ]
    }
  };
}
