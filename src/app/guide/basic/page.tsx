'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Download, Check, ArrowLeft, Crown, Zap } from 'lucide-react'
import { BrandFormData, BasicGuide } from '@/types'
import { generateBasicGuide, PRICING_TIERS } from '@/lib/guide-generator'

export default function BasicGuidePage() {
  const [brandData, setBrandData] = useState<BrandFormData | null>(null)
  const [basicGuide, setBasicGuide] = useState<BasicGuide | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
    } catch (error) {
      console.error('Failed to generate guide:', error)
    } finally {
      setIsLoading(false)
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
                <Button asChild>
                  <a href="/guide/preview">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </a>
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

              <Button className="w-full" asChild>
                <a href="/guide/preview">
                  <Crown className="w-4 h-4 mr-2" />
                  Choose Your Plan
                </a>
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
    </div>
  )
}