import { format, parseISO, differenceInDays, subDays } from 'date-fns'

export function exportToCSV(entries) {
  const headers = ['Date', 'Headache', 'Migraine', 'Medication']
  const rows = entries
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(e => [
      e.date,
      e.hadHeadache ? 'Yes' : 'No',
      e.hadMigraine ? 'Yes' : 'No',
      e.medication || 'None',
    ])

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `migraine-tracker-${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function computeStats(entries) {
  if (!entries.length) return null

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  const total = entries.length
  const migraineCount = entries.filter(e => e.hadMigraine).length
  const headacheCount = entries.filter(e => e.hadHeadache && !e.hadMigraine).count || 
                        entries.filter(e => e.hadHeadache).length
  const triptan = entries.filter(e => e.medication === 'triptan').length
  const naproxen = entries.filter(e => e.medication === 'naproxen').length
  const nothing = entries.filter(e => !e.medication || e.medication === 'none').length

  // Current streak of headache-free days
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

  // Last 30 days for chart
  const last30 = []
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const entry = entries.find(e => e.date === date)
    last30.push({
      date,
      label: format(parseISO(date), 'MMM d'),
      migraine: entry?.hadMigraine ? 1 : 0,
      headache: entry?.hadHeadache && !entry?.hadMigraine ? 1 : 0,
      clear: entry && !entry.hadHeadache && !entry.hadMigraine ? 1 : 0,
    })
  }

  // Monthly breakdown
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
      ...data
    }))

  return {
    total,
    migraineCount,
    headacheCount,
    migraineRate: Math.round((migraineCount / total) * 100),
    triptan,
    naproxen,
    nothing,
    streak,
    last30,
    monthlyData,
  }
}
