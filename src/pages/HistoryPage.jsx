import { useState } from 'react'
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEntries } from '../hooks/useEntries'

function DayCell({ date, entry }) {
  const dateStr = format(date, 'yyyy-MM-dd')
  const isToday = dateStr === format(new Date(), 'yyyy-MM-dd')
  const isFuture = date > new Date()

  let bg = 'bg-ink-700/30'
  let dot = null

  if (!isFuture && entry) {
    if (entry.hadMigraine) bg = 'bg-pulse/30'
    else if (entry.hadHeadache) bg = 'bg-amber-400/20'
    else bg = 'bg-calm/20'
  }

  return (
    <div className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-mono
                     ${bg} ${isToday ? 'ring-2 ring-white/30' : ''} ${isFuture ? 'opacity-20' : ''}`}>
      <span className={`font-display font-semibold text-sm ${isToday ? 'text-white' : 'text-white/70'}`}>
        {format(date, 'd')}
      </span>
      {!isFuture && entry && (
        <span className="text-[8px] mt-0.5 opacity-70">
          {entry.hadMigraine ? '⚡' : entry.hadHeadache ? '🤕' : '✓'}
        </span>
      )}
    </div>
  )
}

export default function HistoryPage() {
  const { entries, loading } = useEntries()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPad = getDay(monthStart) // 0=Sun

  const entryMap = {}
  entries.forEach(e => { entryMap[e.date] = e })

  const recentEntries = [...entries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pulse border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-5 py-8 max-w-lg mx-auto page-enter">
      <h1 className="font-display text-3xl font-bold mb-6">History</h1>

      {/* Calendar */}
      <div className="card mb-6">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                  className="w-8 h-8 rounded-xl bg-ink-700 flex items-center justify-center active:scale-90 transition-transform">
            <ChevronLeft size={16} className="text-white/60" />
          </button>
          <h2 className="font-display font-bold text-lg">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                  className="w-8 h-8 rounded-xl bg-ink-700 flex items-center justify-center active:scale-90 transition-transform">
            <ChevronRight size={16} className="text-white/60" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} className="text-center text-[10px] font-display font-semibold text-white/30 uppercase py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
          {days.map(day => (
            <DayCell key={format(day, 'yyyy-MM-dd')} date={day} entry={entryMap[format(day, 'yyyy-MM-dd')]} />
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
          {[
            { color: 'bg-pulse/30', label: 'Migraine' },
            { color: 'bg-amber-400/20', label: 'Headache' },
            { color: 'bg-calm/20', label: 'Clear' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${color}`} />
              <span className="text-[10px] font-body text-white/40">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent list */}
      <h2 className="font-display font-bold text-lg mb-3">Recent Entries</h2>
      <div className="space-y-2">
        {recentEntries.length === 0 && (
          <p className="text-white/30 font-body text-sm text-center py-8">No entries yet. Start logging!</p>
        )}
        {recentEntries.map(entry => (
          <div key={entry.date} className="card flex items-center gap-4 py-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0
              ${entry.hadMigraine ? 'bg-pulse/20' : entry.hadHeadache ? 'bg-amber-400/20' : 'bg-calm/20'}`}>
              <span className="text-lg">
                {entry.hadMigraine ? '⚡' : entry.hadHeadache ? '🤕' : '✓'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm">
                {format(parseISO(entry.date), 'EEE, MMM d yyyy')}
              </p>
              <p className="text-white/40 text-xs font-body mt-0.5">
                {entry.hadMigraine ? 'Migraine'
                  : entry.hadHeadache ? 'Headache'
                  : 'Clear day'
                }
                {entry.medication && entry.medication !== 'none' && ` · ${entry.medication}`}
              </p>
            </div>
            <div className={`px-2 py-1 rounded-lg text-xs font-mono
              ${entry.hadMigraine ? 'text-pulse' : entry.hadHeadache ? 'text-amber-400' : 'text-calm'}`}>
              {entry.date.slice(5)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
