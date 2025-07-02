import { ExpenseEntry, emptyExpenseEntry } from "@/lib/supabase/expense"
import { create } from "zustand"

export type ExpenseEditorState = {
    editorExpense: ExpenseEntry
    isOpen: boolean
    loading: boolean
    error: string
    setEditorExpense: (update: ExpenseEntry | ((prev: ExpenseEntry) => ExpenseEntry)) => void
    setLoading: (loading: boolean) => void
    setError: (error: string) => void
    setIsOpen: (isOpen: boolean) => void
}

export const useExpenseEditor = create<ExpenseEditorState>((set) => ({
    editorExpense: emptyExpenseEntry,
    isOpen: false,
    loading: false,
    error: '',
    setEditorExpense: (update: ExpenseEntry | ((prev: ExpenseEntry) => ExpenseEntry)) =>
        set((state) => ({
            editorExpense: typeof update === 'function' ? update(state.editorExpense) : update,
        })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setIsOpen: (isOpen) => set({ isOpen })
}))