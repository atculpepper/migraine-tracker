import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Download, Flame, Activity, Brain, Pill } from 'lucide-react'
import { useEntries } from '../hooks/useEntries'
import { computeStats, exportToCSV } from '../utils/analytics'

function StatCard({ icon: Icon, label, value, sub, color = 'text-pulse' }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${color.replace('text-', 'bg-')}/20`}>
        <Icon size={20} className={color} />
      </div>
      <div>
        <p className="text-white/40 text-xs font-body uppercase tracking-widest">{label}</p>
        <p className="font-display font-bold text-2xl leading-tight">{value}</p>
        {sub && <p className="text-white/30 text-xs font-body">{sub}</p>}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-ink-700 border border-white/10 rounded-xl px-3 py-2 text-xs font-body">
      <p className="font-display font-semibold mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { entries, loading } = useEntries()
  const stats = computeStats(entries)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pulse border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center page-enter">
        <Brain size={48} className="text-white/20 mb-4" />
        <h2 className="font-display text-xl font-bold mb-2">No data yet</h2>
        <p className="text-white/30 font-body text-sm">Start logging daily to see your insights here.</p>
      </div>
    )
  }

  return (
    <div className="px-5 py-8 max-w-lg mx-auto page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">Insights</h1>
        <button
          onClick={() => exportToCSV(entries)}
          className="flex items-center gap-2 bg-ink-700 hover:bg-ink-600 border border-white/10 
                     text-white/70 font-display font-semibold text-sm px-4 py-2 rounded-2xl 
                     transition-all active:scale-95 touch-manipulation"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Flame}
          label="Streak"
          value={`${stats.streak}d`}
          sub="headache-free"
          color="text-calm"
        />
        <StatCard
          icon={Brain}
          label="Migraines"
          value={stats.migraineCount}
          sub={`${stats.migraineRate}% of logged days`}
          color="text-pulse"
        />
        <StatCard
          icon={Activity}
          label="Headaches"
          value={stats.headacheCount}
          sub="total logged"
          color="text-amber-400"
        />
        <StatCard
          icon={Pill}
          label="Triptans"
          value={stats.triptan}
          sub={`${stats.naproxen} naproxen`}
          color="text-purple-400"
        />
      </div>

      {/* Monthly bar chart */}
      {stats.monthlyData.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-display font-bold text-base mb-4">Monthly Overview</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stats.monthlyData} barSize={12} barGap={2}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="migraines" name="Migraines" fill="#e94560" radius={[4,4,0,0]} />
              <Bar dataKey="headaches" name="Headaches" fill="#f59e0b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      
      {/* 30-day strip */}
      <div className="card mb-6">
        <h2 className="font-display font-bold text-base mb-4">Last 30 Days</h2>
        <div className="flex gap-[3px] items-end h-8">
          {stats.last30.map((day, i) => {
            const color = day.migraine ? '#e94560'
              : day.headache ? '#f59e0b'
              : day.clear ? '#4ecdc4'
              : 'rgba(255,255,255,0.07)'
            return (
              <div
                key={i}
                title={`${day.label}: ${day.migraine ? 'Migraine' : day.headache ? 'Headache' : day.clear ? 'Clear' : 'No data'}`}
                className="flex-1 rounded-sm"
                style={{ backgroundColor: color, height: day.migraine ? 32 : day.headache ? 22 : day.clear ? 14 : 6 }}
              />
            )
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] font-mono text-white/20">30 days ago</span>
          <span className="text-[10px] font-mono text-white/20">Today</span>
        </div>
      </div>


      {/* Medication breakdown */}
      <div className="card">
        <h2 className="font-display font-bold text-base mb-4">Medication Use</h2>
        <div className="space-y-3">
          {[
            { label: 'Triptan', value: stats.triptan, color: 'bg-pulse', textColor: 'text-pulse' },
            { label: 'Naproxen', value: stats.naproxen, color: 'bg-amber-400', textColor: 'text-amber-400' },
            { label: 'Nothing', value: stats.nothing, color: 'bg-white/20', textColor: 'text-white/40' },
          ].map(({ label, value, color, textColor }) => {
            const total = stats.triptan + stats.naproxen + stats.nothing
            const pct = total > 0 ? Math.round((value / total) * 100) : 0
            return (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-display font-semibold text-white/70">{label}</span>
                  <span className={`text-sm font-mono ${textColor}`}>{value} <span className="text-white/30">({pct}%)</span></span>
                </div>
                <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
