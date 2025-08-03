# Brand Profiler Deployment Guide

## Prerequisites
- Supabase account
- Stripe account  
- Vercel account (or preferred hosting)

## 1. Supabase Setup (5 minutes)

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for setup to complete

### Setup Database
1. Go to SQL Editor in Supabase dashboard
2. Copy contents of `supabase-schema.sql`
3. Run the SQL to create tables and policies

### Get API Keys
```bash
# Copy from Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://sgqlfwvobpfuvvltzzeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNncWxmd3ZvYnBmdXZ2bHR6emVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxODc5NjksImV4cCI6MjA2OTc2Mzk2OX0.RjGA8uL8UE41x9YVSFOCilBnDoOpN-C2Ii5cOsC1WbE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNncWxmd3ZvYnBmdXZ2bHR6emVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE4Nzk2OSwiZXhwIjoyMDY5NzYzOTY5fQ.5kqIMQ4xvqtkPezCAoVMcAXjbCM4kHQE_XKQWAfzj80
```

## 2. Stripe Setup (10 minutes)

### Create Products
1. Go to Stripe Dashboard > Products
2. Create two products:
   - **Core Guide**: $29.00 (one-time payment)
   - **Complete Guide**: $59.00 (one-time payment)

### Get API Keys & Price IDs
```bash
# From Stripe Dashboard > Developers > API Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# From Products page, click each product to get price IDs
# Update in src/lib/stripe.ts:
price_core_guide=price_...
price_complete_guide=price_...
```

### Setup Webhook
1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook/stripe`
3. Select events: `checkout.session.completed`, `checkout.session.expired`
4. Copy webhook secret:
```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 3. Update Configuration

### Update Environment Variables
Create `.env.local`:
```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key  
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Update Price IDs
In `src/lib/stripe.ts`, replace placeholder price IDs:
```typescript
export const PRICING_CONFIG = {
  core: {
    price_id: 'price_your_actual_core_price_id',
    // ...
  },
  complete: {
    price_id: 'price_your_actual_complete_price_id', 
    // ...
  }
}
```

## 4. Deploy to Vercel

### Initial Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Or via CLI:
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# ... add all environment variables
```

### Update Stripe Webhook URL
1. Go back to Stripe Dashboard > Webhooks
2. Update endpoint URL to your production domain
3. Test webhook with Stripe CLI if needed

## 5. Test Everything

### Free Flow
1. Go to your deployed site
2. Enter brand information
3. Verify free basic guide generates
4. Check Supabase to confirm data saved

### Payment Flow  
1. From basic guide, click upgrade
2. Test Core Guide purchase ($29)
3. Test Complete Guide purchase ($59)
4. Verify webhook processes payment
5. Confirm guide tiers unlock in database

### Error Handling
- Test with invalid credit cards
- Test webhook failures
- Check error logging

## 6. Production Checklist

### Security
- [ ] All API keys are in environment variables
- [ ] Supabase RLS policies are enabled
- [ ] Stripe webhook signatures are verified
- [ ] No secrets in client-side code

### Performance  
- [ ] Images optimized
- [ ] Bundle size under 1MB
- [ ] Loading states implemented
- [ ] Error boundaries in place

### Analytics (Optional)
- [ ] Google Analytics setup
- [ ] Stripe analytics enabled
- [ ] Conversion tracking implemented

### Legal (Important)
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] Cookie consent if needed
- [ ] Refund policy clear

## 7. Going Live

### Domain Setup
1. Configure custom domain in Vercel
2. Update `NEXT_PUBLIC_APP_URL` 
3. Update Stripe webhook URL
4. Test all flows on production domain

### Launch Tasks
- [ ] Test complete user journey
- [ ] Monitor error logs for 24h
- [ ] Set up monitoring alerts
- [ ] Prepare customer support process

## Troubleshooting

### Common Issues
- **Stripe webhook failing**: Check webhook URL and secret
- **Supabase connection error**: Verify API keys and database setup
- **Build failing**: Check TypeScript errors and missing dependencies
- **Hydration errors**: Ensure client/server rendering consistency

### Debug Commands
```bash
# Test Stripe webhook locally
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Check Supabase connection
npx supabase status

# View logs
vercel logs
```

---

🚀 **Your Brand Profiler should now be live and ready to generate revenue!**

Next steps: Monitor conversions, gather user feedback, and iterate on the product based on real usage data.