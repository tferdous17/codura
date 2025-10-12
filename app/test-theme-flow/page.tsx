"use client"

import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function TestThemeFlowPage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [localStorageValue, setLocalStorageValue] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    // Check localStorage directly
    setLocalStorageValue(localStorage.getItem('codura-theme'))
  }, [])

  useEffect(() => {
    // Update localStorage value when theme changes
    setLocalStorageValue(localStorage.getItem('codura-theme'))
  }, [theme])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading theme...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Theme Flow Test</h1>
          <ModeToggle />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Theme State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <h3 className="font-semibold mb-2">useTheme().theme</h3>
                <p className="text-lg font-mono">{theme || "Not set"}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <h3 className="font-semibold mb-2">useTheme().resolvedTheme</h3>
                <p className="text-lg font-mono">{resolvedTheme || "Not set"}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <h3 className="font-semibold mb-2">localStorage['codura-theme']</h3>
                <p className="text-lg font-mono">{localStorageValue || "Not set"}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setTheme("light")} variant="outline">
                Set Light
              </Button>
              <Button onClick={() => setTheme("dark")} variant="outline">
                Set Dark
              </Button>
              <Button onClick={() => setTheme("system")} variant="outline">
                Set System
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold">Scenario: Dark → Light → Dashboard</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Start on landing page with dark mode</li>
                <li>Navigate to login page</li>
                <li>Change theme to light mode on login page</li>
                <li>Navigate to dashboard</li>
                <li>Dashboard should be light mode</li>
                <li>Navigate back to landing page</li>
                <li>Landing page should be light mode</li>
              </ol>
              
              <div className="flex gap-4 mt-6">
                <Link href="/">
                  <Button variant="outline">Go to Landing</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline">Go to Login</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Persistence Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm font-mono">
              <p><strong>Theme Provider Config:</strong></p>
              <p>• storageKey: "codura-theme"</p>
              <p>• defaultTheme: "dark"</p>
              <p>• enableSystem: true</p>
              <p>• themes: ["light", "dark", "system"]</p>
              <p>• enableColorScheme: true</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
