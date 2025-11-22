import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Layout() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-extrabold tracking-tight text-xl">Lineage II</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" className={({isActive})=>`hover:text-blue-300 ${isActive?'text-blue-400':''}`}>Start</NavLink>
            <NavLink to="/news" className={({isActive})=>`hover:text-blue-300 ${isActive?'text-blue-400':''}`}>Aktualności</NavLink>
            {user && <NavLink to="/panel" className={({isActive})=>`hover:text-blue-300 ${isActive?'text-blue-400':''}`}>Panel</NavLink>}
            {user?.role === 'admin' && <NavLink to="/admin" className={({isActive})=>`hover:text-blue-300 ${isActive?'text-blue-400':''}`}>Admin</NavLink>}
            {!user ? (
              <>
                <NavLink to="/login" className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500">Zaloguj</NavLink>
                <NavLink to="/register" className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600">Rejestracja</NavLink>
              </>
            ) : (
              <button onClick={logout} className="px-3 py-1 rounded bg-red-600 hover:bg-red-500">Wyloguj</button>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-sm text-white/60">
        © {new Date().getFullYear()} Lineage II Fan Server
      </footer>
    </div>
  )
}

export default Layout
