import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

export function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Lineage II</h1>
        <p className="text-white/80 mb-6">Dołącz do świata Aden. Zarejestruj konto, zaloguj się i korzystaj z panelu gracza. Administrator ma osobny panel do zarządzania użytkownikami i aktualnościami.</p>
        <a href="/register" className="inline-block px-5 py-3 rounded bg-blue-600 hover:bg-blue-500 font-semibold">Załóż konto</a>
      </div>
      <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-3">Nowości</h2>
        <NewsList compact />
      </div>
    </div>
  )
}

export function NewsList({ compact=false }) {
  const [items, setItems] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  useEffect(() => {
    fetch(`${baseUrl}/api/news`).then(r=>r.json()).then(setItems).catch(()=>setItems([]))
  }, [])
  if (!items.length) return <p className="text-white/60">Brak wpisów.</p>
  return (
    <div className="space-y-4">
      {items.map(n=> (
        <div key={n.id} className="bg-slate-900/40 border border-white/10 rounded p-4">
          <h3 className="font-semibold">{n.title}</h3>
          {!compact && <p className="text-white/80 mt-1 whitespace-pre-wrap">{n.content}</p>}
          <div className="text-xs text-white/50 mt-2">Autor: {n.author}</div>
        </div>
      ))}
    </div>
  )
}

export function NewsPage(){
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Aktualności</h1>
      <NewsList />
    </div>
  )
}

export function LoginPage(){
  const { login } = useAuth()
  const [username_or_email, setUser] = useState('')
  const [password, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e)=>{
    e.preventDefault(); setError(''); setLoading(true)
    try { await login(username_or_email, password) ; window.location.href='/panel' } catch (e){ setError(e.message)} finally { setLoading(false)}
  }
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Logowanie</h1>
      {error && <div className="bg-red-600/20 border border-red-500/40 text-red-200 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full bg-slate-900/40 border border-white/10 rounded px-3 py-2" placeholder="Login lub email" value={username_or_email} onChange={e=>setUser(e.target.value)} />
        <input type="password" className="w-full bg-slate-900/40 border border-white/10 rounded px-3 py-2" placeholder="Hasło" value={password} onChange={e=>setPass(e.target.value)} />
        <button disabled={loading} className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50">Zaloguj</button>
      </form>
    </div>
  )
}

export function RegisterPage(){
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e)=>{
    e.preventDefault(); setError(''); setLoading(true)
    try { await register(username, email, password) ; window.location.href='/panel' } catch (e){ setError(e.message)} finally { setLoading(false)}
  }
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Rejestracja</h1>
      {error && <div className="bg-red-600/20 border border-red-500/40 text-red-200 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full bg-slate-900/40 border border-white/10 rounded px-3 py-2" placeholder="Login" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="w-full bg-slate-900/40 border border-white/10 rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full bg-slate-900/40 border border-white/10 rounded px-3 py-2" placeholder="Hasło" value={password} onChange={e=>setPass(e.target.value)} />
        <button disabled={loading} className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50">Zarejestruj</button>
      </form>
    </div>
  )
}

export function UserPanel(){
  const { user } = useAuth()
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Witaj, {user?.username}</h1>
      <p className="text-white/80">To jest Twój panel użytkownika. W kolejnych krokach możemy dodać zarządzanie kontem gry, zmiany hasła, statusy serwera itd.</p>
    </div>
  )
}

export function AdminPanel(){
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [msg, setMsg] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(()=>{
    const load = async ()=>{
      try {
        const res = await fetch(`${baseUrl}/api/admin/users`, { headers: { Authorization: `Bearer ${token}`}})
        if (res.ok) setUsers(await res.json())
      } catch {}
    }
    load()
  },[token])

  const createNews = async (e)=>{
    e.preventDefault(); setMsg('')
    try {
      const res = await fetch(`${baseUrl}/api/news`,{ method:'POST', headers:{'Content-Type':'application/json', Authorization: `Bearer ${token}`}, body: JSON.stringify({title, content}) })
      if (res.ok) { setMsg('Dodano wpis.'); setTitle(''); setContent('') }
      else setMsg('Błąd tworzenia wpisu')
    } catch { setMsg('Błąd sieci') }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-3">Użytkownicy</h2>
        <div className="space-y-2 max-h-[400px] overflow-auto pr-2">
          {users.map(u=> (
            <div key={u.id} className="bg-slate-900/40 border border-white/10 rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{u.username}</div>
                <div className="text-xs text-white/60">{u.email}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${u.role==='admin'?'bg-yellow-600/30 border border-yellow-500/30':'bg-blue-600/30 border border-blue-500/30'}`}>{u.role}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-3">Dodaj aktualność</h2>
        {msg && <div className="mb-3 text-sm text-white/80">{msg}</div>}
        <form onSubmit={createNews} className="space-y-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-slate-900/40 border border-white/10 rounded px-3 py-2" placeholder="Tytuł" />
          <textarea value={content} onChange={e=>setContent(e.target.value)} className="w-full bg-slate-900/40 border border-white/10 rounded px-3 py-2 h-40" placeholder="Treść" />
          <button className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500">Publikuj</button>
        </form>
      </div>
    </div>
  )
}
