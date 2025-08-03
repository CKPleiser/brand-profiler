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
      <div className="space-y-2">
        <Label htmlFor={id}>Email (optional)</Label>
        <div className="h-10 w-full rounded-md border border-input bg-background"></div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Email (optional)</Label>
      <Input
        id={id}
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        suppressHydrationWarning
      />
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}