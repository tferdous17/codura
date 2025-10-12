"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestHoverPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Hover Effects Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Card 1 - hover:scale-[1.01] */}
          <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden group hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500 shadow-xl hover:scale-[1.01]">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
            <CardHeader>
              <CardTitle>Test Card 1 - hover:scale-[1.01]</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This card should scale up slightly on hover. You should see a red border and scale effect.</p>
            </CardContent>
          </Card>

          {/* Test Card 2 - hover:scale-[1.02] */}
          <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden group hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500 shadow-xl hover:scale-[1.02]">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
            <CardHeader>
              <CardTitle>Test Card 2 - hover:scale-[1.02]</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This card should scale up more on hover. You should see a blue border and scale effect.</p>
            </CardContent>
          </Card>

          {/* Test Button - hover:scale-105 */}
          <div className="flex justify-center">
            <Button className="hover:scale-105 transition-transform">
              Test Button - hover:scale-105
            </Button>
          </div>

          {/* Test Icon - hover:scale-110 */}
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center hover:scale-110 transition-transform">
              <span className="text-brand">★</span>
            </div>
          </div>

          {/* Test Group Hover */}
          <Card className="group">
            <CardHeader>
              <CardTitle>Test Group Hover</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-brand">★</span>
              </div>
              <p className="group-hover:text-brand transition-colors">This text should change color on group hover</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Debug Information:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Card 1 should show red border and scale on hover</li>
            <li>Card 2 should show blue border and scale on hover</li>
            <li>Button should show green border and scale on hover</li>
            <li>Icon should show yellow border and scale on hover</li>
            <li>Group hover icon should show purple border and scale</li>
            <li>Group hover text should show red background and change color</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
