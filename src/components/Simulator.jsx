import { useEffect, useState } from 'react'

function Simulator({ accountId }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [igMediaId, setIgMediaId] = useState('demo_media_1')
  const [igUserId, setIgUserId] = useState('demo_user_1')
  const [username, setUsername] = useState('demo_user')
  const [comment, setComment] = useState('DM guide please')
  const [dmText, setDmText] = useState('I followed')
  const [log, setLog] = useState([])

  const addLog = (entry) => setLog(prev => [{ ts: new Date().toLocaleTimeString(), ...entry }, ...prev])

  const triggerComment = async () => {
    const res = await fetch(`${baseUrl}/webhook/comment`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ accountId, igMediaId, igUserId, username, text: comment }) })
    const data = await res.json()
    addLog({ type: 'comment', data })
  }

  const sendDm = async () => {
    const res = await fetch(`${baseUrl}/webhook/dm`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ accountId, igUserId, text: dmText }) })
    const data = await res.json()
    addLog({ type: 'dm', data })
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-3">Comment → DM Simulator</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-3">
          <input className="w-full px-3 py-2 rounded-lg bg-slate-900/50 text-blue-100 border border-slate-700" value={igMediaId} onChange={e=>setIgMediaId(e.target.value)} placeholder="IG Media ID" />
          <input className="w-full px-3 py-2 rounded-lg bg-slate-900/50 text-blue-100 border border-slate-700" value={igUserId} onChange={e=>setIgUserId(e.target.value)} placeholder="IG User ID" />
          <input className="w-full px-3 py-2 rounded-lg bg-slate-900/50 text-blue-100 border border-slate-700" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
          <input className="w-full px-3 py-2 rounded-lg bg-slate-900/50 text-blue-100 border border-slate-700" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Comment text" />
          <button onClick={triggerComment} disabled={!accountId} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-60 w-full">Trigger Comment</button>
        </div>
        <div className="space-y-3">
          <input className="w-full px-3 py-2 rounded-lg bg-slate-900/50 text-blue-100 border border-slate-700" value={dmText} onChange={e=>setDmText(e.target.value)} placeholder="DM text (e.g., I followed)" />
          <button onClick={sendDm} disabled={!accountId} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold disabled:opacity-60 w-full">Send DM</button>
        </div>
      </div>

      <div className="mt-4 text-sm text-blue-100/90">
        <div className="font-semibold mb-2">Event Log</div>
        <div className="space-y-2 max-h-64 overflow-auto pr-1">
          {log.map((l, i)=> (
            <div key={i} className="bg-slate-900/40 border border-slate-700 rounded p-2">
              <div className="text-xs text-blue-300/70">{l.ts} • {l.type}</div>
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(l.data, null, 2)}</pre>
            </div>
          ))}
          {log.length===0 && <div className="text-blue-300/70">No events yet.</div>}
        </div>
      </div>
    </div>
  )
}

export default Simulator