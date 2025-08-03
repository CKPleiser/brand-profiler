# n8n + OpenAI Integration Setup Guide

This guide covers setting up n8n workflows to generate AI-powered brand guides for both **free basic guides** and **paid premium guides**.

## 📋 Overview

The Brand Profiler uses n8n to handle AI content generation:

- **Free Basic Guide**: Generated immediately when user submits brand form
- **Paid Guides**: Generated after successful Stripe payment
- **OpenAI Integration**: Uses GPT-4 to create comprehensive brand analysis

## 🛠️ Prerequisites

1. **n8n Instance**: Cloud (n8n.cloud) or self-hosted
2. **OpenAI API Key**: From https://platform.openai.com
3. **Domain Access**: n8n must be accessible from your Vercel app

## 🚀 n8n Cloud Setup (Recommended)

### 1. Create n8n Account
1. Go to https://n8n.cloud
2. Sign up for an account
3. Create a new workflow

### 2. Configure OpenAI Credentials
1. In n8n, go to **Settings** → **Credentials**
2. Click **Add Credential**
3. Select **OpenAI**
4. Enter your OpenAI API key
5. Test connection and save

## 🔧 Workflow Setup

You need to create **TWO workflows**:

### Workflow 1: Basic Guide Generation
- **Webhook URL**: `/webhook/basic-guide`
- **Purpose**: Generate free basic guides immediately
- **Trigger**: HTTP POST from brand form submission

### Workflow 2: Premium Guide Generation  
- **Webhook URL**: `/webhook/premium-guide`
- **Purpose**: Generate paid guides after payment
- **Trigger**: HTTP POST from Stripe webhook handler

## 📝 Workflow 1: Basic Guide Generation

### Webhook Trigger Node
```json
{
  "httpMethod": "POST",
  "path": "basic-guide",
  "responseMode": "responseNode"
}
```

### Expected Input Data
```json
{
  "brandName": "Acme Corp",
  "domain": "https://acme.com",
  "description": "B2B software solutions for enterprises",
  "audience": "CTOs and IT Directors", 
  "voiceTraits": ["Professional", "Trustworthy", "Innovative"],
  "language": "English"
}
```

### OpenAI Node Configuration
- **Model**: `gpt-4`
- **Temperature**: `0.7`
- **Max Tokens**: `1500`

### OpenAI Prompt for Basic Guide
```
You are a brand strategist creating a basic brand guide. Analyze the provided brand information and create a concise but valuable brand analysis.

Brand Information:
- Name: {{$json.brandName}}
- Website: {{$json.domain}}
- Description: {{$json.description}}
- Target Audience: {{$json.audience}}
- Voice Traits: {{$json.voiceTraits}}
- Language: {{$json.language}}

Create a JSON response with the following structure:
{
  "tone_summary": "2-3 sentences describing the brand's communication tone and approach",
  "key_traits": ["trait1", "trait2", "trait3", "trait4", "trait5"],
  "brand_personality": "2-3 sentences describing the brand's personality and positioning",
  "content_direction": "2-3 sentences with specific content guidance and messaging direction"
}

Requirements:
- Keep responses concise but valuable
- Focus on actionable insights
- Tailor analysis to the target audience
- Ensure tone_summary reflects the voice traits
- Make key_traits specific and relevant
- Provide clear content direction

Respond only with valid JSON.
```

### Response Node
```json
{
  "success": true,
  "data": "{{$json}}",
  "tier": "basic"
}
```

## 📝 Workflow 2: Premium Guide Generation

### Webhook Trigger Node
```json
{
  "httpMethod": "POST", 
  "path": "premium-guide",
  "responseMode": "responseNode"
}
```

### Expected Input Data
```json
{
  "tier": "core" | "complete",
  "brandName": "Acme Corp",
  "domain": "https://acme.com", 
  "description": "B2B software solutions for enterprises",
  "audience": "CTOs and IT Directors",
  "voiceTraits": ["Professional", "Trustworthy", "Innovative"],
  "language": "English",
  "stripeSessionId": "cs_...",
  "customerEmail": "user@example.com"
}
```

### OpenAI Node Configuration
- **Model**: `gpt-4`
- **Temperature**: `0.7`
- **Max Tokens**: `3000` (Core) / `4000` (Complete)

