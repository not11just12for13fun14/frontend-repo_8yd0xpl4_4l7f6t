import { useState } from 'react'

function Hero({ onConnect }) {
  const [name, setName] = useState('My IG Account')
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    setLoading(true)
    try {
      await onConnect(name)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">IG Comment → DM Automation</h1>
      <p className="text-blue-200/90 mb-8 max-w-2xl mx-auto">
        Turn post comments into compliant DMs. Encourage following first, then deliver your promised item automatically.
      </p>
      <div className="bg-slate-800/60 p-4 rounded-xl inline-flex items-center gap-3 border border-blue-500/20">
        <input
          className="px-3 py-2 rounded-lg bg-slate-900/50 text-blue-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Account name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
        <button
          onClick={handleConnect}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Instagram'}
        </button>
      </div>
    </div>
  )
}

export default Hero