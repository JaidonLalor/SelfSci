import { FoodEntry, emptyFoodEntry } from "@/lib/supabase/food"
import { create } from "zustand"

export type FoodEditorState = {
    editorFood: FoodEntry
    isOpen: boolean
    loading: boolean
    error: string
    setEditorFood: (update: FoodEntry | ((prev: FoodEntry) => FoodEntry)) => void
    setLoading: (loading: boolean) => void
    setError: (error: string) => void
    setIsOpen: (isOpen: boolean) => void
    reset: () => void
}

export const useFoodEditor = create<FoodEditorState>((set) => ({
    editorFood: emptyFoodEntry,
    isOpen: false,
    loading: false,
    error: '',
    setEditorFood: (update: FoodEntry | ((prev: FoodEntry) => FoodEntry)) =>
        set((state) => ({
            editorFood: typeof update === 'function' ? update(state.editorFood) : update,
        })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setIsOpen: (isOpen) => set({ isOpen }),
    reset: () => set({
      editorFood: emptyFoodEntry,
      isOpen: false,
      loading: false,
      error: '',
    }),
}))