// Follow-up dates are plain YYYY-MM-DD strings (no time zone), so compare them
// as local calendar days.
const DAY = 24 * 60 * 60 * 1000

function toLocalDay(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Returns { tone: 'overdue' | 'today' | 'soon' | 'later' | 'none', label, days }
// days is calendar days from today (negative when overdue), null when unset.
export function describeFollowUp(iso, now = new Date()) {
  if (!iso) return { tone: 'none', label: '—', days: null }
  const day = toLocalDay(iso)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff = Math.round((day - today) / DAY)
  const short = day.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })

  if (diff < 0) return { tone: 'overdue', label: `${-diff}d overdue`, days: diff }
  if (diff === 0) return { tone: 'today', label: 'Today', days: diff }
  if (diff === 1) return { tone: 'soon', label: 'Tomorrow', days: diff }
  return { tone: diff < 7 ? 'soon' : 'later', label: short, days: diff }
}

// Most urgent first: overdue (oldest first), today, upcoming, then no date.
export function byFollowUpUrgency(a, b) {
  const da = describeFollowUp(a.followUpDate).days
  const db = describeFollowUp(b.followUpDate).days
  return (da ?? Infinity) - (db ?? Infinity)
}

export function formatLongDate(iso) {
  if (!iso) return ''
  return toLocalDay(iso).toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}
