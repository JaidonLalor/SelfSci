import { globalStyles } from "@/shared/globalStyles"
import Header from "@/shared/Header"
import Screen from "@/shared/Screen"
import { Fontisto } from "@expo/vector-icons"
import { Pressable, View, Text, ScrollView } from "react-native"
import { styles } from "./IndexPage.styles"
import { useExpenseEditor } from "@/stores/expense_editor"
import ExpenseEditor from "./ExpenseEditor"
import { useEffect, useState } from "react"
import { useExpenseEntries } from "@/stores/expense_entries"
import { getErrorMessage } from "@/lib/utils"
import { fetchExerciseEntriesWithStore } from "@/actions/expenses"
import { ExpenseEntry } from "@/lib/supabase/expense"
import { format, parseISO } from "date-fns"

export default function IndexPage() {
    const { isOpen, setIsOpen, setEditorExpense } = useExpenseEditor()
    const { expenseEntries } = useExpenseEntries()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const getData = async () => {
            if (!expenseEntries) {
                try {
                    setLoading(true)
                    setError('')
                    await fetchExerciseEntriesWithStore()
                } catch (error) {
                    const msg = getErrorMessage(error)
                    setError(msg)
                } finally {
                    setLoading(false)
                }
            }
        }
        getData()
    }, [expenseEntries])

    type MonthExpenses = {
        monthYear: string  // "July 2025"
        ts: number
        entries: ExpenseEntry[]
    }

    const expenseList: MonthExpenses[] =
        (expenseEntries ?? []).reduce<MonthExpenses[]>((acc, entry) => {
            
            //  derive a display string
            const monthYear = format(parseISO(entry.entry_timestamp), 'MMMM yyyy')

            // numeric key for easy sorting
            const ts = new Date(monthYear).getTime()

            // look for an existing group
            const group = acc.find(g => g.monthYear === monthYear)

            if (group) {
                group.entries.push(entry)
            } else {
                acc.push({ monthYear, ts, entries: [entry] })
            }

            return acc
        }, [])
        // Sort months newest → oldest
        .sort((a, b) => b.ts - a.ts)
        // Sort entries newest → oldest
        .map(group => ({
            ...group,
            entries: group.entries
                .slice()
                .sort(
                    (a, b) => 
                        new Date(b.entry_timestamp).getTime() -
                        new Date(a.entry_timestamp).getTime()
                ),
        }))
    
    type CategorySummary = { amount: string; pct: number }

    type MonthSummary = {
        monthYear:  string
        total:      number
        personal:   CategorySummary
        business:   CategorySummary
        untracked:  CategorySummary
    }

    const getMonthSummary = (): MonthSummary | undefined => {
        if (!expenseList?.length) return undefined
        
        const { monthYear, entries } = expenseList[0]

        const total = entries.reduce((sum, e) => sum+ e.amount, 0)

        const sumBy = (cat: ExpenseEntry['context']) =>
            entries.reduce((sum, e) => (e.context === cat ? sum + e.amount : sum), 0)

        const personal   = sumBy('personal')
        const business   = sumBy('business')
        const untracked  = sumBy('untracked')

        const pct = (n: number) =>
            total ? +(100 * n / total).toFixed(1) : 0
        
        return {
            monthYear,
            total: +total.toFixed(2),
            personal: { amount: personal.toFixed(2), pct: pct(personal) },
            business: { amount: business.toFixed(2), pct: pct(business) },
            untracked: { amount: untracked.toFixed(2), pct: pct(untracked) }
        }
    }

    const monthSummary = getMonthSummary()

    return (
        <Screen>
            <Header title="Receipt"/>

            <View style={globalStyles.content}>
                {loading && <Text>Loading...</Text>}
                {error && <Text style={globalStyles.errorMessage}>{error}</Text>}

                <ScrollView
                    style={globalStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.heroContainer}>
                        <Text style={styles.month}>{monthSummary?.monthYear}</Text>
                        <Text style={styles.bigNumber}>${monthSummary?.total}</Text>
                        <View style={styles.statsRow}>
                            <Text style={styles.statColumn1}>{monthSummary?.personal.pct}%</Text>
                            <Text style={styles.statColumn2}>personal</Text>
                            <Text style={styles.statColumn3}>${monthSummary?.personal.amount}</Text>
                        </View>
                        <View style={styles.statsRow}>
                            <Text style={styles.statColumn1}>{monthSummary?.business.pct}%</Text>
                            <Text style={styles.statColumn2}>business</Text>
                            <Text style={styles.statColumn3}>${monthSummary?.business.amount}</Text>
                        </View>
                        <View style={styles.statsRow}>
                            <Text style={styles.statColumn1}>{monthSummary?.untracked.pct}%</Text>
                            <Text style={styles.statColumn2}>untracked</Text>
                            <Text style={styles.statColumn3}>${monthSummary?.untracked.amount}</Text>
                        </View>
                    </View>

                    <View style={styles.entriesContainer}>
                        {expenseList
                            && expenseList.map(({ monthYear, entries }) => (
                                <View style={styles.monthCard} key={monthYear}>
                                        <View style={styles.monthHeader}>
                                            <Text style={styles.monthHeaderText}>{monthYear}</Text>
                                            <View style={styles.monthHeaderLine}/>
                                        </View>
                                        {entries &&
                                            entries.map((entry) => (
                                                <Pressable
                                                    style={styles.expenseRow}
                                                    key={entry.entry_timestamp}
                                                    onPress={() => {
                                                        setEditorExpense(entry)
                                                        setIsOpen(true)
                                                    }}
                                                >
                                                    <Text style={styles.expenseName}>{entry.name}</Text>
                                                    <Text style={styles.expenseAmount}>${entry.amount.toFixed(2)}</Text>
                                                    <Text style={styles.expenseDate}>{format(parseISO(entry.entry_timestamp), 'MM.dd')}</Text>
                                                </Pressable>
                                            ))
                                        }
                                </View>
                            ))
                        }
                    </View>
                </ScrollView>
            </View>

            <View style={styles.addButtonContainer}>
                <Pressable style={styles.addButton} onPress={() => setIsOpen(true)}>
                    <Fontisto name="plus-a" size={24} color="#666666" />
                </Pressable>
            </View>

            {isOpen && (
                <ExpenseEditor/>
            )}
        </Screen>
    )
}