import { supabase } from '@/lib/supabase'

export type JournalEntry = {
  id: string
  user_id: string // uuid
  title?: string
  content_md: string
  tags?: string[] // placeholder for future use
  entry_timestamp: string // ISO 8601
  last_updated: string // ISO 8601
  created_at: string // ISO 8601
}

export const emptyJournalEntry: JournalEntry = {
  id: '',
  user_id: '',
  title: '',
  content_md: '',
  tags: [],
  entry_timestamp: '',
  last_updated: '',
  created_at: '',
}

export async function updateJournalEntry(payload: Partial<JournalEntry>): Promise<JournalEntry> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user?.id) throw new Error('User session not found')

  if (!payload?.content_md) throw new Error('Missing content')

  const now = new Date().toISOString()

  const fullPayload = {
    ...payload,
    user_id: session.user.id,
    last_updated: now,
    entry_timestamp: payload.entry_timestamp || now,
    created_at: payload.created_at || undefined,
    title: payload.title || undefined,
    tags: payload.tags || undefined,
  }

  if (!payload.id) delete fullPayload.id
  // @ts-ignore
  if (!payload.created_at) delete fullPayload.created_at

  const { data, error } = await supabase
    .from('journal_entries')
    .upsert([fullPayload], { onConflict: 'id' })
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Failed to save journal entry')
  }

  return data as JournalEntry
}

export async function getAllJournalEntries(): Promise<JournalEntry[]> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user?.id) throw new Error('User session not found')

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', session.user.id)
    .order('entry_timestamp', { ascending: false })

  if (error || !data) throw new Error(error.message || 'Failed to fetch journal entries')

  return data as JournalEntry[]
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const { error } = await supabase.from('journal_entries').delete().eq('id', id)
  if (error) throw new Error(error.message)
}