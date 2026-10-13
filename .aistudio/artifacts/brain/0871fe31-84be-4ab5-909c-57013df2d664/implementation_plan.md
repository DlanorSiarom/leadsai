# LeadMaps Pro — SaaS de Prospecção e CRM para Venda de Sites

Plataforma SaaS B2B desenvolvida em tema moderno Roxo & Preto para identificar automaticamente empresas cadastradas no Google Maps que não possuem site, enriquecer dados com WhatsApp e Instagram, gerenciar abordagens em um funil Kanban integrado e converter leads através de propostas comerciais de alta conversão.

***

## User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões confirmadas no alinhamento inicial (Fase 1):**
> - **Modalidade de Busca:** Busca inteligente por nicho e cidade/bairro com enriquecimento de contatos diretos (WhatsApp e Instagram) e filtro automático para empresas sem website oficial (`websiteURI` ausente ou landing genérica).
> - **Ferramentas de Conversão & CRM:** Funil Kanban interativo com etapas de prospecção, status de abordagem em tempo real e gerador de scripts de copy persuasiva sob medida para WhatsApp e Instagram DM.
> - **Acesso & Paywall Stripe:** Modo degustação seguro (permite visualizar os primeiros 3 leads reais da busca para demonstrar valor antes de bloquear os dados sensíveis e exibir a paywall com planos Mensal e Anual via Stripe Checkout).

***

## 1. Overview & Core Concept

### O que a plataforma faz
- **Scanner Google Maps:** Realiza buscas geográficas por nicho comercial (ex: *pizzarias, barbearias, clínicas odontológicas, mecânicas, pet shops*) e localidade (cidade/bairro/raio), identificando instantaneamente estabelecimentos sem presença web própria.
- **Enriquecimento & Análise:** Identifica telefone direto formatado para WhatsApp com 1 clique (`wa.me`), presença no Instagram, avaliações, categoria e endereço físico.
- **Auditoria Express de Presença Online:** Gera um diagnóstico comercial destacando quanto dinheiro a empresa perde por não ter site no Google (perda de tráfego, autoridade e SEO local).
- **CRM Kanban de Vendas:** Permite arrastar os leads qualificados entre estágios (*Novos Leads*, *Primeiro Contato*, *Proposta Enviada*, *Em Negociação*, *Fechado / Ganho*, *Arquivado*).
- **Scripts de Fechamento Integrados:** Modelos de mensagens testadas para quebrar objeções e agendar reuniões ou fechar vendas direto no WhatsApp.
- **Dashboard com Métricas em Tempo Real:** Pipeline financeiro potencial, taxa de conversão, quantidade de leads auditados e faturamento projetado.
- **Paywall e Assinatura Stripe:** Sistema com autenticação de usuários, controle de sessões e integração de faturamento Stripe (Starter e Pro Ilimitado).

### Público-Alvo
- Agências de desenvolvimento web, web designers freelancers, agências de marketing digital e profissionais de vendas B2B.

***

## 2. User Experience & Visual Design

### Design System & Identidade Visual (Roxo & Preto)
Seguindo as diretrizes rigorosas da constituição de frontend:
- **Canvas Neutro (60%):** Fundo ultra-escuro obsidian/preto puro (`#050508` e `#0B0A12`) com iluminação ambiente sutil em tons de violeta profundo.
- **Superfícies Estruturais (30%):** Cartões e painéis em ardósia violeta fechada (`#13111C`), divisores refinados hairline (`border-purple-900/30` ou `border-white/10`), sem "cards dentro de cards".
- **Acentos e Destaque (10%):** Roxo elétrico e ultravioleta (`#7C3AED` e `#9333EA`) dedicados estritamente aos botões de ação primária (CTAs, status ativo, conversão).
- **Tipografia:** `Plus Jakarta Sans` para títulos e identidade, `Inter`/`DM Sans` para leitura técnica e `font-mono tabular-nums` para métricas, valores financeiros e contadores.
- **Zero-Pill Discipline:** Metadados limpos com separadores tipográficos (`·`, `/`) em vez de pílulas estáticas ou crachás poluídos.

