import { deleteFoodEntry, FoodEntry, getAllFoodEntries, updateFoodEntry } from "@/lib/supabase/food"
import { useFoodEntries } from "@/stores/food_entries"

export async function fetchFoodEntriesWithStore() {
    const { setFoodEntries } = useFoodEntries.getState()  
    const foods = await getAllFoodEntries()
    setFoodEntries(foods)
    return foods
}

export async function updateFoodEntryWithStore({ newFood }: { newFood: Partial<FoodEntry> }): Promise<FoodEntry> {
    const { updateFoodEntriesInStore } = useFoodEntries.getState()
    const updatedFood = await updateFoodEntry(newFood)
    updateFoodEntriesInStore(updatedFood)
    return updatedFood
}

export async function deleteFoodEntryWithStore(id: string) {
    const { deleteFoodEntryInStore } = useFoodEntries.getState()
    await deleteFoodEntry(id)
    deleteFoodEntryInStore(id)
}