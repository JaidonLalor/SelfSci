// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  try {
    const { authCode, codeVerifier, state } = await req.json()

    if (!authCode || !codeVerifier || !state) {
      console.error('No inputs received')
      return new Response("No inputs received", { status: 500 })
    }

    const clientId = Deno.env.get("EXPO_PUBLIC_GARMIN_CLIENT_ID")
    const clientSecret = Deno.env.get("GARMIN_CLIENT_SECRET")

    if (!clientId || !clientSecret) {
      console.error("❌ Missing client ID or secret")
      return new Response("Server misconfiguration", { status: 500 })
    }

    const formData = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code: authCode,
      code_verifier: codeVerifier,
      redirect_uri: 'https://selfsci.app/garmin' // BLUEPRINT: Should be a constant from /lib/garmin... Deno import issues
    })

    console.log(formData)

    const tokenRes = await fetch("https://connectapi.garmin.com/di-oauth2-service/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    const responseText = await tokenRes.text()

    if (!tokenRes.ok) {
      console.error("❌ Garmin token exchange failed:", responseText)
      return new Response("Garmin token exchange failed", { status: tokenRes.status })
    }

    const tokenData = JSON.parse(responseText)
    console.log("✅ Garmin Token Response:", tokenData)

    return new Response(JSON.stringify(tokenData), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })

  } catch (err) {
    console.error("❌ Failed to parse request:", err)
    return new Response("Invalid request", { status: 400 })
  }
})