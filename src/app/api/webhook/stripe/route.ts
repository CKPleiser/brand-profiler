import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: any
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Payment successful:', session.id)
        
        // Extract metadata
        const { tier, brandData, userEmail } = session.metadata
        
        // TODO: 
        // 1. Save payment record to Supabase
        // 2. Generate complete guide via n8n webhook
        // 3. Send email with download links if email provided
        // 4. Mark guide as unlocked
        
        console.log('Processing completed payment:', {
          sessionId: session.id,
          tier,
          amount: session.amount_total,
          customerEmail: session.customer_email || userEmail,
          brandName: JSON.parse(brandData || '{}').name
        })
        
        // For now, we'll handle this in the success page
        break
      }
      
      case 'checkout.session.expired': {
        const session = event.data.object
        console.log('Checkout session expired:', session.id)
        // TODO: Send follow-up email for abandoned checkout
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}