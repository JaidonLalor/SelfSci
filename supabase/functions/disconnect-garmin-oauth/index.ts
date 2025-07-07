// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  try {
    const { accessToken, refreshToken, tokenIssuedAt } = await req.json()

    if (!accessToken || !refreshToken || !tokenIssuedAt) {
      console.error('No inputs received')
      return new Response("No inputs received", { status: 500 })
    }

    const issuedAt = new Date(tokenIssuedAt).getTime()
    const now = Date.now()
    const expiresInMs = 86400 * 1000 // 24 hours
    let userAccessToken = accessToken
    const isExpired = now - issuedAt > expiresInMs

    if (isExpired) throw new Error('Token expired! Needs to refresh.')

    const res = await fetch('https://apis.garmin.com/wellness-api/rest/user/registration', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userAccessToken}`
      }
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Failed to disconnect Garmin: ${res.status} - ${errText}`)
    }

  } catch (err) {
    console.error("❌ Failed to parse request:", err)
    return new Response("Invalid request", { status: 400 })
  }
})