import * as WebBrowser from 'expo-web-browser'
import * as Crypto from 'expo-crypto'
import { Platform } from 'react-native'
import { setItem } from '@/lib/utils'
import { REDIRECT_URI } from './constants'

function base64UrlEncode(input: string): string {
  return input
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

async function generateCodeVerifier(length = 64) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let randomBytes: Uint8Array

  if (Platform.OS === 'web') {
    const randomValues = new Uint8Array(length)
    crypto.getRandomValues(randomValues)
    randomBytes = randomValues
  } else {
    randomBytes = await Crypto.getRandomBytesAsync(length)
  }
  
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(randomBytes[i] % charset.length)
  }
  
  return result
}

export async function generateCodeVerifierAndChallenge() {
  const code_verifier = await generateCodeVerifier()

  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    code_verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  )

  const code_challenge = base64UrlEncode(digest)

  return { code_verifier, code_challenge }
}

async function generateRandomState(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = new Uint8Array(length)
  const result = []

  const randomBytes = await Crypto.getRandomBytesAsync(length)
  for (let i = 0; i < length; i++) {
    result.push(chars.charAt(randomBytes[i] % chars.length))
  }

  return result.join('')
}

export async function startGarminOAuth() {
  const { code_verifier, code_challenge } = await generateCodeVerifierAndChallenge()

  await setItem('garmin_code_verifier', code_verifier)

  const state = await generateRandomState()

  await setItem('garmin_oauth_state', state)

  const CLIENT_ID = process.env.EXPO_PUBLIC_GARMIN_CLIENT_ID

  const authUrl = `https://connect.garmin.com/oauth2Confirm?response_type=code&state=${state}&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code_challenge=${code_challenge}&code_challenge_method=S256`

  return WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI)
}