export interface Brand {
  id?: string;
  name: string;
  domain?: string;
  description: string;
  audience: string;
  voice_traits: string[];
  language: string;
  user_email?: string;
  created_at?: string;
}

export interface Guide {
  id?: string;
  brand_id?: string;
  // Free basic guide (always available)
  basic_guide: {
    tone_summary: string;
    key_traits: string[];
    brand_personality: string;
    primary_audience: string;
    basic_voice_notes: string;
  };
  // Paid guides (locked until purchased)
  core_guide?: string; // JSON string of detailed guide
  complete_guide?: string; // JSON string of comprehensive guide
  ai_prompt?: string; // Only available with Complete guide
  format_links?: {
    pdf?: string;
    markdown?: string;
    text?: string;
  };
  unlocked_tiers: ('basic' | 'core' | 'complete')[];
  created_at?: string;
}

export interface Payment {
  id?: string;
  guide_id: string;
  stripe_session: string;
  tier: 'core' | 'complete';
  amount: number;
  status: string;
  promo_code?: string;
  created_at?: string;
}

export interface BrandFormData {
  name: string;
  domain: string;
  description: string;
  audience: string;
  voice_traits: string[];
  language: string;
  user_email: string;
}

// Free basic guide - always generated
export interface BasicGuide {
  tone_summary: string;
  key_traits: string[];
  brand_personality: string;
  primary_audience: string;
  basic_voice_notes: string;
  content_direction: string;
}

// Core guide ($29) - includes everything from basic plus detailed analysis
export interface CoreGuide extends BasicGuide {
  detailed_tone_analysis: {
    communication_style: string;
    formality_level: number;
    emotional_tone: string;
    voice_characteristics: string[];
  };
  brand_positioning: string;
  messaging_pillars: string[];
  content_themes: string[];
  do_use_examples: string[];
  dont_use_examples: string[];
  basic_visual_direction: string;
}

// Complete guide ($59) - includes everything from core plus AI prompts and advanced features
export interface CompleteGuide extends CoreGuide {
  comprehensive_visual_guidelines: {
    color_palette: {
      primary: string;
      secondary: string;
      accent: string;
      neutral: string;
    };
    typography: {
      heading_style: string;
      body_style: string;
      hierarchy_notes: string;
    };
    imagery_style: string;
    design_principles: string[];
  };
  detailed_content_strategy: {
    content_pillars: string[];
    content_types: string[];
    writing_guidelines: string[];
    formatting_rules: string[];
  };
  reference_brands: string[];
  ai_prompt: string;
  advanced_recommendations: string[];
}

export type GuideType = 'basic' | 'core' | 'complete';

export interface PricingTier {
  type: GuideType;
  name: string;
  price: number;
  description: string;
  features: string[];
  stripe_price_id?: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  progress: string;
  basicGuide: BasicGuide | null;
  error: string | null;
}