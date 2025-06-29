import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Screen from '@/shared/Screen'
import { TextInput, View, Button, Text } from 'react-native'
import { useAuth } from '@/stores/auth'
import { useRouter } from 'expo-router'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const user = useAuth((s) => s.user)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user])

  const handleLogin = async () => {
    setError('')
    setIsLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    const { user, session } = data
    if (user && session) {
      useAuth.getState().setAuth(user, session)
      console.log('user and session')
    }
  }

  return (
    <Screen style={{ gap: 20, alignItems: 'center' }}>
      <Text style={{ fontSize: 36, color: '#B4B4B4' }}>Tracker</Text>
      <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 8, width: '100%', maxWidth: 320 }}>
        <Text>Email</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
        />

        <Text>Password</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
        />

        {error && <Text style={{ color: 'red' }}>{error}</Text>}

        <Button title={isLoading ? 'Logging In' : "Log In"} onPress={handleLogin} disabled={isLoading} />
        <Button title="Sign Up" color="gray" />
      </View>
    </Screen>
  )
}