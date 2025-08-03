'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Download, Check, ArrowLeft, CreditCard } from 'lucide-react'
import { BrandFormData, BasicGuide, CompleteGuide } from '@/types'
import { generateBasicGuide, generateCompleteGuide, PRICING_TIERS } from '@/lib/guide-generator'

function GuidePreviewContent() {
  const searchParams = useSearchParams()
  const [brandData, setBrandData] = useState<BrandFormData | null>(null)
  const [preview, setPreview] = useState<BasicGuide | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<'core' | 'complete'>('complete')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const skipGeneration = searchParams.get('skip_generation') === 'true'
    
    // Load brand data from localStorage
    const saved = localStorage.getItem('brandFormData')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setBrandData(parsed)
        
        if (skipGeneration) {
          // Try to load existing basic guide from localStorage
          const savedBasicGuide = localStorage.getItem('basicGuide')
          if (savedBasicGuide) {
            try {
              const basicGuide = JSON.parse(savedBasicGuide)
              setPreview(basicGuide)
              setIsLoading(false)
              return
            } catch (e) {
              console.error('Failed to parse saved basic guide:', e)
            }
          }
        }
        
        // Generate new preview if not skipping or no saved guide found
        generatePreview(parsed)
      } catch (e) {
        console.error('Failed to parse saved data:', e)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  const generatePreview = async (data: BrandFormData) => {
    try {
      const previewData = await generateBasicGuide(data)
      setPreview(previewData)
    } catch (error) {
      console.error('Failed to generate preview:', error)
    } finally {
      setIsLoading(false)
    }
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
          <p className="text-muted-foreground">This will take just a moment</p>
        </div>
      </div>
    )
  }

  if (!brandData || !preview) {
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

  const selectedPricing = PRICING_TIERS.find(tier => tier.type === selectedTier)!

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
            <p className="text-muted-foreground">Preview of your AI-generated style guide</p>
          </div>
        </div>
        <Badge variant="secondary">Preview</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Guide Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tone of Voice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 text-primary mr-2" />
                Tone of Voice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{preview.tone_summary}</p>
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Unlock the complete guide to see:</p>
                <ul className="text-sm space-y-1">
                  <li>• Detailed communication style breakdown</li>
                  <li>• Do's and don'ts for your brand voice</li>
                  <li>• Formality level and emotional tone</li>
                  <li>• Specific language examples</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Brand Personality */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Personality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {preview.key_traits.slice(0, 4).map((trait, index) => (
                  <Badge key={index} variant="outline">{trait}</Badge>
                ))}
                {preview.key_traits.length > 4 && (
                  <Badge variant="secondary">+{preview.key_traits.length - 4} more</Badge>
                )}
              </div>
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Complete guide includes:</p>
                <ul className="text-sm space-y-1">
                  <li>• Full personality trait analysis</li>
                  <li>• Brand archetype identification</li>
                  <li>• Voice descriptors and characteristics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Visual Direction */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Direction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{preview.content_direction}</p>
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Unlock detailed visual guidelines:</p>
                <ul className="text-sm space-y-1">
                  <li>• Color palette recommendations</li>
                  <li>• Typography style guide</li>
                  <li>• Imagery mood and treatment</li>
                  <li>• Design principles and layout rules</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Messaging Pillars */}
          <Card>
            <CardHeader>
              <CardTitle>Messaging Pillars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {['Expertise & Authority', 'Customer Success', 'Innovation & Growth', 'Trust & Reliability'].map((pillar, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    <span className="text-sm">{pillar}</span>
                  </div>
                ))}
              </div>
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Complete guide provides:</p>
                <ul className="text-sm space-y-1">
                  <li>• Content strategy framework</li>
                  <li>• Detailed messaging guidelines</li>
                  <li>• Content themes and topics</li>
                  <li>• Writing style specifications</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-center">Unlock Your Complete Guide</CardTitle>
              <CardDescription className="text-center">
                Choose your plan and get the full brand style guide
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tier Selection */}
              <div className="space-y-3">
                {PRICING_TIERS.filter(tier => tier.type !== 'basic').map((tier) => (
                  <div
                    key={tier.type}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTier === tier.type
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTier(tier.type as 'core' | 'complete')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{tier.name}</h3>
                      <span className="text-2xl font-bold">${tier.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{tier.description}</p>
                    <ul className="space-y-1">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-xs">
                          <Check className="w-3 h-3 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Purchase Button */}
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
                    <CreditCard className="w-4 h-4 mr-2" />
                    Get {selectedPricing.name} - ${selectedPricing.price}
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Secure payment powered by Stripe
                </p>
              </div>

              {/* What You Get */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">What you'll get:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Complete brand style guide</li>
                  <li>• Multiple download formats</li>
                  <li>• AI prompt for content creation</li>
                  <li>• Instant access after payment</li>
                  {brandData.user_email && <li>• Email delivery included</li>}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function GuidePreviewPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
          <p className="text-muted-foreground">Preparing your brand guide</p>
        </div>
      </div>
    }>
      <GuidePreviewContent />
    </Suspense>
  )
}