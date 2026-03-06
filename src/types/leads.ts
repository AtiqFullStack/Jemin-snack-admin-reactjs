export type LeadStage =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal'
  | 'Won'
  | 'Lost';

export type LeadSource =
  | 'Facebook'
  | 'Referral'
  | 'Website'
  | 'Walk-in'
  | 'Instagram';
export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal'
  | 'Won'
  | 'Lost';

export type LeadFormValues = {
  status: LeadStatus;
  source: LeadSource;
  assigned: string;
  tags?: string[];

  name: string;
  position?: string;
  email?: string;
  website?: string;
  phone?: string;
  lead_value?: number;
  company?: string;

  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  language?: string;

  description?: string;
  is_public?: boolean;
  contacted_today?: boolean;
};

export type Lead = {
  _id: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: any;
  name: string;
  position?: string;
  email: string;
  website?: string;
  phone: string;
  company: string;
  leadValue?: number;
  tags?: string[];
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  language?: string;
  description?: string;
  isPublic?: boolean;
  lastContactedAt?: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  createdBy: any;
};
