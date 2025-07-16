import { globalStyles } from '@/components/shared/globalStyles'
import { Pressable, ScrollView, Text, View } from 'react-native'
import Screen from '@/components/shared/Screen'
import { useRouter } from 'expo-router'
import { styles } from './Index.styles'
import { Fontisto } from '@expo/vector-icons'
import FoodEditor from './FoodEditor'
import { useFoodEditor } from '@/stores/food_editor'
import { useEffect } from 'react'
import { fetchFoodEntriesWithStore } from '@/actions/foods'
import { useFoodEntries } from '@/stores/food_entries'
import { FoodEntry } from '@/lib/supabase/food'

export default function DietDayPage() {
    const router = useRouter()
    const { foodEntries } = useFoodEntries()
    const { isOpen, setIsOpen, setEditorFood } = useFoodEditor()

    const handleOpenFoodEditor = () => setIsOpen(true)
    const handleSelectFood = (food: FoodEntry) => {
        setEditorFood(food)
        setIsOpen(true)
    }

    // BLUEPRINT: Make method to only fetch today's food entry and then load all upon launching Analytics page.
    // BLUEPRINT: Display note in logs

    useEffect(() => {
        fetchFoodEntriesWithStore()
    }, [])

    function getTodaysSortedFoods(foodEntries: FoodEntry[] | null): FoodEntry[] | undefined {
        if (!foodEntries) return

        const today = new Date()
        const localDateString = today.toLocaleDateString('en-CA') // e.g., "2025-07-15"

        return foodEntries
            .filter((entry) => {
                const entryLocalDate = new Date(entry.entry_timestamp).toLocaleDateString('en-CA')
                return entryLocalDate === localDateString
            })
            .sort((a, b) => {
                return new Date(b.entry_timestamp).getTime() - new Date(a.entry_timestamp).getTime()
            })
    }

    type Totals = {
        calories: number
        protein_g: number
        carbs_g: number
        fat_g: number
    }

    function getTodaysTotals(todaysFoods: FoodEntry[] | undefined): Totals | null {
        if (!todaysFoods) return null

        return todaysFoods.reduce<Totals>(
            (totals, entry) => {
            const servings = entry.servings || 0

            totals.calories += entry.calories * servings
            totals.protein_g += entry.protein_g * servings
            totals.carbs_g += entry.carbs_g * servings
            totals.fat_g += entry.fat_g * servings

            return totals
            },
            { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
        )
    }

    const today = new Date()
    const displayDate = today.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    })

    const todaysSortedFoods = getTodaysSortedFoods(foodEntries)
    const todaysTotals = getTodaysTotals(todaysSortedFoods)

    return (
        <Screen>
            <View style={styles.header} >
                <Pressable onPress={() => router.back()}>
                    <Text style={styles.headerLink} >&lt; Back</Text>
                </Pressable>
                <View style={styles.headerLinkRightCol} >
                    <Pressable onPress={() => router.push('/diet/logs')}>
                        <Text style={styles.headerLink} >Previous Logs</Text>
                    </Pressable>
                    <Pressable onPress={() => router.back()}>
                        <Text style={styles.headerLink} >Manage Presets</Text>
                    </Pressable>
                    <Pressable onPress={() => router.back()}>
                        <Text style={styles.headerLink} >Analytics</Text>
                    </Pressable>
                </View>
            </View>
            <View style={globalStyles.content}>
                {/* {loading && <Text>Loading...</Text>}
                {error && <Text style={globalStyles.errorMessage}>{error}</Text>} */}

                <ScrollView
                    style={globalStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.heroContainer}>
                        <Text style={styles.date}>{displayDate}</Text>
                        <Text style={styles.bigNumber}>{todaysTotals?.calories}cal</Text>
                        <View style={styles.statsRow}>
                            <Text style={styles.statColumn1}>{todaysTotals?.protein_g}g</Text>
                            <Text style={styles.statColumn2}>protein</Text>
                        </View>
                        <View style={styles.statsRow}>
                            <Text style={styles.statColumn1}>{todaysTotals?.carbs_g}g</Text>
                            <Text style={styles.statColumn2}>carbs</Text>
                        </View>
                        <View style={styles.statsRow}>
                            <Text style={styles.statColumn1}>{todaysTotals?.fat_g}g</Text>
                            <Text style={styles.statColumn2}>fats</Text>
                        </View>
                    </View>

                    <View style={styles.entriesContainer}>
                        <View style={styles.foodRow}>
                            <Text style={styles.nameCell}>Name</Text>
                            <Text style={styles.foodCell}>Cal</Text>
                            <Text style={styles.foodCell}>p</Text>
                            <Text style={styles.foodCell}>c</Text>
                            <Text style={[styles.foodCell, styles.fatCell]}>f</Text>
                        </View>
                        {todaysSortedFoods
                            && todaysSortedFoods.map((food) => {
                                const totalCalories = food.servings * food.calories
                                const totalProtein = food.servings * food.protein_g
                                const totalCarbs = food.servings * food.carbs_g
                                const totalFat = food.servings * food.fat_g

                                return (
                                    <Pressable
                                        key={food.id}
                                        style={styles.foodRow}
                                        onPress={() => handleSelectFood(food)}
                                    >
                                        <Text style={styles.nameCell}>{food.name}</Text>
                                        <Text style={styles.foodCell}>{totalCalories}</Text>
                                        <Text style={styles.foodCell}>{totalProtein}</Text>
                                        <Text style={styles.foodCell}>{totalCarbs}</Text>
                                        <Text style={[styles.foodCell, styles.fatCell]}>{totalFat}</Text>
                                    </Pressable>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>

            <View style={styles.addButtonContainer}>
                <Pressable style={styles.addButton} onPress={handleOpenFoodEditor}>
                    <Fontisto name="plus-a" size={24} color="#666666" />
                </Pressable>
            </View>

            {isOpen && <FoodEditor/>}
        </Screen>
    )
}