### Fluxo do Usuário (Key User Flows)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ 1. Zero-State Minimalista                                                 │
│    Tela limpa com apenas a barra de busca por Área e Nicho Comercial      │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ Digita nicho e localidade (Enter)
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 2. Varredura no Google Maps & Enriquecimento de Dados                     │
│    Retorna estabelecimentos reais filtrando os que não têm site           │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ Exibe primeiros leads (Degustação)
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 3. Paywall Stripe Inteligente                                             │
│    3 leads desbloqueados para teste -> Bloqueio suave com planos Stripe   │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ Assinatura confirmada / Acesso Total
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 4. Painel Integrado: CRM Kanban + Scripts WhatsApp + Relatórios Express   │
│    Arrasta leads, envia mensagem com 1 clique, gera proposta e métricas   │
└───────────────────────────────────────────────────────────────────────────┘
```

1. **Visão Inicial Minimalista (Zero-State):**
   - Conforme solicitado, ao entrar na plataforma de busca não há poluição visual ou listas prévias. O foco é uma barra de comando centralizada e limpa: *[ Nicho do Negócio ]* + *[ Cidade / Região ]* com botão de varredura.
2. **Resultados e Painel de Leads:**
   - Ao executar a busca, a interface transiciona de forma fluida para a visualização de resultados, destacando:
     - Nome da empresa, foto/fachada (se disponível), categoria comercial.
     - Status: **Sem Site Registrado** (comprovação visual).
     - Botão de WhatsApp direto com mensagem pré-formatada personalizada.
     - Perfil do Instagram ou busca de menções.
     - Avaliações e nota média no Google Maps.
3. **Paywall e Sistema Stripe:**
   - O modo degustação exibe os 3 primeiros leads com detalhes abertos.
   - Os leads seguintes mostram cartão com efeito de desfoque seguro (*blur*) e modal de ativação de plano (Mensal R$ 97 / Anual R$ 890 com simulação Stripe Checkout segura e credenciais de produção prontas).
4. **CRM Kanban Integrado:**
   - Abas laterais/superiores para alternar entre **Scanner**, **Funil CRM**, **Gerador de Propostas** e **Dashboard Financeiro**.
   - Arrastar e soltar cards entre colunas, notas internas por cliente e histórico de contato.
5. **Dashboard de Performance:**
   - Métricas em tempo real com `tabular-nums`: Leads Encontrados, Taxa de Resposta, Negócios em Fechamento, Valor Projetado no Pipeline (R$).

***

## 3. Key Product Decisions & Trade-Offs

- **Estratégia de Busca no Google Maps:**
  - *Decisão:* Integração via proxy seguro backend / Google Places API oficial com detecção de presença de URL e fallback resiliente.
  - *Por que:* Garante dados autênticos, conformidade estrita com termos do Google e evita quebras de CORS no browser do cliente.
- **Paywall & Camada de Segurança:**
  - *Decisão:* Validação no estado central da aplicação e token de acesso de usuário com armazenamento seguro (`localStorage` com criptografia de sessão e validação server-side).
  - *Por que:* Impede que usuários burlem inspecionando elementos no DOM ou desabilitando CSS, além de oferecer o checkout com webhook/simulador de sucesso seguro.
- **CRM Local-First com Exportação:**
  - *Decisão:* Armazenamento em estado reativo persistente no navegador com suporte a exportação/importação em JSON e CSV.
  - *Por que:* Velocidade instantânea (<50ms para mover cards no Kanban), alta disponibilidade mesmo offline e sem latência de banco de dados para a experiência do usuário.

***

## 4. Technical Architecture & Data Strategy

### Diagrama de Arquitetura

```
┌───────────────────────────────────────────────────────────────────────────┐
│                             INTERFACE (React 19)                          │
├───────────────────────────────────────────────────────────────────────────┤
│  TopBar (Logo LeadMaps · Busca Rápida · Status do Plano · Perfil)         │
├─────────────────────┬─────────────────────────────────────────────────────┤
│   Sidebar / Tabs    │                 Área Principal                      │
│  ├─ 🔍 Scanner      │  ├─ Zero-State Search (Nicho + Cidade)              │
│  ├─ 📋 Leads Grid   │  ├─ Grid de Resultados + Detalhes + WhatsApp link   │
│  ├─ 📊 CRM Kanban   │  ├─ Colunas Kanban com Drag & Drop e Scripts        │
│  ├─ 📑 Propostas    │  ├─ Gerador de Auditoria e Proposta Comercial       │
│  └─ 📈 Dashboard    │  └─ KPIs em Tempo Real (Taxa de Conversão, Pipeline)│
├─────────────────────┴─────────────────────────────────────────────────────┤
│                Paywall & Stripe Modal (Trial 3 Leads / Checkout)          │
└───────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                      ESTADO & SERVIÇOS DO SISTEMA                         │
├───────────────────────────────────────────────────────────────────────────┤
│  • mapsService.ts: Requisições Google Places & Enriquecimento             │
│  • crmStore.ts: Estado do funil de vendas, notas e status                 │
│  • authBillingStore.ts: Sessão do usuário, Paywall & Stripe State         │
│  • proposalGenerator.ts: Templates de auditoria e scripts WhatsApp/Insta  │
└───────────────────────────────────────────────────────────────────────────┘
```

### Estrutura de Entidades de Dados
- **Lead / Empresa:**
  - `id`: identificador único
  - `name`: razão social ou nome fantasia
  - `category`: ramo de atividade (ex: Pizzaria, Mecânica)
  - `address`: endereço e bairro
  - `phone`: telefone formatado
  - `whatsappUrl`: link direto wa.me com mensagem inicial
  - `instagram`: perfil identificado ou link de pesquisa
  - `rating`: estrelas no Google Maps (1.0 a 5.0)
  - `userRatingsTotal`: número de avaliações
  - `hasWebsite`: boolean (false para os leads qualificados)
  - `stage`: estágio no Kanban (`novo`, `contatado`, `proposta`, `negociacao`, `fechado`, `perdido`)
  - `potentialValue`: valor estimado da venda de site (R$ 1.500 - R$ 3.500)
  - `notes`: anotações de negociação
- **Plano de Assinatura:**
  - `status`: `'trial'` | `'pro_monthly'` | `'pro_yearly'`
  - `searchesCount`: total de pesquisas executadas
  - `leadsUnlocked`: contador de leads liberados

***

## 5. Implementation Steps & Sequencing

1. **Configuração de Metadados e Estilo Global:**
   - Atualizar `metadata.json` com nome oficial ("LeadMaps Pro - Prospecção B2B de Sites") e descrição em português.
   - Configurar paleta de cores roxo/preto e fontes no `index.css` e `index.html`.
2. **Motor de Busca e Google Maps:**
   - Criar serviço de integração com Places API e catálogo com suporte a empresas reais em cidades brasileiras e internacionais.
   - Implementar filtro rigoroso de ausência de website e cálculo de score de oportunidade comercial.
3. **Tela Inicial Minimalista (Zero-State Search):**
   - Implementar tela sem distrações com barra centralizada para nicho e cidade/área, filtros rápidos e transição suave para os resultados.
4. **Enriquecimento de Contato & Scripts de Venda:**
   - Botões diretos para WhatsApp com textos persuasivos prontos para copiar ou abrir no app.
   - Gerador de proposta de auditoria em 1 clique mostrando o impacto de não ter site.
5. **CRM Kanban Interativo:**
   - Drag & drop de cards, atualização de status em tempo real, adição de notas de reunião e valor previsto de fechamento.
6. **Dashboard com Métricas em Tempo Real:**
   - Gráficos de volume de prospecção, distribuição por nicho, taxa de conversão e funil de vendas.
7. **Paywall Segura & Stripe Checkout:**
   - Modal de paywall ativado após a visualização dos 3 primeiros leads do plano gratuito.
   - Checkout do Stripe com alternância Mensal / Anual, garantias de segurança e desbloqueio instantâneo do acesso Pro.
8. **Compilação e Verificação:**
   - Validar build sem erros via `compile_applet`.
