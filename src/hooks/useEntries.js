import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useEntries() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEntries = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error

      // Map snake_case DB columns to camelCase for the app
      const mapped = (data || []).map(e => ({
        ...e,
        hadHeadache: e.had_headache,
        hadMigraine: e.had_migraine,
      }))
      setEntries(mapped)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const saveEntry = async (entry) => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .upsert(
          {
            user_id: user.id,
            date: entry.date,
            had_headache: entry.hadHeadache,
            had_migraine: entry.hadMigraine,
            medication: entry.medication,
          },
          { onConflict: 'user_id,date' }
        )
        .select()
        .single()

      if (error) throw error

      const mapped = { ...data, hadHeadache: data.had_headache, hadMigraine: data.had_migraine }

      setEntries(prev => {
        const idx = prev.findIndex(e => e.date === mapped.date)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = mapped
          return next
        }
        return [mapped, ...prev]
      })
      return mapped
    } catch (e) {
      setError(e.message)
      throw e
    }
  }

  return { entries, loading, error, saveEntry, refetch: fetchEntries }
}