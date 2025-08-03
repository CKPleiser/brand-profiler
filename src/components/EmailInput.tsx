'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EmailInputProps {
  value: string
  onChange: (value: string) => void
  id?: string
  placeholder?: string
  description?: string
}

export function EmailInput({ 
  value, 
  onChange, 
  id = "email", 
  placeholder = "your@email.com",
  description = "Get your style guide delivered to your inbox"
}: EmailInputProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-3">
        <Label htmlFor={id} className="text-sm font-semibold text-slate-700 flex items-center">
          <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
          📧 Email (optional)
        </Label>
        <div className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white/50"></div>
        <p className="text-sm text-slate-500 flex items-center">
          <span className="w-1 h-1 bg-cyan-500 rounded-full mr-2"></span>
          {description}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-sm font-semibold text-slate-700 flex items-center">
        <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
        📧 Email (optional)
      </Label>
      <Input
        id={id}
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50"
        suppressHydrationWarning
      />
      <p className="text-sm text-slate-500 flex items-center">
        <span className="w-1 h-1 bg-cyan-500 rounded-full mr-2"></span>
        {description}
      </p>
    </div>
  )
}