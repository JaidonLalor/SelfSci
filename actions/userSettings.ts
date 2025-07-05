import { getUserSettings, updateUserSettings, UserSettings } from "@/lib/supabase/user_settings";
import { useUserSettings } from "@/stores/user_settings";

export async function fetchUserSettingsWithStore(): Promise<UserSettings> {
    const { setUserSettings } = useUserSettings.getState()
    const userSettings = await getUserSettings()
    setUserSettings(userSettings)
    return userSettings
}

export async function updateUserSettingsWithStore({ newUserSettings }: { newUserSettings: UserSettings }): Promise<UserSettings> {
    const { setUserSettings } = useUserSettings.getState()
    const updatedUserSettings = await updateUserSettings(newUserSettings)
    setUserSettings(updatedUserSettings)
    return updatedUserSettings
}