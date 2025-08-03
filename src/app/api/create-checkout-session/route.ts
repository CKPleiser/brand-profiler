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
    
    // Validate email format if provided
    const isValidEmail = (email: string) => {
      return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    
    const validatedEmail = userEmail && isValidEmail(userEmail) ? userEmail : undefined
    
    // Create Stripe checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: config.price_id,
          quantity: 1,
        },
      ],
      success_url: `${origin}/guide/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/guide/preview`,
      metadata: {
        tier,
        brandName: brandData?.name || 'Unknown Brand',
        userEmail: validatedEmail || '',
        brandData: JSON.stringify(brandData),
      },
    }
    
    // Only set customer_email if we have a valid email
    if (validatedEmail) {
      sessionParams.customer_email = validatedEmail
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
    
    // More detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}