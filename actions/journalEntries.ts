import { deleteJournalEntry, getAllJournalEntries, JournalEntry, updateJournalEntry } from '@/lib/supabase/journal_entries'
import { useJournalEntries } from '@/stores/journal_entries'

export async function fetchJournalEntriesWithStore() {
  const { setJournalEntries } = useJournalEntries.getState()
  const entries = await getAllJournalEntries()
  setJournalEntries(entries)
  return entries
}

export async function updateJournalEntryWithStore({ newEntry }: { newEntry: Partial<JournalEntry> }): Promise<JournalEntry> {
  const { updateJournalEntryInStore } = useJournalEntries.getState()
  const updated = await updateJournalEntry(newEntry)
  updateJournalEntryInStore(updated)
  return updated
}

export async function deleteJournalEntryWithStore(id: string) {
  const { deleteJournalEntryInStore } = useJournalEntries.getState()
  await deleteJournalEntry(id)
  deleteJournalEntryInStore(id)
}