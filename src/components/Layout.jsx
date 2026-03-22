import { Outlet, NavLink } from 'react-router-dom'
import { CalendarDays, BarChart2, PlusCircle, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Layout() {
  const { signOut } = useAuth()

  return (
    <div className="flex flex-col min-h-screen min-h-[100dvh] bg-ink-900">
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-ink-800/95 backdrop-blur-xl border-t border-white/5 safe-bottom z-50">
        <div className="flex items-center justify-around px-4 py-2 max-w-lg mx-auto">
          <NavLink
            to="/" end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                isActive ? 'text-pulse' : 'text-white/40 hover:text-white/70'
              }`
            }
          >
            <PlusCircle size={22} />
            <span className="text-[10px] font-display font-semibold tracking-wide uppercase">Log</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                isActive ? 'text-pulse' : 'text-white/40 hover:text-white/70'
              }`
            }
          >
            <CalendarDays size={22} />
            <span className="text-[10px] font-display font-semibold tracking-wide uppercase">History</span>
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                isActive ? 'text-pulse' : 'text-white/40 hover:text-white/70'
              }`
            }
          >
            <BarChart2 size={22} />
            <span className="text-[10px] font-display font-semibold tracking-wide uppercase">Insights</span>
          </NavLink>

          <button
            onClick={signOut}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all text-white/40 hover:text-white/70"
          >
            <LogOut size={22} />
            <span className="text-[10px] font-display font-semibold tracking-wide uppercase">Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
