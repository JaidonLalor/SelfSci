import { supabase } from "../supabase";

export type FoodEntry = {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  servings: number;
  servings_unit: string;
  source?: "manual" | "ai";
  entry_timestamp: string;        // ISO string for timestamp
  last_updated: string;           // ISO string for timestamp, defaults to now()
  created_at: string;             // ISO string for timestamp, defaults to now()
  note?: string;
};

export const emptyFoodEntry = {
  id: '',
  user_id: '',
  name: '',
  calories: 0,
  protein_g: 0,
  carbs_g: 0,
  fat_g: 0,
  servings: 0,
  servings_unit: '',
  source: 'manual',
  entry_timestamp: '',
  last_updated: '',
  created_at: '',
  note: ''
}

export async function getAllFoodEntries(): Promise<FoodEntry[]> {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user?.id) throw new Error('User session not found')

    const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('entry_timestamp', { ascending: false })

    if (error || !data) throw new Error(error.message || 'Failed to fetch food entries')

    return data as FoodEntry[]
}

export async function deleteFoodEntry(id: string): Promise<void> {
  const { error } = await supabase.from('food_entries').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function updateFoodEntry(payload: Partial<FoodEntry>): Promise<FoodEntry> {
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

  // Remove fields on new entries, so supabase can set defaults
  if (!payload.id) delete fullPayload.id
  // @ts-ignore
  if (!payload.entry_timestamp) delete fullPayload.entry_timestamp
  if (!payload.created_at) delete fullPayload.created_at
  
  const { data, error } = await supabase
    .from('food_entries')
    .upsert([fullPayload], { onConflict: 'id' })
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Unknown error saving food entry')
  }

  return data as FoodEntry
}