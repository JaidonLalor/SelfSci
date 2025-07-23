import { deleteFoodPreset, getAllFoodPresets, updateFoodPreset } from '@/lib/supabase/food_presets'
import { useFoodPresets } from '@/stores/food_presets'
import { FoodPreset } from '@/lib/supabase/food_presets'

export async function fetchFoodPresetsWithStore() {
  const { setFoodPresets } = useFoodPresets.getState()
  const presets = await getAllFoodPresets()
  setFoodPresets(presets)
  return presets
}

export async function updateFoodPresetWithStore({ newPreset }: { newPreset: Partial<FoodPreset> }): Promise<FoodPreset> {
  const { updateFoodPresetsInStore } = useFoodPresets.getState()
  const updated = await updateFoodPreset(newPreset)
  updateFoodPresetsInStore(updated)
  return updated
}

export async function deleteFoodPresetWithStore(id: string) {
  const { deleteFoodPresetInStore } = useFoodPresets.getState()
  await deleteFoodPreset(id)
  deleteFoodPresetInStore(id)
}