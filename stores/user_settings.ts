import { UserSettings } from "@/lib/supabase/user_settings"
import { create } from "zustand"

type UserSettingsState = {
    userSettings: UserSettings | null
    setUserSettings: (userSettings: UserSettings) => void
}

export const useUserSettings = create<UserSettingsState>((set) => ({
    userSettings: null,
    setUserSettings: (settings) => set({ userSettings: settings })
}))