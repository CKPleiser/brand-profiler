# Brand Style Guide Generator

AI-powered tool that generates professional brand style guides including tone of voice, brand personality, and visual direction.

## Features

### ✅ Completed (MVP)
- **Smart Input Detection**: Automatically detects URL vs description input
- **Editable Brand Form**: Auto-filled form with brand information
- **Guide Preview**: Shows preview with upgrade prompts
- **Complete Style Guide**: Full brand guidelines after "purchase"
- **AI Prompt Generator**: ChatGPT/Claude-ready prompts for content creation
- **Multi-Format Downloads**: PDF, Markdown, and Text formats
- **LocalStorage Persistence**: Form data recovery
- **Responsive Design**: Clean, modern UI with Shadcn UI components

### 🔧 Tech Stack
- **Frontend**: Next.js 15 + TypeScript
- **UI**: Shadcn UI + Tailwind CSS
- **Icons**: Lucide React
- **State**: React hooks + localStorage

### 🚧 To Be Implemented (Production)
- Supabase database integration
- Stripe payment processing
- n8n webhook integration for AI generation
- Email delivery system
- Real web scraping for URL content
- Actual AI API integration (OpenAI, Claude)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## User Flow

1. **Landing Page**: Enter domain URL or brand description
2. **Brand Form**: Review and edit auto-detected information
3. **Preview**: See guide preview with pricing options
4. **Purchase**: Select Core ($29) or Complete ($59) guide
5. **Complete Guide**: Access full style guide with downloads

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── guide/
│   │   ├── preview/        # Guide preview with pricing
│   │   └── complete/       # Complete guide after purchase
│   ├── globals.css         # Global styles + Tailwind
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/ui/          # Shadcn UI components
├── lib/
│   ├── utils.ts           # Utility functions
│   └── guide-generator.ts # Mock AI guide generation
└── types/
    └── index.ts           # TypeScript definitions
```

## Key Components

- **BrandFormData**: Brand information structure
- **GuidePreview**: Preview data for teaser
- **CompleteGuide**: Full guide with all sections
- **PRICING_TIERS**: Core vs Complete pricing

## Mock Data

Currently uses realistic mock data to demonstrate the full user experience. All analysis results are generated locally for development and testing.

## Next Steps for Production

1. **Database Setup**: Configure Supabase tables (brands, guides, payments)
2. **Payment Integration**: Set up Stripe checkout flows
3. **AI Integration**: Connect to OpenAI/Claude APIs via n8n
4. **Web Scraping**: Implement content extraction from URLs
5. **Email System**: Set up delivery and follow-up automation
6. **Analytics**: Add conversion tracking and usage metrics

## Business Model

- **Core Guide**: $29 - Essential brand guidelines
- **Complete Guide**: $59 - Full style guide with AI prompts
- **Target**: 50-100 guides/month for sustainable revenue

---

*Built with Next.js, Shadcn UI, and modern web technologies for optimal performance and user experience.*