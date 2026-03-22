import { format, parseISO, subDays } from 'date-fns'

export function exportToCSV(entries) {
  const headers = ['Date', 'Headache', 'Migraine', 'Medication']
  const rows = entries
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(e => {
      const meds = Array.isArray(e.medication)
        ? e.medication.filter(m => m !== 'none').join('+') || 'None'
        : e.medication || 'None'
      return [
        e.date,
        e.hadHeadache ? 'Yes' : 'No',
        e.hadMigraine ? 'Yes' : 'No',
        meds,
      ]
    })

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `migraine-tracker-${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const hasMed = (entry, med) => {
  if (Array.isArray(entry.medication)) return entry.medication.includes(med)
  return entry.medication === med
}

export function computeStats(entries) {
  if (!entries.length) return null

  const total = entries.length
  const migraineCount = entries.filter(e => e.hadMigraine).length
  const headacheCount = entries.filter(e => e.hadHeadache).length
  const triptan = entries.filter(e => hasMed(e, 'triptan')).length
  const naproxen = entries.filter(e => hasMed(e, 'naproxen')).length
  const both = entries.filter(e => hasMed(e, 'triptan') && hasMed(e, 'naproxen')).length
  const nothing = entries.filter(e => {
    const meds = Array.isArray(e.medication) ? e.medication : [e.medication]
    return meds.includes('none') || meds.length === 0
  }).length

  let streak = 0
  const today = format(new Date(), 'yyyy-MM-dd')
  let checkDate = today
  while (true) {
    const entry = entries.find(e => e.date === checkDate)
    if (!entry || (!entry.hadHeadache && !entry.hadMigraine)) {
      if (entry) streak++
      else break
      checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd')
    } else {
      break
    }
  }

  const last30 = []
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const entry = entries.find(e => e.date === date)
    last30.push({
      date,
      label: format(parseISO(date), 'MMM d'),
      migraine: entry && entry.hadMigraine ? 1 : 0,
      headache: entry && entry.hadHeadache && !entry.hadMigraine ? 1 : 0,
      clear: entry && !entry.hadHeadache && !entry.hadMigraine ? 1 : 0,
    })
  }

  const byMonth = {}
  entries.forEach(e => {
    const month = e.date.slice(0, 7)
    if (!byMonth[month]) byMonth[month] = { migraines: 0, headaches: 0, total: 0 }
    byMonth[month].total++
    if (e.hadMigraine) byMonth[month].migraines++
    else if (e.hadHeadache) byMonth[month].headaches++
  })

  const monthlyData = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({
      label: format(parseISO(month + '-01'), 'MMM yy'),
      migraines: data.migraines,
      headaches: data.headaches,
      total: data.total,
    }))

  return {
    total,
    migraineCount,
    headacheCount,
    migraineRate: Math.round((migraineCount / total) * 100),
    triptan,
    naproxen,
    both,
    nothing,
    streak,
    last30,
    monthlyData,
  }
}
