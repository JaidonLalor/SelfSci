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
        journal: boolean
    } | null
    theme: 'gray' | null
    updated_at: string // ISO
    created_at: string // ISO
    garmin_sync_enabled: boolean
    garmin_access_token: string | null
    garmin_refresh_token: string | null
    garmin_token_issued_at: string | null // ISO
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
    id: '',
    user_id: '',
    enabled_menu_items: {
        diet: false,
        workout: true,
        mood: true,
        expense: true,
        biotracker: false,
        journal: false
    },
    theme: 'gray',
    updated_at: '',
    created_at: '',
    garmin_sync_enabled: false,
    garmin_access_token: null,
    garmin_refresh_token: null,
    garmin_token_issued_at: null
}

function patchEnabledMenuItems(stored: any): Required<UserSettings['enabled_menu_items']> {
  return {
    ...DEFAULT_USER_SETTINGS.enabled_menu_items,
    ...(stored || {}) // merge existing keys
  }
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
        // initialize user_settings for new user
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

    return {
        ...data,
        enabled_menu_items: patchEnabledMenuItems(data.enabled_menu_items)
    } as UserSettings
}

export async function updateUserSettings({
    enabled_menu_items,
    theme,
    garmin_sync_enabled,
    garmin_access_token,
    garmin_refresh_token,
    garmin_token_issued_at
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
        ...(enabled_menu_items     !== undefined && { enabled_menu_items: enabled_menu_items }),
        ...(theme                  !== undefined && { theme: theme }),
        ...(garmin_sync_enabled    !== undefined && { garmin_sync_enabled: garmin_sync_enabled }),
        ...(garmin_access_token    !== undefined && { garmin_access_token: garmin_access_token }),
        ...(garmin_refresh_token   !== undefined && { garmin_refresh_token: garmin_refresh_token }),
        ...(garmin_token_issued_at !== undefined && { garmin_token_issued_at: garmin_token_issued_at }),
    }

    const { data, error } = await supabase
        .from('user_settings')
        .upsert([payload], { onConflict: 'user_id' })
        .select()
        .single()
    
    if (error || !data) throw new Error(error?.message || 'Unknown error saving user settings')

    return data as UserSettings
}