import { BrandFormData, BasicGuide, CoreGuide, CompleteGuide } from '@/types'

// Mock AI guide generation - in production this would call n8n webhooks
export async function generateBasicGuide(brandData: BrandFormData): Promise<BasicGuide> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  const basicGuide: BasicGuide = {
    tone_summary: `${brandData.name} communicates with a ${brandData.voice_traits?.[0]?.toLowerCase() || 'professional'} and ${brandData.voice_traits?.[1]?.toLowerCase() || 'approachable'} tone. The brand focuses on serving ${brandData.audience} with clear, valuable messaging.`,
    
    key_traits: brandData.voice_traits || ['Professional', 'Trustworthy', 'Innovative'],
    
    brand_personality: `${brandData.name} embodies ${brandData.voice_traits?.[0] || 'professionalism'} while maintaining an ${brandData.voice_traits?.[1]?.toLowerCase() || 'approachable'} demeanor. The brand is positioned as a reliable partner for ${brandData.audience}.`,
    
    primary_audience: brandData.audience,
    
    basic_voice_notes: `Key voice characteristics:
• ${brandData.voice_traits?.[0] || 'Professional'}: Maintains expertise and authority
• ${brandData.voice_traits?.[1] || 'Trustworthy'}: Builds confidence through reliability  
• ${brandData.voice_traits?.[2] || 'Innovative'}: Shows forward-thinking approach

Communication should be direct yet warm, focusing on value delivery.`,

    content_direction: `Content should emphasize ${brandData.name}'s expertise while remaining accessible to ${brandData.audience}. Focus on practical solutions, clear benefits, and building trust through demonstration of knowledge and results.`
  }

  return basicGuide
}

export async function generateCoreGuide(brandData: BrandFormData): Promise<CoreGuide> {
  // Generate basic guide first
  const basicGuide = await generateBasicGuide(brandData)
  
  // Simulate additional processing
  await new Promise(resolve => setTimeout(resolve, 1000))

  const coreGuide: CoreGuide = {
    ...basicGuide,
    
    detailed_tone_analysis: {
      communication_style: 'Direct and informative with a consultative approach',
      formality_level: 7,
      emotional_tone: 'Confident and empowering',
      voice_characteristics: [
        'Expert without being condescending',
        'Helpful and solution-oriented',
        'Clear and concise communication',
        'Builds trust through transparency'
      ]
    },
    
    brand_positioning: `${brandData.name} is positioned as the go-to expert for ${brandData.audience} who need reliable, innovative solutions. We combine deep expertise with practical application to deliver results that matter.`,
    
    messaging_pillars: [
      'Expertise You Can Trust',
      'Practical Solutions That Work',
      'Innovation With Purpose',
      'Partnership for Success'
    ],
    
    content_themes: [
      'Industry insights and trends',
      'Best practices and how-to guides',
      'Success stories and case studies',
      'Innovation and future-forward thinking'
    ],
    
    do_use_examples: [
      `"${brandData.name} helps you achieve..."`,
      '"Our proven approach delivers..."',
      '"Designed specifically for..."',
      '"Based on our experience with..."'
    ],
    
    dont_use_examples: [
      '"Revolutionary breakthrough..."',
      '"Disruptive game-changer..."',
      '"One-size-fits-all solution..."',
      '"Guaranteed instant results..."'
    ],
    
    basic_visual_direction: 'Clean, professional design with trustworthy color palette (blues, grays). Typography should be highly readable with clear hierarchy. Visual elements should support credibility and expertise.'
  }

  return coreGuide
}

