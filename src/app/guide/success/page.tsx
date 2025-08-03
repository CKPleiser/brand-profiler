'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Download, Sparkles, ArrowRight } from 'lucide-react'

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      // Simulate processing the successful payment
      const timer = setTimeout(() => {
        setIsProcessing(false)
        
        // Generate the complete guide (in production this would be triggered by webhook)
        const brandData = localStorage.getItem('brandFormData')
        if (brandData) {
          // Redirect to complete guide
          window.location.href = '/guide/complete'
        }
      }, 3000)

      return () => clearTimeout(timer)
    } else {
      setError('No payment session found')
      setIsProcessing(false)
    }
  }, [sessionId])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Payment Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/">Return Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary animate-spin" />
            </div>
            <CardTitle>Payment Successful!</CardTitle>
            <CardDescription>
              We're generating your complete brand style guide...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-muted rounded-lg p-6">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                <span className="font-medium">Payment Confirmed</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your payment has been processed successfully. We're now generating your complete brand style guide with all features included.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Payment processed
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
                Generating complete guide...
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-muted-foreground rounded-full mr-3"></div>
                Preparing downloads
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              This usually takes 10-30 seconds
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle>Your Brand Style Guide is Ready!</CardTitle>
          <CardDescription>
            Access your complete brand guidelines and AI prompts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button size="lg" asChild>
              <a href="/guide/complete">
                <Download className="w-4 h-4 mr-2" />
                Access Your Guide
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-2">What's included:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Complete brand style guide</li>
              <li>• AI prompt for ChatGPT/Claude</li>
              <li>• PDF, Markdown & Text downloads</li>
              <li>• Visual guidelines and messaging</li>
              <li>• Lifetime access to your guide</li>
            </ul>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Bookmark this page or check your email for easy access to your guide.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  )
}