import { useUserSettings } from "@/stores/user_settings"
import { getSupabaseEdgeUrl } from "./getSupabaseEdgeUrl"
import { getErrorMessage } from "../utils"
import { useState } from "react"
import { updateUserSettingsWithStore } from "@/actions/userSettings"
import { supabase } from "../supabase"

export function useDisconnectGarminOAuth() {
    const { userSettings } = useUserSettings()
    const edgeUrl = getSupabaseEdgeUrl()
    const accessToken = userSettings?.garmin_access_token
    const refreshToken = userSettings?.garmin_refresh_token
    const tokenIssuedAt = userSettings?.garmin_token_issued_at

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<any>(null)

    const disconnect = async () => {
        if (loading) return

        setLoading(true)
        setError(null)

        try {
            const session = await supabase.auth.getSession()
            const supabaseAccessToken = session.data?.session?.access_token
            const res = await fetch(`${edgeUrl}/disconnect-garmin-oauth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseAccessToken}`,
                },
                body: JSON.stringify({ accessToken, refreshToken, tokenIssuedAt }),
            })

            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(`Failed to exchange token: ${res.status} ${errorText}`)
            }

            const result = await res.json()
            setResult(result)

            try {
                await updateUserSettingsWithStore({
                    newUserSettings: {
                        garmin_access_token: null,
                        garmin_refresh_token: null,
                        garmin_token_issued_at: null,
                        garmin_sync_enabled: false
                    }
                })
            } catch (error) {
                const msg = getErrorMessage(error)
                setError(msg)
                throw error
            }

        } catch (error) {
            const msg = getErrorMessage(error)
            console.error(msg)
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return { disconnect, result, loading, error }
}