export async function generateCompleteGuide(brandData: BrandFormData): Promise<CompleteGuide> {
  // Generate core guide first
  const coreGuide = await generateCoreGuide(brandData)
  
  // Simulate additional processing
  await new Promise(resolve => setTimeout(resolve, 1500))

  const completeGuide: CompleteGuide = {
    ...coreGuide,
    
    comprehensive_visual_guidelines: {
      color_palette: {
        primary: '#2563eb', // Professional blue
        secondary: '#1e40af', // Darker blue
        accent: '#06b6d4', // Cyan for highlights
        neutral: '#64748b' // Slate gray
      },
      typography: {
        heading_style: 'Bold, modern sans-serif (Helvetica, Arial, or system font)',
        body_style: 'Clean, readable sans-serif optimized for screen and print',
        hierarchy_notes: 'Clear distinction between H1-H3, consistent line heights, adequate white space'
      },
      imagery_style: 'Professional photography with real people, clean illustrations when needed, consistent lighting and composition',
      design_principles: [
        'Simplicity over complexity',
        'Consistency in all touchpoints',
        'Accessibility-first design',
        'Mobile-responsive layouts',
        'Generous white space usage'
      ]
    },
    
    detailed_content_strategy: {
      content_pillars: [
        'Educational content that demonstrates expertise',
        'Success stories and social proof',
        'Industry insights and thought leadership',
        'Practical tools and resources'
      ],
      content_types: [
        'How-to guides and tutorials',
        'Case studies and success stories',
        'Industry reports and insights',
        'Tool reviews and comparisons',
        'Best practice frameworks'
      ],
      writing_guidelines: [
        'Lead with benefits, follow with features',
        'Use active voice and strong verbs',
        'Keep sentences under 20 words when possible',
        'Include specific examples and data',
        'End with clear next steps'
      ],
      formatting_rules: [
        'Use sentence case for headings',
        'Break up long text with subheadings',
        'Include bullet points for easy scanning',
        'Add relevant images or graphics',
        'Include clear calls-to-action'
      ]
    },
    
    reference_brands: ['Slack', 'Notion', 'Linear', 'Stripe', 'Figma'],
    
    ai_prompt: generateAIPrompt(brandData),
    
    advanced_recommendations: [
      'Develop a content calendar based on your messaging pillars',
      'Create brand voice training materials for your team',
      'Audit existing content against these guidelines',
      'Establish approval workflows for brand consistency',
      'Set up regular brand voice reviews and updates'
    ]
  }

  return completeGuide
}

function generateAIPrompt(brandData: BrandFormData): string {
  const traits = brandData.voice_traits || ['Professional', 'Trustworthy', 'Innovative']
  
  return `You are a professional content creator writing on behalf of ${brandData.name}. Follow these guidelines strictly:

Brand Name: ${brandData.name}
Mission: ${brandData.description}
Target Audience: ${brandData.audience}
Voice: ${traits.join(', ')}
Writing Style: Direct, informative, and consultative
Perspective: Third person
Tone: Confident yet approachable

Do Use:
• "${brandData.name} helps ${brandData.audience}..."
• "Our proven approach delivers..."
• "Based on our experience..."
• "Designed specifically for..."
• Clear, benefit-focused language

Don't Use:
• "Revolutionary breakthrough..."
• "Disruptive game-changer..."
• "One-size-fits-all solution..."
• Excessive buzzwords or hype language
• Generic promises without substance

Formatting:
• Headings: Sentence case
• Length: 50-150 words per section
• Structure: Problem → Solution → Benefit
• Call-to-action: Clear and specific
• Tone: Professional but accessible

Reference Brands: Slack, Notion, Linear (for voice inspiration)

Always focus on practical value and specific benefits for ${brandData.audience}. Use this voice consistently across all content unless instructed otherwise.`
}

// Updated pricing tiers with free basic guide
export const PRICING_TIERS = [
  {
    type: 'basic' as const,
    name: 'Basic Guide',
    price: 0,
    description: 'Essential brand insights to get started',
    features: [
      'Tone of voice summary',
      'Key brand traits',
      'Basic personality analysis',
      'Content direction notes',
      'Always free'
    ]
  },
  {
    type: 'core' as const,
    name: 'Core Guide',
    price: 29,
    description: 'Detailed brand guidelines for consistent messaging',
    features: [
      'Everything in Basic',
      'Detailed tone analysis',
      'Messaging pillars & themes',
      'Do/Don\'t use examples',
      'Brand positioning',
      'PDF download'
    ],
    stripe_price_id: 'price_core_guide'
  },
  {
    type: 'complete' as const,
    name: 'Complete Guide',
    price: 59,
    description: 'Comprehensive brand system with AI prompts',
    features: [
      'Everything in Core',
      'Visual guidelines & colors',
      'Content strategy framework',
      'AI prompt for ChatGPT/Claude',
      'PDF, Markdown & Text downloads',
      'Advanced recommendations'
    ],
    stripe_price_id: 'price_complete_guide'
  }
]