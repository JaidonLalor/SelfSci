import { deleteExpenseEntry, ExpenseEntry, getAllExpenseEntries, updateExpenseEntry } from "@/lib/supabase/expense"
import { useExpenseEntries } from "@/stores/expense_entries"

export async function fetchExerciseEntriesWithStore() {
    const { setExpenseEntries } = useExpenseEntries.getState()  
    const expenses = await getAllExpenseEntries()
    setExpenseEntries(expenses)
    return expenses
}

export async function updateExpenseEntryWithStore({ newExpense }: { newExpense: ExpenseEntry }): Promise<ExpenseEntry> {
    const { updateExpenseEntriesInStore } = useExpenseEntries.getState()
    const updatedExpense = await updateExpenseEntry(newExpense)
    updateExpenseEntriesInStore(updatedExpense)
    return updatedExpense
}

export async function deleteExpenseEntryWithStore(id: string) {
    const { deleteExpenseEntryInStore } = useExpenseEntries.getState()
    await deleteExpenseEntry(id)
    deleteExpenseEntryInStore(id)
}