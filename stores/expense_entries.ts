import { ExpenseEntry } from '@/lib/supabase/expense'
import { create } from 'zustand'

type ExpenseEntriesState = {
    expenseEntries: ExpenseEntry[] | null
    setExpenseEntries: (sets: ExpenseEntry[]) => void
    updateExpenseEntriesInStore: (set: ExpenseEntry) => void
    deleteExpenseEntryInStore: (id: string) => void
    reset: () => void
}

export const useExpenseEntries = create<ExpenseEntriesState>((set) => ({
    expenseEntries: null,
    setExpenseEntries: (sets: ExpenseEntry[]) => set({ expenseEntries: sets }),
    updateExpenseEntriesInStore: (newExpense: ExpenseEntry) => {
        set((state) => {
            const existing = state.expenseEntries?.some(s => s.id === newExpense.id)
            const updated = existing
                ? state.expenseEntries!.map(s => s.id === newExpense.id ? newExpense : s)
                : [...(state.expenseEntries ?? []), newExpense]
            return { expenseEntries: updated }
        })
    },
    deleteExpenseEntryInStore: (id: string) =>
        set((state) => ({
            expenseEntries: state.expenseEntries?.filter((s) => s.id !== id) ?? [],
        })),
    reset: () => set({ expenseEntries: null })
}))