import { supabase } from '@/lib/supabase'

export type FoodPreset = {
  id: string
  user_id: string
  name: string
  servings_unit: string
  protein_g: number
  carbs_g: number
  fat_g: number
  calories: number
  note?: string
  created_at: string // ISO 8601
  entry_timestamp: string // ISO 8601
  last_updated: string // ISO 8601
}

export const emptyFoodPreset: FoodPreset = {
  id: '',
  user_id: '',
  name: '',
  servings_unit: '',
  protein_g: 0,
  carbs_g: 0,
  fat_g: 0,
  calories: 0,
  note: undefined,
  created_at: '',
  entry_timestamp: '',
  last_updated: ''
}

export async function getAllFoodPresets(): Promise<FoodPreset[]> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user?.id) throw new Error('User session not found')

  const { data, error } = await supabase
    .from('food_presets')
    .select('*')
    .eq('user_id', session.user.id)
    .order('entry_timestamp', { ascending: false })

  if (error || !data) throw new Error(error.message || 'Failed to fetch food entries')

  return data as FoodPreset[]
}

export async function deleteFoodPreset(id: string): Promise<void> {
  const { error } = await supabase.from('food_presets').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function updateFoodPreset(payload: Partial<FoodPreset>): Promise<FoodPreset> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user?.id) throw new Error('User session not found')

  if (!payload?.name) throw new Error('No name entered')

  const now = new Date().toISOString()

  const fullPayload = {
    ...payload,
    user_id: session.user.id,
    last_updated: now,
    entry_timestamp: payload.entry_timestamp || now,
  }

  if (!payload.id) delete fullPayload.id
  // @ts-ignore
  if (!payload.entry_timestamp) delete fullPayload.entry_timestamp
  if (!payload.created_at) delete fullPayload.created_at

  const { data, error } = await supabase
    .from('food_presets')
    .upsert([fullPayload], { onConflict: 'id' })
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Unknown error saving food entry')
  }

  return data as FoodPreset
}