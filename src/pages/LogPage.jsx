import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { CheckCircle2, Brain, Pill, Zap, Ban } from 'lucide-react'
import { useEntries } from '../hooks/useEntries'
import { useAuth } from '../hooks/useAuth'

const MEDS = [
  { id: 'triptan', label: 'Triptan', icon: Zap, color: 'text-pulse border-pulse bg-pulse/10' },
  { id: 'naproxen', label: 'Naproxen', icon: Pill, color: 'text-amber-400 border-amber-400 bg-amber-400/10' },
  { id: 'none', label: 'Nothing', icon: Ban, color: 'text-calm border-calm bg-calm/10' },
]

export default function LogPage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const displayDate = format(new Date(), 'EEEE, MMMM d')

  const { user } = useAuth()
  const { entries, loading, saveEntry } = useEntries()

  const existing = entries.find(e => e.date === today)

  const [hadHeadache, setHadHeadache] = useState(null)
  const [hadMigraine, setHadMigraine] = useState(null)
  const [medication, setMedication] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Populate form from existing entry
  useEffect(() => {
    if (existing) {
      setHadHeadache(existing.hadHeadache)
      setHadMigraine(existing.hadMigraine)
      setMedication(existing.medication || null)
      setSaved(true)
    }
  }, [existing])

  const showMedQuestion = hadHeadache === true || hadMigraine === true

  const canSave = hadHeadache !== null && hadMigraine !== null &&
                  (!showMedQuestion || medication !== null)

  const handleSave = async () => {
    if (!canSave || saving) return
    setSaving(true)
    try {
      await saveEntry({
        date: today,
        hadHeadache,
        hadMigraine,
        medication: showMedQuestion ? medication : 'none',
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = () => setSaved(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pulse border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen px-5 py-8 max-w-lg mx-auto page-enter">
      {/* Header */}
      <div className="mb-8">
        <p className="text-white/40 font-body text-sm uppercase tracking-widest mb-1">Today</p>
        <h1 className="font-display text-3xl font-bold">{displayDate}</h1>
        <p className="text-white/30 text-sm font-body mt-1">
          {user?.userDetails && `Logged in as ${user.userDetails}`}
        </p>
      </div>

      {saved ? (
        /* Saved state */
        <div className="card text-center py-10 page-enter">
          <CheckCircle2 size={48} className="text-calm mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Logged!</h2>
          <p className="text-white/40 font-body text-sm mb-6">
            {hadMigraine ? "Migraine day recorded. Rest up 💙"
              : hadHeadache ? "Headache day recorded."
              : "Clear day — great! 🎉"}
          </p>

          {/* Summary pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <span className={`px-3 py-1 rounded-full text-sm font-display font-semibold border ${hadHeadache ? 'pill-yes' : 'pill-no'}`}>
              {hadHeadache ? '🤕 Headache' : '✓ No Headache'}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-display font-semibold border ${hadMigraine ? 'pill-yes' : 'pill-no'}`}>
              {hadMigraine ? '⚡ Migraine' : '✓ No Migraine'}
            </span>
            {medication && medication !== 'none' && (
              <span className="px-3 py-1 rounded-full text-sm font-display font-semibold border border-amber-400/50 text-amber-400 bg-amber-400/10">
                💊 {medication.charAt(0).toUpperCase() + medication.slice(1)}
              </span>
            )}
          </div>

          <button onClick={handleEdit} className="btn-secondary text-sm">
            Edit Today's Entry
          </button>
        </div>
      ) : (
        /* Form */
        <div className="space-y-5">
          {/* Q1: Headache */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-pulse/20 flex items-center justify-center flex-shrink-0">
                <span className="text-pulse font-display font-bold text-sm">1</span>
              </div>
              <h2 className="font-display font-semibold text-lg">Did you have a headache?</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[true, false].map(val => (
                <button
                  key={String(val)}
                  onClick={() => {
                    setHadHeadache(val)
                    if (!val) { setHadMigraine(false); setMedication('none') }
                  }}
                  className={`py-4 rounded-2xl font-display font-semibold text-lg border-2 transition-all active:scale-95 touch-manipulation
                    ${hadHeadache === val
                      ? val ? 'bg-pulse/20 border-pulse text-pulse' : 'bg-calm/20 border-calm text-calm'
                      : 'bg-ink-700 border-white/10 text-white/50 hover:border-white/20'
                    }`}
                >
                  {val ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </div>

          {/* Q2: Migraine — only if headache */}
          {hadHeadache === true && (
            <div className="card page-enter">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-pulse/20 flex items-center justify-center flex-shrink-0">
                  <Brain size={16} className="text-pulse" />
                </div>
                <h2 className="font-display font-semibold text-lg">Was it a migraine?</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map(val => (
                  <button
                    key={String(val)}
                    onClick={() => setHadMigraine(val)}
                    className={`py-4 rounded-2xl font-display font-semibold text-lg border-2 transition-all active:scale-95 touch-manipulation
                      ${hadMigraine === val
                        ? val ? 'bg-pulse/20 border-pulse text-pulse' : 'bg-calm/20 border-calm text-calm'
                        : 'bg-ink-700 border-white/10 text-white/50 hover:border-white/20'
                      }`}
                  >
                    {val ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Q3: Medication */}
          {showMedQuestion && hadMigraine !== null && (
            <div className="card page-enter">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                  <Pill size={16} className="text-amber-400" />
                </div>
                <h2 className="font-display font-semibold text-lg">What did you take?</h2>
              </div>
              <div className="space-y-2">
                {MEDS.map(med => {
                  const Icon = med.icon
                  const isSelected = medication === med.id
                  return (
                    <button
                      key={med.id}
                      onClick={() => setMedication(med.id)}
                      className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-2 transition-all active:scale-[0.98] touch-manipulation
                        ${isSelected ? med.color : 'bg-ink-700 border-white/10 text-white/50 hover:border-white/20'}`}
                    >
                      <Icon size={18} />
                      <span className="font-display font-semibold">{med.label}</span>
                      {isSelected && <CheckCircle2 size={16} className="ml-auto" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="btn-primary w-full py-5 text-lg"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </span>
            ) : existing ? 'Update Entry' : 'Save Today\'s Log'}
          </button>
        </div>
      )}
    </div>
  )
}
