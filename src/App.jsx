import { useState } from 'react'
import Hero from './components/Hero'
import FlowBuilder from './components/FlowBuilder'
import Assign from './components/Assign'
import Simulator from './components/Simulator'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [accountId, setAccountId] = useState('')
  const [status, setStatus] = useState('Ready')

  const onConnect = async (name) => {
    setStatus('Connecting...')
    try {
      const res = await fetch(`${baseUrl}/connect`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ account_name: name }) })
      const data = await res.json()
      setAccountId(data.accountId)
      setStatus('Connected')
    } catch (e) {
      setStatus('Failed to connect')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
        <div className="mb-10">
          <Hero onConnect={onConnect} />
          <div className="mt-3 text-center text-blue-200/80 text-sm">Status: {status}{accountId && ` • Account ID: ${accountId}`}</div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FlowBuilder accountId={accountId} />
          <Assign accountId={accountId} />
          <Simulator accountId={accountId} />
        </div>

        <footer className="mt-10 text-center text-blue-300/60 text-sm">
          Built as a compliant prototype. Replace simulated webhooks with real IG Graph webhooks when ready.
        </footer>
      </div>
    </div>
  )
}

export default App