import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import { AuthProvider, useAuth } from './components/AuthContext'
import { Home, NewsPage, LoginPage, RegisterPage, UserPanel, AdminPanel } from './components/Pages'

function PrivateRoute({ children }){
  const { user, loading } = useAuth()
  if (loading) return <div className="py-20 text-center text-white/80">Ładowanie...</div>
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }){
  const { user, loading } = useAuth()
  if (loading) return <div className="py-20 text-center text-white/80">Ładowanie...</div>
  return user?.role === 'admin' ? children : <Navigate to="/" replace />
}

function App(){
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout /> }>
          <Route index element={<Home />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="panel" element={<PrivateRoute><UserPanel /></PrivateRoute>} />
          <Route path="admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
