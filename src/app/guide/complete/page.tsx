'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Download, Copy, CheckCircle, Sparkles, FileText, ArrowLeft } from 'lucide-react'
import { CompleteGuide } from '@/types'

export default function CompleteGuidePage() {
  const [guide, setGuide] = useState<CompleteGuide | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedPrompt, setCopiedPrompt] = useState(false)

  useEffect(() => {
    // Load complete guide from localStorage
    const saved = localStorage.getItem('completeGuide')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setGuide(parsed)
      } catch (e) {
        console.error('Failed to parse guide data:', e)
      }
    }
    setIsLoading(false)
  }, [])

  const copyPrompt = async () => {
    if (!guide) return
    
    try {
      await navigator.clipboard.writeText(guide.ai_prompt)
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2000)
    } catch (err) {
      console.error('Failed to copy prompt:', err)
    }
  }

  const downloadGuide = (format: 'pdf' | 'markdown' | 'text') => {
    if (!guide) return
    
    // Generate content based on format
    let content = ''
    let filename = `brand-guide`
    let mimeType = 'text/plain'
    
    if (format === 'markdown') {
      content = generateMarkdownContent(guide)
      filename += '.md'
      mimeType = 'text/markdown'
    } else if (format === 'text') {
      content = generateTextContent(guide)
      filename += '.txt'
      mimeType = 'text/plain'
    } else {
      // For PDF, we'd use a library like jsPDF
      content = generateTextContent(guide)
      filename += '.txt' // Fallback to text for now
      mimeType = 'text/plain'
    }
    
    // Create download
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold mb-2">Loading Your Guide...</h1>
        </div>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Guide Not Found</h1>
          <p className="text-muted-foreground mb-6">Please generate your brand guide first.</p>
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
              Home
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Brand Style Guide</h1>
            <p className="text-muted-foreground">Your complete brand guidelines</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Complete
          </Badge>
        </div>
      </div>

      {/* Download Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Download Your Guide
          </CardTitle>
          <CardDescription>
            Get your brand style guide in multiple formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => downloadGuide('pdf')} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button onClick={() => downloadGuide('markdown')} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Markdown
            </Button>
            <Button onClick={() => downloadGuide('text')} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Text
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Brand Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Tone Summary</h4>
                <p className="text-muted-foreground">{guide.tone_summary}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Target Audience</h4>
                <p className="text-muted-foreground">{guide.primary_audience}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Brand Personality</h4>
                <p className="text-muted-foreground">{guide.brand_personality}</p>
              </div>
            </CardContent>
          </Card>

          {/* Key Traits */}
          <Card>
            <CardHeader>
              <CardTitle>Key Brand Traits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {guide.key_traits.map((trait, index) => (
                  <Badge key={index} variant="outline">{trait}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Direction */}
          <Card>
            <CardHeader>
              <CardTitle>Content Direction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{guide.content_direction}</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Prompt Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Content Prompt
              </CardTitle>
              <CardDescription>
                Use this prompt with ChatGPT, Claude, or any AI tool to generate on-brand content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={guide.ai_prompt}
                readOnly
                rows={20}
                className="text-xs resize-none"
              />
              
              <Button 
                onClick={copyPrompt}
                variant={copiedPrompt ? "default" : "outline"}
                className="w-full"
              >
                {copiedPrompt ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Prompt
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground space-y-2">
                <p><strong>How to use:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Copy the prompt above</li>
                  <li>Paste it into ChatGPT or Claude</li>
                  <li>Add your specific content request</li>
                  <li>Get perfectly on-brand content!</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper functions for generating downloadable content
function generateMarkdownContent(guide: CompleteGuide): string {
  return `# Brand Style Guide

## Tone Summary
${guide.tone_summary}

## Key Traits
${guide.key_traits.map(t => `- ${t}`).join('\n')}

## Brand Personality
${guide.brand_personality}

## Target Audience
${guide.primary_audience}

## Content Direction
${guide.content_direction}

## AI Content Prompt

\`\`\`
${guide.ai_prompt}
\`\`\`
`
}

function generateTextContent(guide: CompleteGuide): string {
  return `BRAND STYLE GUIDE

====================
TONE SUMMARY
====================
${guide.tone_summary}

====================
KEY TRAITS
====================
${guide.key_traits.map(t => `• ${t}`).join('\n')}

====================
BRAND PERSONALITY
====================
${guide.brand_personality}

====================
TARGET AUDIENCE
====================
${guide.primary_audience}

====================
CONTENT DIRECTION
====================
${guide.content_direction}

====================
AI CONTENT PROMPT
====================
${guide.ai_prompt}
`
}