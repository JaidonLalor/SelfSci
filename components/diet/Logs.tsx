import { View, Text, ScrollView, Pressable } from "react-native"
import Header from "../shared/Header"
import Screen from "../shared/Screen"
import { useEffect, useState } from "react"
import { fetchFoodEntriesWithStore } from "@/actions/foods"
import { useFoodEntries } from "@/stores/food_entries"
import { globalStyles } from "../shared/globalStyles"
import { FoodEntry } from "@/lib/supabase/food"
import { styles } from "./Logs.styles"

type DailyTotals = {
    date: string // "2025-07-15"
    calories: number
    protein_g: number
    carbs_g: number
    fat_g: number
}

function getTotalsPerDay(foodEntries: FoodEntry[]): DailyTotals[] {
    const totalsMap: Record<string, DailyTotals> = {}

    for (const entry of foodEntries) {
        const date = new Date(entry.entry_timestamp).toLocaleDateString('en-CA') // "YYYY-MM-DD"

        if (!totalsMap[date]) {
            totalsMap[date] = {
                date,
                calories: 0,
                protein_g: 0,
                carbs_g: 0,
                fat_g: 0,
            }
        }

        totalsMap[date].calories += entry.calories
        totalsMap[date].protein_g += entry.protein_g
        totalsMap[date].carbs_g += entry.carbs_g
        totalsMap[date].fat_g += entry.fat_g
    }

    // Convert map to array and sort by most recent date first
    return Object.values(totalsMap).sort((a, b) => b.date.localeCompare(a.date))
}

export default function Logs() {
    const { foodEntries } = useFoodEntries()
    const [dailyTotals, setDailyTotals] = useState<DailyTotals[] | null>(null)

    useEffect(() => {
        if (!foodEntries) {
            fetchFoodEntriesWithStore()
        }
    }, [])

    useEffect(() => {
        if (foodEntries) {
            const totalsPerDay = getTotalsPerDay(foodEntries)
            setDailyTotals(totalsPerDay)
        }
    }, [ foodEntries ])

    return (
        <Screen>
            <Header title='Diet Logs' />
            <ScrollView>
                <View style={[
                    globalStyles.content,
                    styles.table
                ]}>
                    <View style={styles.row}>
                        <Text style={[ styles.textCell, styles.dateCell ]}>Date</Text>
                        <Text style={styles.textCell}>Cal</Text>
                        <Text style={styles.textCell}>p</Text>
                        <Text style={styles.textCell}>c</Text>
                        <Text style={styles.textCell}>f</Text>
                    </View>
                    {dailyTotals && 
                        dailyTotals.map((day: DailyTotals, index: number) => (
                            <Pressable
                                key={index}
                                style={styles.row}
                                onPress={() => {}}
                            >
                                <Text style={[ styles.textCell, styles.dateCell ]}>{day.date}</Text>
                                <Text style={styles.textCell}>{day.calories}</Text>
                                <Text style={styles.textCell}>{day.protein_g}</Text>
                                <Text style={styles.textCell}>{day.carbs_g}</Text>
                                <Text style={styles.textCell}>{day.fat_g}</Text>
                            </Pressable>
                        ))
                    }
                </View>
            </ScrollView>
        </Screen>
    )
}