### OpenAI Prompt for Core Guide
```
You are a senior brand strategist creating a comprehensive Core brand guide. Analyze the brand information and create detailed guidelines that build upon basic brand analysis.

Brand Information:
- Name: {{$json.brandName}}
- Website: {{$json.domain}}
- Description: {{$json.description}}
- Target Audience: {{$json.audience}}
- Voice Traits: {{$json.voiceTraits}}
- Language: {{$json.language}}

Create a JSON response with this structure:
{
  "tone_summary": "Detailed 3-4 sentence analysis of communication tone",
  "key_traits": ["trait1", "trait2", "trait3", "trait4", "trait5", "trait6"],
  "brand_personality": "Comprehensive 4-5 sentence personality analysis with archetype identification",
  "primary_audience": "Detailed audience description with demographics and psychographics",
  "content_direction": "Specific content strategy with themes, topics, and messaging pillars",
  "voice_guidelines": {
    "formality_level": "Professional/Casual/Conversational", 
    "emotional_tone": "Description of emotional approach",
    "communication_style": "Specific style guidelines",
    "dos": ["Do use...", "Do emphasize...", "Do maintain..."],
    "donts": ["Don't use...", "Don't sound...", "Don't ignore..."]
  },
  "messaging_pillars": [
    {
      "title": "Pillar 1 Title",
      "description": "What this pillar represents",
      "key_messages": ["Message 1", "Message 2", "Message 3"]
    },
    {
      "title": "Pillar 2 Title", 
      "description": "What this pillar represents",
      "key_messages": ["Message 1", "Message 2", "Message 3"]
    },
    {
      "title": "Pillar 3 Title",
      "description": "What this pillar represents", 
      "key_messages": ["Message 1", "Message 2", "Message 3"]
    }
  ]
}

Requirements:
- Provide actionable, specific guidance
- Include industry-relevant insights
- Tailor all content to the target audience
- Ensure consistency across all elements
- Make guidelines practical for content creators

Respond only with valid JSON.
```

### OpenAI Prompt for Complete Guide
```
You are a senior brand strategist creating a comprehensive Complete brand guide with all features. This is the premium tier that includes everything from Core plus advanced features.

Brand Information:
- Name: {{$json.brandName}}
- Website: {{$json.domain}}
- Description: {{$json.description}}
- Target Audience: {{$json.audience}}
- Voice Traits: {{$json.voiceTraits}}
- Language: {{$json.language}}

Create a JSON response with this comprehensive structure:
{
  "tone_summary": "Detailed 4-5 sentence analysis of communication tone with nuances",
  "key_traits": ["trait1", "trait2", "trait3", "trait4", "trait5", "trait6", "trait7"],
  "brand_personality": "Comprehensive personality analysis with archetype, values, and brand character",
  "primary_audience": "Detailed audience personas with demographics, psychographics, and behavioral insights",
  "content_direction": "Complete content strategy framework with themes, topics, messaging pillars, and content types",
  "voice_guidelines": {
    "formality_level": "Professional/Casual/Conversational",
    "emotional_tone": "Detailed emotional approach with examples",
    "communication_style": "Comprehensive style guidelines with specific language patterns",
    "dos": ["Do use...", "Do emphasize...", "Do maintain...", "Do consider...", "Do leverage..."],
    "donts": ["Don't use...", "Don't sound...", "Don't ignore...", "Don't overuse...", "Don't neglect..."]
  },
  "messaging_pillars": [
    {
      "title": "Pillar 1 Title",
      "description": "What this pillar represents", 
      "key_messages": ["Message 1", "Message 2", "Message 3", "Message 4"],
      "content_themes": ["Theme 1", "Theme 2", "Theme 3"]
    },
    {
      "title": "Pillar 2 Title",
      "description": "What this pillar represents",
      "key_messages": ["Message 1", "Message 2", "Message 3", "Message 4"],
      "content_themes": ["Theme 1", "Theme 2", "Theme 3"]
    },
    {
      "title": "Pillar 3 Title", 
      "description": "What this pillar represents",
      "key_messages": ["Message 1", "Message 2", "Message 3", "Message 4"],
      "content_themes": ["Theme 1", "Theme 2", "Theme 3"]
    }
  ],
  "visual_guidelines": {
    "color_recommendations": "Suggested color palette approach with rationale",
    "typography_style": "Font personality and hierarchy recommendations", 
    "imagery_mood": "Visual style and imagery direction",
    "design_principles": ["Principle 1", "Principle 2", "Principle 3", "Principle 4"]
  },
  "content_strategy": {
    "content_types": ["Blog posts", "Social media", "Email", "Website copy", "Marketing materials"],
    "content_themes": ["Theme 1", "Theme 2", "Theme 3", "Theme 4"],
    "content_calendar_suggestions": "Recommendations for content planning and scheduling"
  },
  "ai_prompt": "You are a content creator for {{$json.brandName}}. {{tone_summary}} {{brand_personality}} When creating content:\n\nTone & Voice:\n- {{voice_guidelines.communication_style}}\n- {{voice_guidelines.emotional_tone}}\n- Formality: {{voice_guidelines.formality_level}}\n\nKey Messaging:\n- {{messaging_pillars[0].title}}: {{messaging_pillars[0].description}}\n- {{messaging_pillars[1].title}}: {{messaging_pillars[1].description}} \n- {{messaging_pillars[2].title}}: {{messaging_pillars[2].description}}\n\nTarget Audience: {{primary_audience}}\n\nContent Direction: {{content_direction}}\n\nDO: {{voice_guidelines.dos[0]}}, {{voice_guidelines.dos[1]}}, {{voice_guidelines.dos[2]}}\nDON'T: {{voice_guidelines.donts[0]}}, {{voice_guidelines.donts[1]}}, {{voice_guidelines.donts[2]}}\n\nAlways maintain the brand's {{key_traits[0]}}, {{key_traits[1]}}, and {{key_traits[2]}} characteristics in all communications."
}

Requirements:
- Provide comprehensive, actionable guidance
- Include specific examples and recommendations
- Create a detailed AI prompt for content generation
- Ensure all sections work together cohesively
- Make the guide immediately useful for content teams

Respond only with valid JSON.
```

