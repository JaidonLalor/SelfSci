import { deleteExerciseSet, getAllExerciseSets, updateExerciseSet } from '@/lib/supabase/exercise'
import { useExerciseSets } from '@/stores/exercise_sets'
import { ExerciseSet } from '@/lib/supabase/exercise'

export async function fetchExerciseSetsWithStore() {
    const { setExerciseSets } = useExerciseSets.getState()  
    const sets = await getAllExerciseSets()
    setExerciseSets(sets)
    return sets
}

export async function updateExerciseSetWithStore({ newSet }: { newSet: ExerciseSet }): Promise<ExerciseSet> {
    const { updateExerciseSetInStore } = useExerciseSets.getState()
    const updatedSet = await updateExerciseSet(newSet)
    updateExerciseSetInStore(updatedSet)
    return updatedSet
}

export async function deleteExerciseSetWithStore(id: string) {
  const { deleteExerciseSetInStore } = useExerciseSets.getState()
  await deleteExerciseSet(id)
  deleteExerciseSetInStore(id)
}