import { Lead, UserAccount, StageId } from '../types';

const CRM_LEADS_STORAGE_KEY = 'leadmaps_crm_leads_v1';
const USER_ACCOUNT_STORAGE_KEY = 'leadmaps_user_account_v1';

export const DEFAULT_USER: UserAccount = {
  id: 'usr_premium_demo',
  email: 'ronalldrobert@gmail.com',
  name: 'Ronalld Robert',
  plan: 'trial',
  trialLeadsViewed: 0,
  maxTrialLeads: 3,
  isSubscribed: false,
};

export function getUserAccount(): UserAccount {
  try {
    const raw = localStorage.getItem(USER_ACCOUNT_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Erro ao ler conta do usuário:', err);
  }
  return DEFAULT_USER;
}

export function saveUserAccount(user: UserAccount): void {
  try {
    localStorage.setItem(USER_ACCOUNT_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Erro ao salvar conta do usuário:', err);
  }
}

export function getCrmLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(CRM_LEADS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Erro ao ler leads do CRM:', err);
  }
  return [];
}

export function saveCrmLeads(leads: Lead[]): void {
  try {
    localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error('Erro ao salvar leads do CRM:', err);
  }
}

export function addLeadToCrm(lead: Lead): { added: boolean; lead: Lead } {
  const leads = getCrmLeads();
  const existingIndex = leads.findIndex(l => l.id === lead.id || (l.name === lead.name && l.phone === lead.phone));
  
  if (existingIndex >= 0) {
    return { added: false, lead: leads[existingIndex] };
  }

  const newLead: Lead = {
    ...lead,
    stage: 'novo',
    createdAt: new Date().toISOString(),
  };

  const updated = [newLead, ...leads];
  saveCrmLeads(updated);
  return { added: true, lead: newLead };
}

export function updateLeadStage(leadId: string, stage: StageId): Lead[] {
  const leads = getCrmLeads();
  const updated = leads.map(lead => {
    if (lead.id === leadId) {
      return {
        ...lead,
        stage,
        lastContactDate: new Date().toISOString(),
      };
    }
    return lead;
  });
  saveCrmLeads(updated);
  return updated;
}

export function updateLeadNotes(leadId: string, notes: string): Lead[] {
  const leads = getCrmLeads();
  const updated = leads.map(lead => {
    if (lead.id === leadId) {
      return { ...lead, notes };
    }
    return lead;
  });
  saveCrmLeads(updated);
  return updated;
}

export function updateLeadValue(leadId: string, potentialValue: number): Lead[] {
  const leads = getCrmLeads();
  const updated = leads.map(lead => {
    if (lead.id === leadId) {
      return { ...lead, potentialValue };
    }
    return lead;
  });
  saveCrmLeads(updated);
  return updated;
}

export function removeLeadFromCrm(leadId: string): Lead[] {
  const leads = getCrmLeads();
  const updated = leads.filter(l => l.id !== leadId);
  saveCrmLeads(updated);
  return updated;
}
