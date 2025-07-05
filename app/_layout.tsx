import { useAuth } from '@/stores/auth'
import { Redirect, Stack, usePathname } from 'expo-router'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { fetchUserSettingsWithStore } from '@/actions/userSettings'
import { useUserSettings } from '@/stores/user_settings'

export default function Layout() {
  const { user, setAuth } = useAuth()
  const pathname = usePathname()
  const { userSettings } = useUserSettings()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setAuth(data.session.user, data.session)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!user || userSettings) return
    fetchUserSettingsWithStore()
      .catch(err => console.error('settings fetch failed', err))
  }, [user, userSettings])

  const isPublicPage = pathname === '/login' || pathname === '/signup' || pathname === '/'

  if (!user && !isPublicPage) {
    return <Redirect href='/login' />
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}