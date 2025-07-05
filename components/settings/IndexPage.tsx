import { supabase } from '@/lib/supabase'
import { globalStyles } from '@/shared/globalStyles'
import Header from '@/shared/Header'
import Screen from '@/shared/Screen'
import { View, Text, Pressable } from 'react-native'
import { styles } from './IndexPage.styles'
import { useUserSettings } from '@/stores/user_settings'
import { updateUserSettingsWithStore } from '@/actions/userSettings'
import { UserSettings } from '@/lib/supabase/user_settings'
import { useState } from 'react'
import { getErrorMessage } from '@/lib/utils'
import { useAuth } from '@/stores/auth'

export default function SettingsPage() {
    const { userSettings } = useUserSettings()
    const [error, setError] = useState<string>('')
    const { clearAuth } = useAuth()

    type MenuKey = keyof NonNullable<UserSettings['enabled_menu_items']>

    const handleUpdate = async (key: MenuKey) => {
        setError('')
        
        if (!userSettings || !userSettings.enabled_menu_items) {
            setError('No userSettings found')
            return
        }

        const newItems: NonNullable<UserSettings['enabled_menu_items']> = {
            ...userSettings.enabled_menu_items,
            [key]: !userSettings.enabled_menu_items[key],
        }

        try {
            await updateUserSettingsWithStore({
                newUserSettings: {
                ...userSettings,
                enabled_menu_items: newItems,
                },
            })
        } catch (e) {
            setError(String(e))
        }
    }

    const handleSignOut = async () => {
        setError('')
        try {
            await supabase.auth.signOut()
            clearAuth()
        } catch (error) {
            setError(getErrorMessage(error))
        }
    }

    return (
        <Screen>
            <Header title='Settings'/>
            <View style={{ ...globalStyles.content, gap: 18 }}>
                <Text style={{ fontSize: 24, color: '#B4B4B4' }}>Menu Shortcuts</Text>

                {error && <Text style={globalStyles.errorMessage}>{error}</Text>}

                <Pressable style={styles.settingsRow} onPress={() => handleUpdate('workout')}>
                    <Text style={{ fontSize: 24, color: '#666666' }}>Workout</Text>
                    {userSettings?.enabled_menu_items?.workout ? (
                        <Text style={{ fontSize: 24, color: '#B4B4B4' }}>On</Text>
                    ) : (
                        <Text style={{ fontSize: 24, color: '#B4B4B4' }}>Off</Text>
                    )}
                </Pressable>
                <Pressable style={styles.settingsRow} onPress={() => handleUpdate('mood')}>
                    <Text style={{ fontSize: 24, color: '#666666' }}>Mood</Text>
                    {userSettings?.enabled_menu_items?.mood ? (
                        <Text style={{ fontSize: 24, color: '#B4B4B4' }}>On</Text>
                    ) : (
                        <Text style={{ fontSize: 24, color: '#B4B4B4' }}>Off</Text>
                    )}
                </Pressable>
                <Pressable style={styles.settingsRow} onPress={() => handleUpdate('expense')}>
                    <Text style={{ fontSize: 24, color: '#666666' }}>Receipt</Text>
                    {userSettings?.enabled_menu_items?.expense ? (
                        <Text style={{ fontSize: 24, color: '#B4B4B4' }}>On</Text>
                    ) : (
                        <Text style={{ fontSize: 24, color: '#B4B4B4' }}>Off</Text>
                    )}
                </Pressable>
                <Pressable style={styles.settingsRow} onPress={() => handleUpdate('diet')}>
                    <Text style={{ fontSize: 24, color: '#666666' }}>Diet</Text>
                    {userSettings?.enabled_menu_items?.diet ? (
                        <Text style={{ fontSize: 24, color: '#B4B4B4' }}>On</Text>
                    ) : (
                        <Text style={{ fontSize: 24, color: '#B4B4B4' }}>Off</Text>
                    )}
                </Pressable>
                <Pressable style={styles.settingsRow} onPress={() => handleUpdate('biotracker')}>
                    <Text style={{ fontSize: 24, color: '#B4B4B4' }}>Biotracker</Text>
                </Pressable>
                <Pressable style={styles.settingsRow}>
                    <Text style={{ fontSize: 24, color: '#B4B4B4' }}>Journal</Text>
                </Pressable>
                <Pressable style={styles.settingsRow}>
                    <Text style={{ fontSize: 24, color: '#B4B4B4' }}>Task</Text>
                </Pressable>
                <Pressable style={styles.settingsRow}>
                    <Text style={{ fontSize: 24, color: '#B4B4B4' }}>EEG</Text>
                </Pressable>
                <View/>
                <Pressable style={styles.settingsRow} onPress={() => {handleSignOut()}}>
                    <Text style={{ fontSize: 24, color: '#666666' }}>Sign Out</Text>
                </Pressable>
            </View>
        </Screen>
    )
}