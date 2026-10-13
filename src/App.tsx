/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ZeroStateSearch } from './components/ZeroStateSearch';
import { LeadsView } from './components/LeadsView';
import { CrmKanban } from './components/CrmKanban';
import { DashboardView } from './components/DashboardView';
import { ScriptsView } from './components/ScriptsView';
import { PaywallModal } from './components/PaywallModal';
import { AuditProposalModal } from './components/AuditProposalModal';
import { Lead, SearchFilters, UserAccount, StageId } from './types';
import { searchGooglePlaces } from './services/googlePlaces';
import {
  getUserAccount,
  saveUserAccount,
  getCrmLeads,
  saveCrmLeads,
  addLeadToCrm,
  updateLeadStage,
  updateLeadNotes,
  updateLeadValue,
  removeLeadFromCrm,
} from './services/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'leads' | 'crm' | 'dashboard' | 'scripts'>('search');
  const [user, setUser] = useState<UserAccount>(getUserAccount);
  const [crmLeads, setCrmLeads] = useState<Lead[]>(getCrmLeads);
  const [searchedLeads, setSearchedLeads] = useState<Lead[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [selectedAuditLead, setSelectedAuditLead] = useState<Lead | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sincroniza persistência
  useEffect(() => {
    saveUserAccount(user);
  }, [user]);

  useEffect(() => {
    saveCrmLeads(crmLeads);
  }, [crmLeads]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoadingSearch(true);
    try {
      const results = await searchGooglePlaces(filters);
      setSearchedLeads(results);
      setActiveTab('leads');
      showToast(`${results.length} empresas encontradas no Google Maps`);
    } catch (err) {
      console.error('Erro na busca de locais:', err);
      showToast('Erro ao realizar a busca. Tente novamente.');
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleAddToCrm = (lead: Lead) => {
    const { added, lead: savedLead } = addLeadToCrm(lead);
    if (added) {
      setCrmLeads((prev) => [savedLead, ...prev]);
      showToast(`"${lead.name}" adicionado ao funil CRM`);
    } else {
      showToast(`"${lead.name}" já está no CRM`);
    }
  };

  const handleUpdateStage = (leadId: string, stage: StageId) => {
    const updated = updateLeadStage(leadId, stage);
    setCrmLeads(updated);
  };

  const handleUpdateNotes = (leadId: string, notes: string) => {
    const updated = updateLeadNotes(leadId, notes);
    setCrmLeads(updated);
    showToast('Anotação salva');
  };

  const handleUpdateValue = (leadId: string, value: number) => {
    const updated = updateLeadValue(leadId, value);
    setCrmLeads(updated);
    showToast('Valor atualizado');
  };

  const handleRemoveLead = (leadId: string) => {
    const updated = removeLeadFromCrm(leadId);
    setCrmLeads(updated);
    showToast('Lead removido do funil');
  };

  const handleSubscribeSuccess = (plan: 'pro_monthly' | 'pro_yearly') => {
    const updatedUser: UserAccount = {
      ...user,
      plan,
      isSubscribed: true,
      subscriptionDate: new Date().toISOString(),
    };
    setUser(updatedUser);
    showToast('🎉 Assinatura confirmada com sucesso! Acesso Pro ativado.');
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#f1f0f7] flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#120e22] text-purple-200 border border-purple-700/60 shadow-xl shadow-purple-950/60 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        crmCount={crmLeads.length}
        leadsCount={searchedLeads.length}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* Zero State Search - Clean Initial View as requested */}
        {activeTab === 'search' && (
          <ZeroStateSearch onSearch={handleSearch} isLoading={isLoadingSearch} />
        )}

        {/* Discovered Leads Results */}
        {activeTab === 'leads' && (
          <LeadsView
            leads={searchedLeads}
            user={user}
            crmLeads={crmLeads}
            onAddToCrm={handleAddToCrm}
            onOpenAudit={(lead) => setSelectedAuditLead(lead)}
            onOpenPaywall={() => setIsPaywallOpen(true)}
            onResetSearch={() => setActiveTab('search')}
          />
        )}

        {/* CRM Kanban Sales Funnel */}
        {activeTab === 'crm' && (
          <CrmKanban
            leads={crmLeads}
            onUpdateStage={handleUpdateStage}
            onUpdateNotes={handleUpdateNotes}
            onUpdateValue={handleUpdateValue}
            onRemoveLead={handleRemoveLead}
            onOpenAudit={(lead) => setSelectedAuditLead(lead)}
            onSwitchToSearch={() => setActiveTab('search')}
          />
        )}

        {/* Real-time Performance Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView
            crmLeads={crmLeads}
            searchedLeads={searchedLeads}
            onSwitchToSearch={() => setActiveTab('search')}
            onSwitchToCrm={() => setActiveTab('crm')}
          />
        )}

        {/* Ready-to-use Sales Scripts */}
        {activeTab === 'scripts' && <ScriptsView />}
      </main>

      {/* Paywall & Stripe Subscription Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSubscribeSuccess={handleSubscribeSuccess}
        user={user}
      />

      {/* Diagnostic & Commercial Proposal Modal */}
      <AuditProposalModal
        lead={selectedAuditLead}
        onClose={() => setSelectedAuditLead(null)}
      />
    </div>
  );
}
