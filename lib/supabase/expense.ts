import { supabase } from "../supabase"

export type ExpenseEntry = {
  id: string
  user_id: string
  name: string
  amount: number // USD
  context: 'business' | 'personal' | 'untracked'
  tags: string[] // ['restaurant', 'software', 'travel']
  note?: string
  recurring_interval?: 'daily' | 'weekly' | 'monthly' | 'yearly' | undefined
  recurring_ends_on?: string // ISO 8601
  entry_timestamp: string // ISO 8601 - Date of the transaction
  last_updated: string // ISO 8601
  created_at: string // ISO 8601
}

export const emptyExpenseEntry: ExpenseEntry = {
  id: '',
  user_id: '',
  name: '',
  amount: 0,
  context: 'untracked',
  tags: [],
  note: undefined,
  recurring_interval: undefined,
  recurring_ends_on: undefined,
  entry_timestamp: '',
  last_updated: '',
  created_at: ''
}

export async function getAllExpenseEntries(): Promise<ExpenseEntry[]> {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user?.id) throw new Error('User session not found')

    const { data, error } = await supabase
        .from('expense_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('entry_timestamp', { ascending: false })

    if (error || !data) throw new Error(error.message || 'Failed to fetch expense entries')

    return data as ExpenseEntry[]
}

export async function deleteExpenseEntry(id: string): Promise<void> {
  const { error } = await supabase.from('expense_entries').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function updateExpenseEntry(payload: Partial<ExpenseEntry>): Promise<ExpenseEntry> {
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
    .from('expense_entries')
    .upsert([fullPayload], { onConflict: ('id') })
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Unknown error saving expense entry')
  }

  return data as ExpenseEntry
}