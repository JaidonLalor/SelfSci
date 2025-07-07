// @ts-nocheck

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  try {
    const { authCode, codeVerifier, state } = await req.json()

    console.log("🔐 Incoming Garmin OAuth Exchange Request:")
    console.log("authCode:", authCode)
    console.log("codeVerifier:", codeVerifier)
    console.log("state:", state)

    const clientId = Deno.env.get("EXPO_PUBLIC_GARMIN_CLIENT_ID")
    const clientSecret = Deno.env.get("GARMIN_CLIENT_SECRET")

    if (!clientId || !clientSecret) {
      console.error("❌ Missing client ID or secret")
      return new Response("Server misconfiguration", { status: 500 })
    }

    return new Response(
      JSON.stringify({ message: "Payload received and logged" }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    )
  } catch (err) {
    console.error("❌ Failed to parse request:", err)
    return new Response("Invalid request", { status: 400 })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/exchange-garmin-token' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/