import { FoodPreset } from '@/lib/supabase/food_presets'
import { create } from 'zustand'

type FoodPresetsState = {
  foodPresets: FoodPreset[] | null
  setFoodPresets: (presets: FoodPreset[]) => void
  updateFoodPresetsInStore: (preset: FoodPreset) => void
  deleteFoodPresetInStore: (id: string) => void
  reset: () => void
}

export const useFoodPresets = create<FoodPresetsState>((set) => ({
  foodPresets: null,
  setFoodPresets: (presets: FoodPreset[]) => set({ foodPresets: presets }),
  updateFoodPresetsInStore: (newPreset: FoodPreset) => {
    set((state) => {
      const exists = state.foodPresets?.some(p => p.id === newPreset.id)
      const updated = exists
        ? state.foodPresets!.map(p => p.id === newPreset.id ? newPreset : p)
        : [...(state.foodPresets ?? []), newPreset]
      return { foodPresets: updated }
    })
  },
  deleteFoodPresetInStore: (id: string) =>
    set((state) => ({
      foodPresets: state.foodPresets?.filter((p) => p.id !== id) ?? [],
    })),
  reset: () => set({ foodPresets: null }),
}))