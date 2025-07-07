export async function refreshGarminAccessToken(refreshToken: string) {
  const clientId = Deno.env.get("EXPO_PUBLIC_GARMIN_CLIENT_ID")
  const clientSecret = Deno.env.get("GARMIN_CLIENT_SECRET")

  const formData = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  })

  const response = await fetch("https://connectapi.garmin.com/di-oauth2-service/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`Failed to refresh Garmin token: ${response.status} - ${text}`)
  }

  const tokenData = JSON.parse(text)
  return tokenData // includes new access_token, refresh_token, expires_in, etc.
}