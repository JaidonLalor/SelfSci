import { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { getItem } from '@/lib/utils'
import { getSupabaseEdgeUrl } from './getSupabaseEdgeUrl'

export function useExchangeGarminToken() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const exchange = async () => {
    setLoading(true)
    setError(null)

    try {
      const { code, state } = useLocalSearchParams()
      const authCode = Array.isArray(code) ? code[0] : code
      const codeVerifier = await getItem('garmin_code_verifier')
      const edgeUrl = getSupabaseEdgeUrl()

      if (!authCode || !codeVerifier) {
        throw new Error('Missing authorization code or code verifier')
      }

      const res = await fetch(`${edgeUrl}/exchange-garmin-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authCode, codeVerifier, state }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to exchange token: ${res.status} ${errorText}`)
      }

      const result = await res.json()
      setData(result)
      return result

    } catch (err: any) {
      setError(err.message || 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { exchange, loading, error, data }
}