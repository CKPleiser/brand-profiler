import { createClient } from '@supabase/supabase-js'
import { Brand, Guide, Payment } from '@/types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client for public operations
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Server-side client with service role key (for API routes)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Database operations
export async function saveBrand(brandData: Omit<Brand, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('brands')
    .insert([brandData])
    .select()
    .single()

  if (error) throw error
  return data as Brand
}

export async function saveGuide(
  brandId: string, 
  basicGuide: any,
  coreGuide?: any,
  completeGuide?: any,
  aiPrompt?: string
) {
  const guideData = {
    brand_id: brandId,
    basic_guide: basicGuide,
    core_guide: coreGuide,
    complete_guide: completeGuide,
    ai_prompt: aiPrompt,
    unlocked_tiers: ['basic'] // Always start with basic unlocked
  }

  const { data, error } = await supabase
    .from('guides')
    .insert([guideData])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getGuide(guideId: string) {
  const { data, error } = await supabase
    .from('guides')
    .select(`
      *,
      brands (*)
    `)
    .eq('id', guideId)
    .single()

  if (error) throw error
  return data
}

export async function savePayment(paymentData: Omit<Payment, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePaymentStatus(stripeSessionId: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from('payments')
    .update({ status })
    .eq('stripe_session', stripeSessionId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function unlockGuideTier(guideId: string, tier: 'core' | 'complete') {
  const { data, error } = await supabaseAdmin
    .rpc('unlock_guide_tier', {
      guide_uuid: guideId,
      tier_name: tier
    })

  if (error) throw error
  return data
}

export async function getGuideWithPaymentStatus(guideId: string) {
  const { data, error } = await supabase
    .rpc('get_guide_with_status', {
      guide_uuid: guideId
    })
    .single()

  if (error) throw error
  return data
}

export async function subscribeToEmailUpdates(email: string, guideId: string) {
  const { data, error } = await supabase
    .from('email_subscriptions')
    .insert([{
      email,
      guide_id: guideId
    }])
    .select()
    .single()

  if (error) throw error
  return data
}