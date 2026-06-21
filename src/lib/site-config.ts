// ── Keywords ──
export interface Keyword {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  intent: 'informational' | 'commercial' | 'transactional';
  userComplaints: string[];
}

// ── Source Data ──
export interface SourceData {
  [key: string]: unknown;
  _meta: {
    sources: string[];
    freshnessTTL_days: number;
    collectedAt: string;
    verifiedBySecondSource: boolean;
  };
}

// ── Page Content ──
export interface PageSection {
  type: 'text' | 'tool' | 'table' | 'comparison';
  heading: string;
  body: string;
  toolEmbed?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface AffiliateCTA {
  productName: string;
  link: string;
  platform: 'amazon' | 'homedepot' | 'partners' | 'shareasale';
  disclosureText: string;
}

export interface PageContent {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  introBody?: string;
  sections: PageSection[];
  dataCards?: Array<{
    title: string;
    subtitle: string;
    stats: Array<{ label: string; value: string }>;
    notes?: string;
  }>;
  faqs: FAQ[];
  affiliateCTA: AffiliateCTA | null;
  lastUpdated?: string;
  author?: {
    name: string;
    url: string;
    jobTitle?: string;
  };
}

// ── Design Config (6D randomization) ──
export interface ComponentStyles {
  buttonRadius: number;
  cardShadow: 'none' | 'sm' | 'md' | 'lg';
  inputStyle: 'outlined' | 'filled' | 'underlined';
}

export interface DesignConfig {
  colorScheme: string;
  fontPair: string;
  layout: string;
  componentStyles: ComponentStyles;
  brandName: string;
  tagline?: string;
  voice?: string;
}

// ── Site Config ──
export interface GrowthStage {
  stage: 'seed' | 'sprout' | 'growth' | 'mature';
  startWeek: number;
  pageCount: number;
  pageTypes: string[];
}

export interface SiteConfig {
  slug: string;
  domain: string;
  niche: string;
  template: 'A' | 'B' | 'C';
  targetCountry: string;
  language: string;
  keywords: Keyword[];
  designConfig: DesignConfig;
  growthPlan: GrowthStage[];
}

// ── Agent Task ──
export interface AgentTask {
  id: string;
  agentName: string;
  siteSlug: string;
  status: 'pending' | 'running' | 'done' | 'failed';
  input: unknown;
  output?: unknown;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}
