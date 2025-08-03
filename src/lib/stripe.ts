import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
})

export const PRICING_CONFIG = {
  core: {
    price_id: 'price_1Rrv8QGsneJ9VFY05wfXqHbY', // Replace with actual Stripe price ID
    amount: 2900, // $29.00 in cents
    name: 'Core Guide',
    description: 'Essential brand guidelines with tone of voice and personality traits'
  },
  complete: {
    price_id: 'price_1Rrv8rGsneJ9VFY0C52jUlwc', // Replace with actual Stripe price ID  
    amount: 5900, // $59.00 in cents
    name: 'Complete Guide',
    description: 'Comprehensive brand style guide with AI prompts and all features'
  }
} as const

export type PricingTier = keyof typeof PRICING_CONFIG