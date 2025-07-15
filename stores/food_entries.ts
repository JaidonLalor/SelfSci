import { FoodEntry } from '@/lib/supabase/food'
import { create } from 'zustand'

type FoodEntriesState = {
    foodEntries: FoodEntry[] | null
    setFoodEntries: (food: FoodEntry[]) => void
    updateFoodEntriesInStore: (food: FoodEntry) => void
    deleteFoodEntryInStore: (id: string) => void
    reset: () => void
}

export const useFoodEntries = create<FoodEntriesState>((set) => ({
    foodEntries: null,
    setFoodEntries: (foods: FoodEntry[]) => set({ foodEntries: foods }),
    updateFoodEntriesInStore: (newFood: FoodEntry) => {
        set((state) => {
            const existing = state.foodEntries?.some(f => f.id === newFood.id)
            const updated = existing
                ? state.foodEntries!.map(f => f.id === newFood.id ? newFood : f)
                : [...(state.foodEntries ?? []), newFood]
            return { foodEntries: updated }
        })
    },
    deleteFoodEntryInStore: (id: string) =>
        set((state) => ({
            foodEntries: state.foodEntries?.filter((f) => f.id !== id) ?? [],
        })),
    reset: () => set({ foodEntries: null })
}))