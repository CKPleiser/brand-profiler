'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Download, Check, ArrowLeft, Crown, Zap } from 'lucide-react'
import { BrandFormData, BasicGuide } from '@/types'
import { generateBasicGuide, PRICING_TIERS } from '@/lib/guide-generator'

export default function BasicGuidePage() {
  const router = useRouter()
  const [brandData, setBrandData] = useState<BrandFormData | null>(null)
  const [basicGuide, setBasicGuide] = useState<BasicGuide | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPricing, setShowPricing] = useState(false)
  const [selectedTier, setSelectedTier] = useState<'core' | 'complete'>('complete')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Load brand data from localStorage
    const saved = localStorage.getItem('brandFormData')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setBrandData(parsed)
        generateGuide(parsed)
      } catch (e) {
        console.error('Failed to parse saved data:', e)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  const generateGuide = async (data: BrandFormData) => {
    try {
      const guide = await generateBasicGuide(data)
      setBasicGuide(guide)
      
      // Save the basic guide to localStorage for reuse
      localStorage.setItem('basicGuide', JSON.stringify(guide))
    } catch (error) {
      console.error('Failed to generate guide:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = () => {
    setShowPricing(true)
  }

  const handlePurchase = async () => {
    if (!brandData) return
    
    setIsGenerating(true)
    
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: selectedTier,
          brandData,
          userEmail: brandData.user_email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      
      if (!url) {
        throw new Error('No checkout URL received')
      }
      
      // Redirect to Stripe checkout
      window.location.href = url
      
    } catch (error) {
      console.error('Purchase failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Payment failed: ${errorMessage}. Please try again.`)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold mb-2">Generating Your Brand Guide...</h1>
          <p className="text-muted-foreground">Analyzing your brand voice and personality</p>
        </div>
      </div>
    )
  }

  if (!brandData || !basicGuide) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Brand Data Found</h1>
          <p className="text-muted-foreground mb-6">Please start over and create your brand guide.</p>
          <Button asChild>
            <a href="/">Start Over</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" asChild className="mr-4">
            <a href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{brandData.name} Brand Guide</h1>
            <p className="text-muted-foreground">Your free basic brand analysis</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Free
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Guide Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tone of Voice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 text-primary mr-2" />
                Tone of Voice Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{basicGuide.tone_summary}</p>
            </CardContent>
          </Card>

          {/* Key Traits */}
          <Card>
            <CardHeader>
              <CardTitle>Key Brand Traits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {basicGuide.key_traits.map((trait, index) => (
                  <Badge key={index} variant="outline">{trait}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Brand Personality */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Personality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{basicGuide.brand_personality}</p>
            </CardContent>
          </Card>

          {/* Voice Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Voice Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-muted-foreground">{basicGuide.basic_voice_notes}</div>
            </CardContent>
          </Card>

          {/* Content Direction */}
          <Card>
            <CardHeader>
              <CardTitle>Content Direction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{basicGuide.content_direction}</p>
            </CardContent>
          </Card>

          {/* Upgrade CTA */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <Crown className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Want More Detailed Guidelines?</h3>
                <p className="text-muted-foreground mb-4">
                  Upgrade to get detailed messaging pillars, visual guidelines, do/don't examples, and AI prompts.
                </p>
                <Button onClick={handleUpgrade}>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Unlock More Features</CardTitle>
              <CardDescription className="text-center">
                Get comprehensive brand guidelines with detailed analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Core Tier */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Core Guide</h3>
                  <span className="text-xl font-bold">$29</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Everything you need for consistent messaging</p>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center">
                    <Check className="w-3 h-3 text-primary mr-2" />
                    Everything in Basic
                  </li>
                  <li className="flex items-center">
                    <Check className="w-3 h-3 text-primary mr-2" />
                    Detailed tone analysis
                  </li>
                  <li className="flex items-center">
                    <Check className="w-3 h-3 text-primary mr-2" />
                    Messaging pillars & themes
                  </li>
                  <li className="flex items-center">
                    <Check className="w-3 h-3 text-primary mr-2" />
                    Do/Don't use examples
                  </li>
                </ul>
              </div>

              {/* Complete Tier */}
              <div className="border-2 border-primary rounded-lg p-4 relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary">Most Popular</Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Complete Guide</h3>
                  <span className="text-xl font-bold">$59</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Full brand system with AI prompts</p>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center">
                    <Check className="w-3 h-3 text-primary mr-2" />
                    Everything in Core
                  </li>
                  <li className="flex items-center">
                    <Check className="w-3 h-3 text-primary mr-2" />
                    Visual guidelines & colors
                  </li>
                  <li className="flex items-center">
                    <Check className="w-3 h-3 text-primary mr-2" />
                    Content strategy framework
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-3 h-3 text-primary mr-2" />
                    AI prompt for ChatGPT/Claude
                  </li>
                </ul>
              </div>

              <Button className="w-full" onClick={handleUpgrade}>
                <Crown className="w-4 h-4 mr-2" />
                Choose Your Plan
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                <p>30-day money-back guarantee</p>
              </div>
            </CardContent>
          </Card>

          {/* Social Proof */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  "This tool helped us nail down our brand voice in minutes instead of weeks!"
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  — Sarah M., Marketing Director
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Choose Your Plan</h2>
                <button onClick={() => setShowPricing(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {PRICING_TIERS.filter(tier => tier.type !== 'basic').map((tier) => (
                  <div
                    key={tier.type}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTier === tier.type
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTier(tier.type as 'core' | 'complete')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{tier.name}</h3>
                      <span className="text-xl font-bold">${tier.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                    <ul className="space-y-1">
                      {tier.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-xs">
                          <Check className="w-3 h-3 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-4">
                <Button 
                  onClick={handlePurchase}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    'Processing...'
                  ) : (
                    <>
                      Get {PRICING_TIERS.find(t => t.type === selectedTier)?.name} - ${PRICING_TIERS.find(t => t.type === selectedTier)?.price}
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Secure payment powered by Stripe • 30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}