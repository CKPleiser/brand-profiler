'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { EmailInput } from '@/components/EmailInput'
import { Sparkles, Globe, FileText, ArrowRight } from 'lucide-react'
import { BrandFormData } from '@/types'

export default function HomePage() {
  const [inputValue, setInputValue] = useState('')
  const [inputType, setInputType] = useState<'url' | 'description'>('url')
  const [isLoading, setIsLoading] = useState(false)
  const [brandData, setBrandData] = useState<Partial<BrandFormData>>({})
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('brandFormData')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setBrandData(parsed)
        if (parsed.domain || parsed.description) {
          setShowForm(true)
          setInputValue(parsed.domain || parsed.description || '')
        }
      } catch (e) {
        console.error('Failed to parse saved data:', e)
      }
    }
  }, [])

  useEffect(() => {
    // Save to localStorage whenever brandData changes
    if (Object.keys(brandData).length > 0) {
      localStorage.setItem('brandFormData', JSON.stringify(brandData))
    }
  }, [brandData])

  const detectInputType = (value: string): 'url' | 'description' => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
    return urlPattern.test(value) ? 'url' : 'description'
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    const type = detectInputType(value)
    setInputType(type)
  }

  const extractBrandName = (input: string, type: 'url' | 'description'): string => {
    if (type === 'url') {
      try {
        const domain = input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
        return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
      } catch {
        return ''
      }
    } else {
      // Try to extract brand name from description
      const words = input.split(' ')
      if (words.length > 0) {
        return words[0].charAt(0).toUpperCase() + words[0].slice(1)
      }
      return ''
    }
  }

  const handleDetectBrand = async () => {
    if (!inputValue.trim()) return

    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const name = extractBrandName(inputValue, inputType)
      const newBrandData: Partial<BrandFormData> = {
        name,
        domain: inputType === 'url' ? inputValue : '',
        description: inputType === 'description' ? inputValue : `${name} provides innovative solutions for modern businesses.`,
        audience: 'Business professionals and decision makers',
        voice_traits: ['Professional', 'Trustworthy', 'Innovative'],
        language: 'English',
        user_email: email
      }
      
      setBrandData(newBrandData)
      setShowForm(true)
    } catch (error) {
      console.error('Detection failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = async () => {
    if (!brandData.name || !brandData.description) return
    
    setIsLoading(true)
    
    try {
      // Save final form data
      const finalData = { ...brandData, user_email: email }
      setBrandData(finalData)
      
      // TODO: Call n8n webhook to generate guide
      console.log('Generating guide for:', finalData)
      
      // Redirect to free basic guide
      window.location.href = '/guide/basic'
    } catch (error) {
      console.error('Guide generation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold">Brand Style Guide Generator</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-2">
          AI-powered brand guidelines in minutes
        </p>
        <p className="text-muted-foreground">
          Get professional tone of voice, brand personality, and visual direction
        </p>
      </div>

      {!showForm ? (
        /* Initial Input */
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Enter your website URL or describe your brand
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-input">
                {inputType === 'url' ? 'Website URL' : 'Brand Description'}
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-3">
                  {inputType === 'url' ? (
                    <Globe className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <Input
                  id="brand-input"
                  placeholder={
                    inputType === 'url' 
                      ? 'https://yourcompany.com' 
                      : 'Describe your brand, mission, and target audience...'
                  }
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {inputType === 'url' 
                  ? 'We\'ll analyze your website content'
                  : 'Tell us about your brand in your own words'
                }
              </p>
            </div>

            <EmailInput
              value={email}
              onChange={setEmail}
            />

            <Button 
              onClick={handleDetectBrand}
              disabled={!inputValue.trim() || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                'Analyzing...'
              ) : (
                <>
                  Detect Brand Info
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Brand Form */
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Review & Edit Brand Information</CardTitle>
            <CardDescription>
              We've detected some information about your brand. Please review and edit as needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input
                  id="name"
                  value={brandData.name || ''}
                  onChange={(e) => setBrandData({ ...brandData, name: e.target.value })}
                  placeholder="Your Brand Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Website (optional)</Label>
                <Input
                  id="domain"
                  value={brandData.domain || ''}
                  onChange={(e) => setBrandData({ ...brandData, domain: e.target.value })}
                  placeholder="https://yourdomain.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brand Description</Label>
              <Textarea
                id="description"
                value={brandData.description || ''}
                onChange={(e) => setBrandData({ ...brandData, description: e.target.value })}
                placeholder="Describe what your brand does, your mission, and what makes you unique..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                value={brandData.audience || ''}
                onChange={(e) => setBrandData({ ...brandData, audience: e.target.value })}
                placeholder="Who is your primary audience?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="traits">Voice Traits (comma-separated)</Label>
              <Input
                id="traits"
                value={brandData.voice_traits?.join(', ') || ''}
                onChange={(e) => setBrandData({ 
                  ...brandData, 
                  voice_traits: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                })}
                placeholder="Professional, Friendly, Innovative, Trustworthy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_email">Email for Delivery</Label>
              <Input
                id="user_email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleFormSubmit}
                disabled={!brandData.name || !brandData.description || isLoading}
                className="flex-1"
                size="lg"
              >
                {isLoading ? (
                  'Generating Guide...'
                ) : (
                  <>
                    Generate Style Guide
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-primary mr-2" />
              <h3 className="font-semibold">Comprehensive Guidelines</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Get detailed tone of voice, brand personality, and visual direction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <Sparkles className="w-5 h-5 text-primary mr-2" />
              <h3 className="font-semibold">AI-Powered Prompts</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Ready-to-use prompts for ChatGPT and other AI tools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <ArrowRight className="w-5 h-5 text-primary mr-2" />
              <h3 className="font-semibold">Multiple Formats</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Download as PDF, Markdown, or plain text
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}