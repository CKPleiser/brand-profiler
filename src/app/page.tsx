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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-wave-pattern opacity-30"></div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Sparkles className="w-12 h-12 text-blue-600 mr-4 animate-bounce-gentle" />
                <div className="absolute inset-0 w-12 h-12 bg-blue-600 rounded-full opacity-20 animate-pulse-glow"></div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Brand Style Guide Generator
              </h1>
            </div>
            <p className="text-2xl text-slate-600 mb-4 font-medium">
              AI-powered brand guidelines in minutes
            </p>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Get professional tone of voice, brand personality, and visual direction 
              crafted by AI and trusted by design professionals
            </p>
            
            {/* Trust badges */}
            <div className="flex items-center justify-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Free Basic Guide
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                AI-Powered Analysis
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Instant Download
              </div>
            </div>
          </div>

          {!showForm ? (
            /* Initial Input */
            <div className="max-w-2xl mx-auto animate-slide-up">
              <Card className="shadow-large border-0 bg-white/80 backdrop-blur-sm card-hover">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-slate-800">Get Started</CardTitle>
                  <CardDescription className="text-lg text-slate-600">
                    Enter your website URL or describe your brand
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  <div className="space-y-3">
                    <Label htmlFor="brand-input" className="text-sm font-semibold text-slate-700">
                      {inputType === 'url' ? '🌐 Website URL' : '📝 Brand Description'}
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-4 z-10">
                        {inputType === 'url' ? (
                          <Globe className="w-5 h-5 text-blue-500" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-500" />
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
                        className="pl-12 h-14 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50"
                      />
                    </div>
                    <p className="text-sm text-slate-500 flex items-center">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                      {inputType === 'url' 
                        ? 'We\'ll analyze your website content automatically'
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
                    className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:shadow-medium hover:scale-105 transition-all duration-300 rounded-xl border-0"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Analyzing Your Brand...
                      </div>
                    ) : (
                      <>
                        Detect Brand Info
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Brand Form */
            <div className="max-w-4xl mx-auto animate-slide-up">
              <Card className="shadow-large border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-800">Review & Edit Brand Information</CardTitle>
                  <CardDescription className="text-lg text-slate-600">
                    We've detected some information about your brand. Please review and edit as needed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-semibold text-slate-700 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Brand Name
                      </Label>
                      <Input
                        id="name"
                        value={brandData.name || ''}
                        onChange={(e) => setBrandData({ ...brandData, name: e.target.value })}
                        placeholder="Your Brand Name"
                        className="h-12 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="domain" className="text-sm font-semibold text-slate-700 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Website (optional)
                      </Label>
                      <Input
                        id="domain"
                        value={brandData.domain || ''}
                        onChange={(e) => setBrandData({ ...brandData, domain: e.target.value })}
                        placeholder="https://yourdomain.com"
                        className="h-12 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm font-semibold text-slate-700 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Brand Description
                    </Label>
                    <Textarea
                      id="description"
                      value={brandData.description || ''}
                      onChange={(e) => setBrandData({ ...brandData, description: e.target.value })}
                      placeholder="Describe what your brand does, your mission, and what makes you unique..."
                      rows={4}
                      className="border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="audience" className="text-sm font-semibold text-slate-700 flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        Target Audience
                      </Label>
                      <Input
                        id="audience"
                        value={brandData.audience || ''}
                        onChange={(e) => setBrandData({ ...brandData, audience: e.target.value })}
                        placeholder="Who is your primary audience?"
                        className="h-12 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="traits" className="text-sm font-semibold text-slate-700 flex items-center">
                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                        Voice Traits
                      </Label>
                      <Input
                        id="traits"
                        value={brandData.voice_traits?.join(', ') || ''}
                        onChange={(e) => setBrandData({ 
                          ...brandData, 
                          voice_traits: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                        })}
                        placeholder="Professional, Friendly, Innovative"
                        className="h-12 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="user_email" className="text-sm font-semibold text-slate-700 flex items-center">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                      Email for Delivery
                    </Label>
                    <Input
                      id="user_email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-12 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowForm(false)}
                      className="flex-1 h-12 border-2 border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 rounded-lg"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleFormSubmit}
                      disabled={!brandData.name || !brandData.description || isLoading}
                      className="flex-1 h-12 bg-gradient-primary hover:shadow-medium hover:scale-105 transition-all duration-300 rounded-lg border-0 text-lg font-semibold"
                      size="lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Generating Guide...
                        </div>
                      ) : (
                        <>
                          Generate Style Guide
                          <Sparkles className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in">
            <Card className="shadow-soft border-0 bg-white/60 backdrop-blur-sm card-hover group">
              <CardContent className="pt-8 pb-8 px-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">Comprehensive Guidelines</h3>
                <p className="text-slate-600 leading-relaxed">
                  Get detailed tone of voice, brand personality, and visual direction crafted by AI experts
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-0 bg-white/60 backdrop-blur-sm card-hover group">
              <CardContent className="pt-8 pb-8 px-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">AI-Powered Prompts</h3>
                <p className="text-slate-600 leading-relaxed">
                  Ready-to-use prompts for ChatGPT, Claude, and other AI tools to maintain consistency
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-0 bg-white/60 backdrop-blur-sm card-hover group">
              <CardContent className="pt-8 pb-8 px-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">Multiple Formats</h3>
                <p className="text-slate-600 leading-relaxed">
                  Download as PDF, Markdown, or plain text for easy sharing with your team
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer CTA */}
          <div className="text-center mt-16 animate-fade-in">
            <p className="text-slate-500 text-sm">
              Trusted by design professionals • Used by <span className="font-semibold text-blue-600">500+</span> brands
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}