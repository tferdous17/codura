'use client'

import { useState } from 'react'

export default function TestAuthPage() {
  const [status, setStatus] = useState<string>('Ready to test')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testSupabaseConnection = async () => {
    setStatus('Testing Supabase connection...')
    addLog('Starting Supabase connection test')

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables')
      }

      addLog(`Supabase URL: ${supabaseUrl}`)
      addLog(`Key present: ${!!supabaseKey}`)

      // Test basic fetch
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })

      addLog(`Response status: ${response.status}`)

      if (response.ok) {
        setStatus('✅ Supabase connection successful!')
        addLog('Connection test passed')
      } else {
        setStatus('❌ Supabase connection failed')
        addLog(`Error: ${response.statusText}`)
      }
    } catch (error) {
      setStatus('❌ Error during test')
      addLog(`Exception: ${error}`)
    }
  }

  const testProfileEndpoint = async () => {
    setStatus('Testing /api/profile endpoint...')
    addLog('Testing profile endpoint')

    try {
      const response = await fetch('/api/profile')
      addLog(`Response status: ${response.status}`)

      const data = await response.json()
      addLog(`Response data: ${JSON.stringify(data, null, 2)}`)

      if (response.ok) {
        setStatus('✅ Profile endpoint successful!')
      } else {
        setStatus(`❌ Profile endpoint failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      setStatus('❌ Error calling profile endpoint')
      addLog(`Exception: ${error}`)
    }
  }

  const clearLogs = () => {
    setLogs([])
    setStatus('Logs cleared')
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>

        <div className="bg-card p-6 rounded-lg border mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <p className="text-lg">{status}</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={testSupabaseConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Supabase Connection
          </button>

          <button
            onClick={testProfileEndpoint}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test Profile API
          </button>

          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Logs</h2>
          <div className="font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">No logs yet. Click a button to test.</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-xs">{log}</div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="font-semibold mb-2">Network Diagnostics</h3>
          <ul className="text-sm space-y-1">
            <li>• Open browser DevTools (F12) and check the Console tab</li>
            <li>• Check the Network tab for failed requests</li>
            <li>• Look for CORS errors or network timeout issues</li>
            <li>• Try disabling any VPN or firewall temporarily</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
