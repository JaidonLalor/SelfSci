import { supabase } from '@/lib/supabase'

export type UserSettings = {
    id: string
    user_id: string
    enabled_menu_items: {
        diet: boolean
        workout: boolean
        mood: boolean
        expense: boolean
        biotracker: boolean
    } | null
    theme: 'gray' | null
    updated_at: string // ISO
    created_at: string // ISO
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
    id: '',
    user_id: '',
    enabled_menu_items: {
        diet: false,
        workout: true,
        mood: true,
        expense: true,
        biotracker: false
    },
    theme: 'gray',
    updated_at: '',
    created_at: ''
}

export async function getUserSettings(): Promise<UserSettings> {
    const {
        data: { session },
        error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user?.id) throw new Error('User session not found')

    const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle()

    if (error) throw new Error(error?.message || 'Unknown error getting user settings')

    if (!data) {
        const now = new Date().toISOString()

        const initPayload: Partial<UserSettings> = {
            user_id: session.user.id,
            enabled_menu_items: DEFAULT_USER_SETTINGS.enabled_menu_items,
            theme: DEFAULT_USER_SETTINGS.theme
        }

        const { data: inserted, error: insError } = await supabase
            .from('user_settings')
            .insert(initPayload)
            .select()
            .single()

        if (insError) throw new Error(insError.message ?? 'Unknown error initializing user settings')
        return inserted as UserSettings
    }

    return data as UserSettings
}

export async function updateUserSettings({
    enabled_menu_items,
    theme
}: Partial<UserSettings>): Promise<UserSettings> {
    const {
        data: { session },
        error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user?.id) {
        throw new Error('User session not found')
    }
    
    const now = new Date().toISOString()

    const payload: Partial<UserSettings> = {
        user_id: session.user.id,
        updated_at: now,
        ...(enabled_menu_items !== undefined && { enabled_menu_items: enabled_menu_items }),
        ...(theme              !== undefined && { theme: theme }),
    }

    const { data, error } = await supabase
        .from('user_settings')
        .upsert([payload], { onConflict: 'user_id' })
        .select()
        .single()
    
    if (error || !data) throw new Error(error?.message || 'Unknown error saving user settings')

    return data as UserSettings
}