### Response Node for Premium
```json
{
  "success": true,
  "data": "{{$json}}",
  "tier": "{{$json.tier}}",
  "session_id": "{{$json.stripeSessionId}}"
}
```

## 🔗 Integration with Your App

### 1. Add n8n Environment Variable
```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
```

### 2. Update Brand Form Submission
In your landing page, after form submission, call the basic guide webhook:

```javascript
// In src/app/page.tsx - after form submission
const response = await fetch(`${process.env.N8N_WEBHOOK_URL}/basic-guide`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(brandData)
})

const aiGuide = await response.json()
// Use aiGuide.data instead of mock data
```

### 3. Update Stripe Webhook Handler
In `src/app/api/webhook/stripe/route.ts`, add n8n call after successful payment:

```javascript
// After payment confirmed
if (session.payment_status === 'paid') {
  const brandData = JSON.parse(session.metadata.brandData)
  
  // Call n8n for premium guide generation
  const response = await fetch(`${process.env.N8N_WEBHOOK_URL}/premium-guide`, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...brandData,
      tier: session.metadata.tier,
      stripeSessionId: session.id,
      customerEmail: session.customer_email
    })
  })
  
  const premiumGuide = await response.json()
  
  // Store in Supabase and unlock tier
  // ... rest of webhook logic
}
```

## 📁 n8n Workflow JSON Files

I'll create the complete workflow JSON files that you can import directly into n8n:

### Basic Guide Workflow
- File: `n8n-basic-guide-workflow.json`
- Import this into n8n for immediate setup

### Premium Guide Workflow  
- File: `n8n-premium-guide-workflow.json`
- Import this into n8n for paid guide generation

## 🧪 Testing

### Test Basic Guide Webhook
```bash
curl -X POST https://your-n8n-instance.com/webhook/basic-guide \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Test Brand",
    "domain": "https://test.com",
    "description": "A test brand description",
    "audience": "Test audience", 
    "voiceTraits": ["Professional", "Friendly"],
    "language": "English"
  }'
```

### Test Premium Guide Webhook
```bash
curl -X POST https://your-n8n-instance.com/webhook/premium-guide \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "complete",
    "brandName": "Test Brand",
    "domain": "https://test.com",
    "description": "A test brand description", 
    "audience": "Test audience",
    "voiceTraits": ["Professional", "Friendly"],
    "language": "English",
    "stripeSessionId": "cs_test_123",
    "customerEmail": "test@example.com"
  }'
```

## 🔧 Troubleshooting

### Common Issues

1. **Webhook Not Responding**
   - Check n8n workflow is active
   - Verify webhook URL is correct
   - Check n8n execution logs

2. **OpenAI Errors**
   - Verify API key is correct
   - Check OpenAI usage limits
   - Review prompt formatting

3. **JSON Parse Errors**
   - OpenAI response must be valid JSON
   - Add error handling in workflow
   - Check response format in n8n logs

4. **Timeout Issues**
   - Increase webhook timeout settings
   - Optimize OpenAI prompts for faster response
   - Add retry logic in your app

## 📈 Monitoring

### Key Metrics to Track
- Webhook response times
- OpenAI token usage
- Success/failure rates
- Guide generation quality

### n8n Monitoring
- Enable workflow metrics
- Set up error notifications
- Monitor execution logs
- Track API usage

This setup ensures both free and paid users get AI-generated content while maintaining a smooth user experience and proper error handling.