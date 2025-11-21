import { useEffect, useState } from 'react'

function Assign({ accountId }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [flows, setFlows] = useState([])
  const [igMediaId, setIgMediaId] = useState('demo_media_1')
  const [flowId, setFlowId] = useState('')
  const [status, setStatus] = useState('')

  const loadFlows = async () => {
    const res = await fetch(`${baseUrl}/flows?accountId=${accountId || ''}`)
    const data = await res.json()
    setFlows(data)
  }

  useEffect(()=>{ if(accountId) loadFlows() }, [accountId])

  const assign = async () => {
    setStatus('Assigning...')
    try {
      const payload = { accountId, igMediaId, flowId }
      const res = await fetch(`${baseUrl}/assign`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      const data = await res.json()
      setStatus(`Assigned ✓ (${data.id})`)
    } catch(e) {
      setStatus('Failed')
    }
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-3">Assign Flow to Post</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <input className="px-3 py-2 rounded-lg bg-slate-900/50 text-blue-100 border border-slate-700" value={igMediaId} onChange={e=>setIgMediaId(e.target.value)} placeholder="IG Media ID" />
        <select className="px-3 py-2 rounded-lg bg-slate-900/50 text-blue-100 border border-slate-700" value={flowId} onChange={e=>setFlowId(e.target.value)}>
          <option value="">Select flow</option>
          {flows.map(f=> <option key={f._id} value={f._id}>{f.name}</option>)}
        </select>
        <button onClick={assign} disabled={!accountId || !flowId} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-60">Assign</button>
      </div>
      {status && <div className="mt-2 text-blue-200/90 text-sm">{status}</div>}
    </div>
  )
}

export default Assign