export function getSupabaseEdgeUrl() {
    const environment = process.env.EXPO_PUBLIC_ENV
    if (environment === 'production') return process.env.EXPO_PUBLIC_SUPABASE_EDGE_UR
    if (environment === 'development') return process.env.EXPO_PUBLIC_SUPABASE_EDGE_LOCAL_URL
}