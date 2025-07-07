import { useState } from 'react'
import { getErrorMessage, getItem } from '@/lib/utils'
import { getSupabaseEdgeUrl } from './getSupabaseEdgeUrl'
import { LOCAL_GARMIN_CODE_VERIFIER } from './constants'
import { updateUserSettingsWithStore } from '@/actions/userSettings'

export function useExchangeGarminToken() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const exchange = async ({ state, code }: { state: string, code: string }) => {
    setLoading(true)
    setError(null)

    try {
      const authCode = Array.isArray(code) ? code[0] : code
      const codeVerifier = await getItem(LOCAL_GARMIN_CODE_VERIFIER)
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
      // Update db with token here
      
      try {
        await updateUserSettingsWithStore({
          newUserSettings: {
            garmin_access_token: result?.access_token,
            garmin_refresh_token: result?.refresh_token,
            garmin_sync_enabled: true
          }
        })
      } catch (error) {
        const msg = getErrorMessage(error)
        setError(msg)
        throw error
      }

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