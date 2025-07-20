import { JournalEntry } from '@/lib/supabase/journal_entries'
import { create } from 'zustand'

type JournalEntriesState = {
  journalEntries: JournalEntry[] | null
  setJournalEntries: (entries: JournalEntry[]) => void
  updateJournalEntryInStore: (entry: JournalEntry) => void
  deleteJournalEntryInStore: (id: string) => void
  reset: () => void
}

export const useJournalEntries = create<JournalEntriesState>((set) => ({
  journalEntries: null,
  setJournalEntries: (entries: JournalEntry[]) => set({ journalEntries: entries }),
  updateJournalEntryInStore: (newEntry: JournalEntry) => {
    set((state) => {
      const existing = state.journalEntries?.some(e => e.id === newEntry.id)
      const updated = existing
        ? state.journalEntries!.map(e => e.id === newEntry.id ? newEntry : e)
        : [...(state.journalEntries ?? []), newEntry]
      return { journalEntries: updated }
    })
  },
  deleteJournalEntryInStore: (id: string) =>
    set((state) => ({
      journalEntries: state.journalEntries?.filter((e) => e.id !== id) ?? [],
    })),
  reset: () => set({ journalEntries: null })
}))