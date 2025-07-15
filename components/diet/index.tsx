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

export default function DietPage() {
    const router = useRouter()
    const { foodEntries } = useFoodEntries()
    const { isOpen, setIsOpen } = useFoodEditor()

    const handleOpenFoodEditor = () => setIsOpen(true)

    // BLUEPRINT: Make method to only fetch today's food entry
    // and then load all upon launching Analytics page.

    useEffect(() => {
        fetchFoodEntriesWithStore()
    }, [])

    function getTodaysSortedFoods(foodEntries: FoodEntry[] | null): FoodEntry[] | undefined {
        if (!foodEntries) return

        const todayIso = new Date().toISOString().slice(0, 10)

        return foodEntries
            .filter((entry) => entry.entry_timestamp.slice(0, 10) === todayIso)
            .sort((a, b) => {
                return new Date(b.entry_timestamp).getTime() - new Date(a.entry_timestamp).getTime()
            })
    }

    const todaysSortedFoods = getTodaysSortedFoods(foodEntries)

    return (
        <Screen>
            <View style={styles.header} >
                <Pressable onPress={() => router.back()}>
                    <Text style={styles.headerLink} >&lt; Back</Text>
                </Pressable>
                <View style={styles.headerLinkRightCol} >
                    <Pressable onPress={() => router.back()}>
                        <Text style={styles.headerLink} >Previous Logs</Text>
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
                        <Text style={styles.date}>July 8th</Text>
                        <Text style={styles.bigNumber}>1200cal</Text>
                        <View style={styles.statsRow}>
                            <Text style={styles.statColumn1}>100g</Text>
                            <Text style={styles.statColumn2}>protein</Text>
                        </View>
                        <View style={styles.statsRow}>
                            <Text style={styles.statColumn1}>20g</Text>
                            <Text style={styles.statColumn2}>fats</Text>
                        </View>
                        <View style={styles.statsRow}>
                            <Text style={styles.statColumn1}>20g</Text>
                            <Text style={styles.statColumn2}>carbs</Text>
                        </View>
                    </View>

                    <View style={styles.entriesContainer}>
                        {todaysSortedFoods
                            && todaysSortedFoods.map((food) => (
                                <View key={food.id}>
                                    <Text>{food.name}</Text>
                                </View>
                            ))
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