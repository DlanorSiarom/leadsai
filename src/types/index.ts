export type StageId = 'novo' | 'contatado' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';

export interface Lead {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  state?: string;
  phone: string;
  cleanPhone: string;
  whatsappUrl: string;
  instagramHandle?: string;
  instagramUrl?: string;
  rating: number;
  reviewCount: number;
  hasWebsite: boolean;
  websiteUrl?: string;
  googleMapsUrl?: string;
  photoUrl?: string;
  placeId?: string;
  stage: StageId;
  potentialValue: number;
  notes: string;
  createdAt: string;
  lastContactDate?: string;
  opportunityScore: number; // 0 - 100 based on reviews, category, and lack of site
  quickPitch?: string;
}

export interface CRMStage {
  id: StageId;
  title: string;
  description: string;
  color: string;
  badgeBg: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  plan: 'trial' | 'pro_monthly' | 'pro_yearly';
  trialLeadsViewed: number;
  maxTrialLeads: number;
  isSubscribed: boolean;
  subscriptionDate?: string;
}

export interface SearchFilters {
  niche: string;
  location: string;
  onlyWithoutWebsite: boolean;
  minRating: number;
}

export interface MetricSummary {
  totalLeads: number;
  leadsWithoutWebsite: number;
  contactedCount: number;
  proposalsSentCount: number;
  closedWonCount: number;
  pipelineValue: number;
  wonRevenue: number;
  conversionRate: number;
}
