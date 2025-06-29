import { ExerciseSet } from '@/lib/supabase/exercise'
import { create } from 'zustand'

type ExerciseSetsState = {
    exerciseSets: ExerciseSet[] | null
    setExerciseSets: (sets: ExerciseSet[]) => void
    updateExerciseSetInStore: (set: ExerciseSet) => void
    deleteExerciseSetInStore: (id: string) => void
    reset: () => void
}

export const useExerciseSets = create<ExerciseSetsState>((set) => ({
    exerciseSets: null,
    setExerciseSets: (sets: ExerciseSet[]) => set({ exerciseSets: sets }),
    updateExerciseSetInStore: (newSet: ExerciseSet) => {
        set((state) => {
            const existing = state.exerciseSets?.some(s => s.id === newSet.id)
            const updated = existing
                ? state.exerciseSets!.map(s => s.id === newSet.id ? newSet : s)
                : [...(state.exerciseSets ?? []), newSet]
            return { exerciseSets: updated }
        })
    },
    deleteExerciseSetInStore: (id: string) =>
        set((state) => ({
            exerciseSets: state.exerciseSets?.filter((s) => s.id !== id) ?? [],
        })),
    reset: () => set({ exerciseSets: null })
}))