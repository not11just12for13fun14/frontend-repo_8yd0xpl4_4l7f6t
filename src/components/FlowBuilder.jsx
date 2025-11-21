import { useEffect, useState } from 'react'

function FlowBuilder({ accountId }) {
  const [flows, setFlows] = useState([])
  const [name, setName] = useState('Lead Magnet Delivery')
  const [keywords, setKeywords] = useState('guide, pdf, dm')
  const [saving, setSaving] = useState(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadFlows = async () => {
    const res = await fetch(`${baseUrl}/flows?accountId=${accountId || ''}`)
    const data = await res.json()
    setFlows(data)
  }

  useEffect(()=>{ if(accountId) loadFlows() }, [accountId])

  const create = async () => {
    setSaving(true)
    try {
      const flow = {
        accountId,
        name,
        description: 'Comment trigger → follow encouragement → deliver asset',
        keywords: keywords.split(',').map(k=>k.trim()).filter(Boolean),
        nodes: [
          { id: 't1', type: 'trigger', data: { source: 'comment' } },
          { id: 'a1', type: 'action', data: { kind: 'ask_follow', text: "Hey! Thanks for commenting. Consider following us for more. Reply 'I followed' to continue." } },
          { id: 'a2', type: 'action', data: { kind: 'deliver', text: 'Deliver promised asset' } }
        ],
        edges: [ { id: 'e1', source: 't1', target: 'a1' }, { id: 'e2', source: 'a1', target: 'a2', condition: "reply=='I followed'" } ],
        variables: { campaign_name: name },
        status: 'active',
        version: 1
      }
      await fetch(`${baseUrl}/flows`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(flow) })
      await loadFlows()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-3">Automation Flows</h3>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input className="px-3 py-2 rounded-lg bg-slate-900/50 text-blue-100 border border-slate-700 flex-1" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="px-3 py-2 rounded-lg bg-slate-900/50 text-blue-100 border border-slate-700 flex-1" value={keywords} onChange={(e)=>setKeywords(e.target.value)} placeholder="comma keywords" />
        <button onClick={create} disabled={!accountId || saving} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-60">{saving? 'Creating...' : 'Create Flow'}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {flows.map(f=> (
          <div key={f._id} className="p-4 rounded-lg bg-slate-900/40 border border-slate-700">
            <div className="text-white font-medium">{f.name}</div>
            <div className="text-xs text-blue-300/70">Keywords: {(f.keywords||[]).join(', ') || '—'}</div>
            <div className="text-xs text-blue-300/70">Status: {f.status}</div>
          </div>
        ))}
        {flows.length===0 && (
          <div className="text-blue-200/80">No flows yet. Create one above.</div>
        )}
      </div>
    </div>
  )
}

export default FlowBuilder