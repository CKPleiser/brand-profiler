import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Brand Style Guide Generator - AI-Powered Brand Guidelines',
  description: 'Generate professional brand style guides with AI. Get tone of voice, brand personality, and visual direction for your business.',
  keywords: ['brand style guide', 'AI branding', 'brand guidelines', 'tone of voice', 'brand personality'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  )
}