import { create } from 'zustand'
import { Session, User } from '@supabase/supabase-js'

type AuthState = {
    user: User | null
    session: Session | null
    setAuth: (user: User, session: Session) => void
    clearAuth: () => void
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    session: null,
    setAuth: (user, session) => set({ user, session }),
    clearAuth: () => set({ user: null, session: null })
}))