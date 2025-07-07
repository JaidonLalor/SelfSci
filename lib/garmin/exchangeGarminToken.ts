import { useState } from 'react'
import { getErrorMessage, getItem } from '@/lib/utils'
import { getSupabaseEdgeUrl } from './getSupabaseEdgeUrl'
import { LOCAL_GARMIN_CODE_VERIFIER } from './constants'
import { updateUserSettingsWithStore } from '@/actions/userSettings'
import { supabase } from '../supabase'

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

      const session = await supabase.auth.getSession()
      const accessToken = session.data?.session?.access_token
      const res = await fetch(`${edgeUrl}/exchange-garmin-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
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
        const now = new Date().toISOString()

        await updateUserSettingsWithStore({
          newUserSettings: {
            garmin_access_token: result?.access_token,
            garmin_refresh_token: result?.refresh_token,
            garmin_sync_enabled: true,
            garmin_token_issued_at: now
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