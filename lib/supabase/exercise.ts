import { supabase } from '@/lib/supabase'

export type ExerciseSet = {
  id: string
  user_id: string
  name: string
  weight_lbs: number
  reps: number
  note?: string
  entry_timestamp: string // ISO 8601 - Date of log
  last_updated: string // ISO 8601
  created_at: string // ISO 8601 - Date created in DB
}

export const emptyExerciseSet: ExerciseSet = {
  id: '',
  user_id: '',
  name: '',
  weight_lbs: 0,
  reps: 0,
  note: undefined,
  entry_timestamp: '',
  last_updated: '',
  created_at: ''
}

export async function updateExerciseSet(payload: Partial<ExerciseSet>): Promise<ExerciseSet> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user?.id) throw new Error('User session not found')
  
  const now = new Date().toISOString()

  const fullPayload = {
    ...payload,
    user_id: session.user.id,
    last_updated: now,
    entry_timestamp: payload.entry_timestamp || now,
    created_at: payload.created_at || undefined,
    note: payload.note || undefined,
  }

  // Remove fields on new entries, so supabase can set defaults
  if (!payload.id) delete fullPayload.id
  // @ts-ignore
  if (!payload.entry_timestamp) delete fullPayload.entry_timestamp
  if (!payload.created_at) delete fullPayload.created_at
  
  const { data, error } = await supabase
    .from('exercise_sets')
    .upsert([fullPayload], { onConflict: ('id') })
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Unknown error saving mood entry')
  }

  return data as ExerciseSet
}

export async function getAllExerciseSets(): Promise<ExerciseSet[]> {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user?.id) throw new Error('User session not found')

    const { data, error } = await supabase
        .from('exercise_sets')
        .select('*')
        .eq('user_id', session.user.id)
        .order('entry_timestamp', { ascending: false })

    if (error || !data) throw new Error(error.message || 'Failed to fetch exercise sets')

    return data as ExerciseSet[]
}

export async function deleteExerciseSet(id: string): Promise<void> {
  const { error } = await supabase.from('exercise_sets').delete().eq('id', id)
  if (error) throw new Error(error.message)
}