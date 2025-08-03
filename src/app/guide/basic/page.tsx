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
    // Show pricing modal for both sidebar and main content buttons
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-wave-pattern opacity-20"></div>
        
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-12 animate-fade-in">
              <div className="flex items-center">
                <Button variant="ghost" asChild className="mr-6 hover:bg-white/50 rounded-xl">
                  <a href="/">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                  </a>
                </Button>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {brandData.name} Brand Guide
                  </h1>
                  <p className="text-xl text-slate-600 font-medium">Your free basic brand analysis</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full shadow-soft">
                <Check className="w-4 h-4 mr-2" />
                Free Guide
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Guide Content */}
              <div className="lg:col-span-2 space-y-8 animate-slide-up">
                {/* Tone of Voice */}
                <Card className="shadow-medium border-0 bg-white/80 backdrop-blur-sm card-hover">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-bold text-slate-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      Tone of Voice Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed text-lg">{basicGuide.tone_summary}</p>
                  </CardContent>
                </Card>

                {/* Key Traits */}
                <Card className="shadow-medium border-0 bg-white/80 backdrop-blur-sm card-hover">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-slate-800">Key Brand Traits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {basicGuide.key_traits.map((trait, index) => (
                        <Badge 
                          key={index} 
                          className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-0 px-4 py-2 text-sm font-medium rounded-full hover:from-blue-200 hover:to-blue-300 transition-all duration-300"
                        >
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Brand Personality */}
                <Card className="shadow-medium border-0 bg-white/80 backdrop-blur-sm card-hover">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-slate-800">Brand Personality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed text-lg">{basicGuide.brand_personality}</p>
                  </CardContent>
                </Card>

                {/* Voice Notes */}
                <Card className="shadow-medium border-0 bg-white/80 backdrop-blur-sm card-hover">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-slate-800">Voice Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-slate-600 leading-relaxed text-lg">{basicGuide.basic_voice_notes}</div>
                  </CardContent>
                </Card>

                {/* Content Direction */}
                <Card className="shadow-medium border-0 bg-white/80 backdrop-blur-sm card-hover">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-slate-800">Content Direction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed text-lg">{basicGuide.content_direction}</p>
                  </CardContent>
                </Card>

                {/* Upgrade CTA */}
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50 shadow-large card-hover">
                  <CardContent className="pt-8 pb-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">Want More Detailed Guidelines?</h3>
                      <p className="text-slate-600 mb-6 text-lg leading-relaxed max-w-md mx-auto">
                        Upgrade to get detailed messaging pillars, visual guidelines, do/don't examples, and AI prompts.
                      </p>
                      <Button 
                        onClick={handleUpgrade}
                        className="bg-gradient-primary hover:shadow-medium hover:scale-105 transition-all duration-300 rounded-xl px-8 py-3 text-lg font-semibold"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Upgrade Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upgrade Sidebar */}
              <div className="space-y-8 animate-fade-in">
                <Card className="shadow-large border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-slate-800">Unlock More Features</CardTitle>
                    <CardDescription className="text-lg text-slate-600">
                      Get comprehensive brand guidelines with detailed analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    {/* Core Tier */}
                    <div className="border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-soft transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-slate-800">Core Guide</h3>
                        <span className="text-2xl font-bold text-blue-600">$29</span>
                      </div>
                      <p className="text-slate-600 mb-4 leading-relaxed">Everything you need for consistent messaging</p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          Everything in Basic
                        </li>
                        <li className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          Detailed tone analysis
                        </li>
                        <li className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          Messaging pillars & themes
                        </li>
                        <li className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          Do/Don't use examples
                        </li>
                      </ul>
                    </div>

                    {/* Complete Tier */}
                    <div className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 relative shadow-medium">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-primary text-white px-4 py-1 rounded-full shadow-soft">
                          Most Popular
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mb-3 pt-2">
                        <h3 className="text-lg font-bold text-slate-800">Complete Guide</h3>
                        <span className="text-2xl font-bold text-blue-600">$59</span>
                      </div>
                      <p className="text-slate-600 mb-4 leading-relaxed">Full brand system with AI prompts</p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          Everything in Core
                        </li>
                        <li className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          Visual guidelines & colors
                        </li>
                        <li className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          Content strategy framework
                        </li>
                        <li className="flex items-center text-sm">
                          <Zap className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                          AI prompt for ChatGPT/Claude
                        </li>
                      </ul>
                    </div>

                    <Button 
                      className="w-full h-12 bg-gradient-primary hover:shadow-medium hover:scale-105 transition-all duration-300 rounded-xl text-lg font-semibold" 
                      onClick={handleUpgrade}
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Choose Your Plan
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-slate-500 flex items-center justify-center">
                        <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                        30-day money-back guarantee
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Proof */}
                <Card className="shadow-medium border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-6 pb-6">
                    <div className="text-center">
                      <div className="flex justify-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-2xl text-yellow-400">★</span>
                        ))}
                      </div>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        "This tool helped us nail down our brand voice in minutes instead of weeks!"
                      </p>
                      <p className="text-sm text-slate-500 mt-3 font-medium">
                        — Sarah M., Marketing Director
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
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
    </>
  )
}