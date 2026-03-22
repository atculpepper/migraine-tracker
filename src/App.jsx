import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LogPage from './pages/LogPage'
import HistoryPage from './pages/HistoryPage'
import AnalyticsPage from './pages/AnalyticsPage'
import LoginPage from './pages/LoginPage'
import { AuthContext, useAuthProvider } from './hooks/useAuth'

export default function App() {
  const auth = useAuthProvider()

  if (auth.authLoading) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pulse border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={auth}>
      <Routes>
        <Route path="/login" element={!auth.user ? <LoginPage /> : <Navigate to="/" replace />} />
        <Route element={auth.user ? <Layout /> : <Navigate to="/login" replace />}>
          <Route path="/" element={<LogPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
}
