import { supabase } from '@/lib/supabase'

type MoodEntry = {
    id: string //uuid
    user_id: string //uuid
    feelings?: { feeling: string; rating: number }[]
    valence?: number
    note?: string
    attachedEntryType?: string
    attachedEntryId?: string //uuid
    entry_timestamp: string //ISO 8601
    last_updated: string //ISO 8601
    created_at: string //ISO 8601
}

export async function saveMoodEntry({
  feelings,
  valence,
  note,
  attachedEntryType,
  attachedEntryId,
}: {
  feelings?: { feeling: string; rating: number }[]
  valence?: number
  note?: string
  attachedEntryType?: string
  attachedEntryId?: string
}): Promise<MoodEntry> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user?.id) {
    throw new Error('User session not found')
  }
  
  const now = new Date().toISOString()

  const payload: any = {
    user_id: session.user.id,
    valence,
    note,
    attached_entry_type: attachedEntryType,
    attached_entry_id: attachedEntryId,
    entry_timestamp: now,
    last_updated: now
  }

  if (feelings) payload.feelings = feelings

  console.log('Insert payload:', payload)
  
  const { data, error } = await supabase
    .from('mood_entries')
    .insert([payload])
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Unknown error saving mood entry')
  }

  return data as MoodEntry
}