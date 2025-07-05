import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Screen from '@/shared/Screen'
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import Button from '@/shared/Button'
import TextInput from '@/shared/TextInput'
import { useAuth } from '@/stores/auth'
import { useRouter } from 'expo-router'
import { fetchUserSettingsWithStore } from '@/actions/userSettings'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const user = useAuth((s) => s.user)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
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
    }
  }

  return (
    <Screen style={{ gap: 20, alignItems: 'center' }}>
      <KeyboardAvoidingView
        style={{ padding: 24, borderRadius: 8, width: '100%', maxWidth: 320, gap: 12 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={24}
      >
        <Text style={{ fontSize: 36, color: '#B4B4B4' }}>Sign In</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder='email'
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          secureTextEntry
          value={password}
          placeholder='password'
          onChangeText={setPassword}
        />

        {error && <Text style={{ color: 'red' }}>{error}</Text>}

        <View style={{
          flexDirection: 'row',
          gap: 12,
          justifyContent: 'flex-end'
        }}>
          <Button text="Sign Up" color="ghost" size='small' onPress={() => router.push('/signup') } />
          <Button text={isLoading ? 'Logging In' : "Log In"} onPress={handleLogin} disabled={isLoading} size='small' color='dark' />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  )
}