import { useAuth } from '@/stores/auth'
import { Redirect, Stack, usePathname } from 'expo-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Layout() {

  const { user, setAuth } = useAuth()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setAuth(data.session.user, data.session)
      }
      setReady(true)
    }

    load()
  }, [])

  if (!ready) return null

  const isLoginPage = pathname === '/login'

  if (!user && !isLoginPage) {
    return <Redirect href='/login' />
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}