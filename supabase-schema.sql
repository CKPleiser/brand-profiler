-- Brand Profiler Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT,
  description TEXT NOT NULL,
  audience TEXT NOT NULL,
  voice_traits TEXT[] NOT NULL DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'English',
  user_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guides table
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  
  -- Free basic guide (always available)
  basic_guide JSONB NOT NULL,
  
  -- Paid guides (locked until purchased)
  core_guide JSONB,
  complete_guide JSONB,
  ai_prompt TEXT,
  
  -- Download links
  format_links JSONB DEFAULT '{}',
  
  -- Which tiers are unlocked
  unlocked_tiers TEXT[] NOT NULL DEFAULT '{"basic"}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  stripe_session TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL CHECK (tier IN ('core', 'complete')),
  amount INTEGER NOT NULL, -- Amount in cents
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  promo_code TEXT,
  customer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email subscriptions for follow-ups
CREATE TABLE email_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  follow_up_sent BOOLEAN DEFAULT FALSE
);

-- Indexes for performance
CREATE INDEX idx_brands_email ON brands(user_email);
CREATE INDEX idx_guides_brand_id ON guides(brand_id);
CREATE INDEX idx_payments_stripe_session ON payments(stripe_session);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_email_subscriptions_email ON email_subscriptions(email);

-- Row Level Security (RLS) policies
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to guides (they contain guide IDs in URLs)
CREATE POLICY "Public can read guides" ON guides
  FOR SELECT USING (true);

-- Allow public insert for new brands and guides
CREATE POLICY "Public can create brands" ON brands
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create guides" ON guides
  FOR INSERT WITH CHECK (true);

-- Allow public insert for payments
CREATE POLICY "Public can create payments" ON payments
  FOR INSERT WITH CHECK (true);

-- Allow service role to update payments (for webhooks)
CREATE POLICY "Service role can update payments" ON payments
  FOR UPDATE USING (auth.role() = 'service_role');

-- Allow service role to update guides (for unlocking tiers)
CREATE POLICY "Service role can update guides" ON guides
  FOR UPDATE USING (auth.role() = 'service_role');

-- Email subscriptions policies
CREATE POLICY "Public can create email subscriptions" ON email_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update email subscriptions" ON email_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Functions

-- Function to unlock guide tiers after payment
CREATE OR REPLACE FUNCTION unlock_guide_tier(guide_uuid UUID, tier_name TEXT)
RETURNS void AS $$
BEGIN
  UPDATE guides 
  SET unlocked_tiers = array_append(unlocked_tiers, tier_name)
  WHERE id = guide_uuid 
  AND NOT (tier_name = ANY(unlocked_tiers));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get guide with payment status
CREATE OR REPLACE FUNCTION get_guide_with_status(guide_uuid UUID)
RETURNS TABLE (
  guide_data JSONB,
  unlocked_tiers TEXT[],
  payment_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_jsonb(g.*) as guide_data,
    g.unlocked_tiers,
    COALESCE(p.status, 'none') as payment_status
  FROM guides g
  LEFT JOIN payments p ON p.guide_id = g.id AND p.status = 'completed'
  WHERE g.id = guide_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data for testing (optional)
-- INSERT INTO brands (name, domain, description, audience, voice_traits) VALUES
-- ('TechCorp', 'https://techcorp.com', 'Leading software solutions for enterprises', 'CTOs and IT Directors', '{"Professional", "Innovative", "Trustworthy"}');

COMMENT ON TABLE brands IS 'Stores brand information from user input';
COMMENT ON TABLE guides IS 'Stores generated brand guides with tiered access';
COMMENT ON TABLE payments IS 'Tracks Stripe payments for guide upgrades';
COMMENT ON TABLE email_subscriptions IS 'Manages email follow-ups and notifications';