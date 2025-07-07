// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }

  try {
    const { accessToken, refreshToken, tokenIssuedAt } = await req.json()

    if (!accessToken || !refreshToken || !tokenIssuedAt) {
      console.log('accessToken:', accessToken)
      console.log('refreshToken:', refreshToken)
      console.log('tokenIssuedAt:', tokenIssuedAt)
      console.error('No inputs received')
      return new Response("No inputs received", { status: 500, headers: { "Access-Control-Allow-Origin": "*" } })
    }

    const issuedAt = new Date(tokenIssuedAt).getTime()
    const now = Date.now()
    const expiresInMs = 86400 * 1000 // 24 hours
    let userAccessToken = accessToken
    const isExpired = now - issuedAt > expiresInMs

    if (isExpired) {
      console.warn('Token expired')
      return new Response("Access token expired", { status: 401, headers: { "Access-Control-Allow-Origin": "*" } })
    }

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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    })

  } catch (err) {
    console.error("❌ Failed to parse request:", err)
    return new Response("Invalid request", { status: 400, headers: { "Access-Control-Allow-Origin": "*" } })
  }
})