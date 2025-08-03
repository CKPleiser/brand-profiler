import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, PRICING_CONFIG, PricingTier } from '@/lib/stripe'
import { headers } from 'next/headers'

// Fixed headers() async call for NextJS 15 compatibility

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      tier, 
      brandData, 
      userEmail,
      promoCode 
    }: {
      tier: PricingTier
      brandData: any
      userEmail?: string
      promoCode?: string
    } = body

    // Validate tier
    if (!tier || !PRICING_CONFIG[tier]) {
      return NextResponse.json(
        { error: 'Invalid pricing tier' },
        { status: 400 }
      )
    }

    const config = PRICING_CONFIG[tier]
    
    // Get origin from headers for redirect URLs
    const headersList = await headers()
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // Create Stripe checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: config.name,
              description: config.description,
              images: [], // Add product images if available
            },
            unit_amount: config.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/guide/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/guide/preview`,
      metadata: {
        tier,
        brandName: brandData?.name || 'Unknown Brand',
        userEmail: userEmail || '',
        brandData: JSON.stringify(brandData),
      },
      customer_email: userEmail,
    }

    // Apply promo code if provided
    if (promoCode) {
      // In production, you'd validate the promo code against your database
      // For now, we'll add it to metadata
      sessionParams.metadata!.promoCode = promoCode
      
      // Example: Apply discount for specific promo codes
      if (promoCode === 'DESIGNBUFFS20') {
        sessionParams.discounts = [
          {
            coupon: 'designbuffs20', // Create this coupon in Stripe dashboard
          },
        ]
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    if (!session.url) {
      throw new Error('Failed to create checkout session URL')
    }

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}