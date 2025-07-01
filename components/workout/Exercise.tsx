import { useLocalSearchParams } from "expo-router";
import { View, Text, Pressable, ScrollView } from "react-native";
import Screen from "@/shared/Screen";
import Header from "@/shared/Header";
import { globalStyles } from "@/shared/globalStyles";
import { useExerciseSets } from "@/stores/exercise_sets";
import { formatISO, parseISO, format } from 'date-fns'
import { emptyExerciseSet, ExerciseSet } from "@/lib/supabase/exercise";
import { styles } from "./Exercise.styles";
import { Fontisto } from "@expo/vector-icons";
import { useEffect, useMemo } from "react";
import ExerciseEditor from "./ExerciseEditor";
import { useExerciseEditor } from "@/stores/exercise_editor";

export default function Exercise() {
    const { name: rawName } = useLocalSearchParams()
    const name = Array.isArray(rawName) ? rawName[0] : rawName
    const { exerciseSets } = useExerciseSets()
    const { isOpen, setIsOpen, setEditorSet } = useExerciseEditor()

    // Set default new exercise entry to most recent entry
    const setsForExercise = useMemo(() => {
        return exerciseSets?.filter((set) => set.name === name)
    }, [exerciseSets, name])
    useEffect(() => {
        if (!name) return

        const mostRecent = setsForExercise?.slice().sort((a, b) =>
            new Date(b.entry_timestamp).getTime() - new Date(a.entry_timestamp).getTime()
        )[0]
        const latestEditorSet: ExerciseSet = {
            ...emptyExerciseSet,
            name: name ?? '',
            reps: mostRecent?.reps ?? 0,
            weight_lbs: mostRecent?.weight_lbs ?? 0,
        }
        
        setEditorSet(latestEditorSet)
    }, [name, setsForExercise, setEditorSet])

    // Auto open new exercise popup if no records
    useEffect(() => {
        if (!exerciseSets) {
            setIsOpen(true)
            return
        }

        const setsForExercise = exerciseSets.filter(set => set.name === name)

        if (setsForExercise.length === 0) {
            setIsOpen(true)
        }
    }, [exerciseSets, name])

    const groupedByDate = setsForExercise?.reduce((acc, set) => {
        const date = formatISO(new Date(set.entry_timestamp), { representation: 'date'}) // YYYY-MM-DD
        if (!acc[date]) acc[date] = []
        acc[date].push(set)
        return acc
    }, {} as Record<string, ExerciseSet[]>)

    return (
        <Screen>
            <Header title={name} />

            <View style={globalStyles.content}>
                <ScrollView
                    style={globalStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {groupedByDate
                        && Object.entries(groupedByDate)
                            .sort(([a], [b]) => (a < b ? 1 : -1)) //Newest first
                            .map(([date, sets]) => {
                                const formattedDate = format(parseISO(date), 'MMMM d, yyyy')
                                return (
                                    <View key={date} style={styles.daySection}>

                                        <View style={styles.dayTitleContainer}>
                                            <Text style={styles.dayTitle}>{formattedDate}</Text>
                                            <View style={styles.horizontalLine} />
                                        </View>

                                        {sets
                                            .sort((a, b) => new Date(b.entry_timestamp).getTime() - new Date(a.entry_timestamp).getTime())
                                            .map((set, index) => {
                                            const formattedSetDate = format(parseISO(set.entry_timestamp), 'h:mma')

                                            return (
                                                <Pressable
                                                    onPress={() => {
                                                        setEditorSet(set)
                                                        setIsOpen(true)
                                                    }}
                                                    key={index}
                                                >
                                                    <View key={set.id} style={styles.numbersRow}>
                                                        <Text style={styles.timeCell}>{formattedSetDate}</Text>
                                                        <Text style={styles.numberCell}>
                                                            <Text style={styles.numberText}>{set.reps}</Text>
                                                            &nbsp;reps
                                                        </Text>
                                                        <Text style={styles.numberCell}>
                                                            <Text style={styles.numberText}>{set.weight_lbs}</Text>
                                                            &nbsp;lbs
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.noteText}>{set.note}</Text>
                                                </Pressable>
                                            )
                                        })}
                                    </View>
                                )
                            })
                    }
                    <View style={globalStyles.spacer}/>
                </ScrollView>
            </View>

            <View style={styles.addButtonContainer}>
                <Pressable style={styles.addButton} onPress={() => setIsOpen(true)}>
                    <Fontisto name="plus-a" size={24} color="#666666" />
                </Pressable>
            </View>

            {isOpen && <ExerciseEditor />}
        </Screen>
    )
}