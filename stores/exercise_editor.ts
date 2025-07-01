import { emptyExerciseSet, ExerciseSet } from "@/lib/supabase/exercise"
import { create } from "zustand"

export type ExerciseEditorState = {
    editorSet: ExerciseSet
    isOpen: boolean
    loading: boolean
    error: string
    setEditorSet: (editorSet: ExerciseSet) => void
    setLoading: (loading: boolean) => void
    setError: (error: string) => void
    setIsOpen: (isOpen: boolean) => void
}

export const useExerciseEditor = create<ExerciseEditorState>((set) => ({
    editorSet: emptyExerciseSet,
    isOpen: false,
    loading: false,
    error: '',
    setEditorSet: (editorSet) => set({ editorSet }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setIsOpen: (isOpen) => set({ isOpen })
}))