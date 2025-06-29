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
import { useState } from "react";
import ExerciseEditor from "./ExerciseEditor";

export default function Exercise() {
    const { name: rawName } = useLocalSearchParams()
    const name = Array.isArray(rawName) ? rawName[0] : rawName
    const { exerciseSets } = useExerciseSets()
    const [exerciseEditorOpen, setExerciseEditorOpen] = useState<boolean>(false)

    const setsForExercise = exerciseSets?.filter(
        (set) => set.name === name
    )

    const mostRecent = setsForExercise?.[0]
    const initialEditorSet: ExerciseSet = {
        ...emptyExerciseSet,
        name: name ?? '',
        reps: mostRecent?.reps ?? 0,
        weight_lbs: mostRecent?.weight_lbs ?? 0,
    }
    const [editorSet, setEditorSet] = useState<ExerciseSet>(initialEditorSet)

    const groupedByDate = setsForExercise?.reduce((acc, set) => {
        const date = formatISO(new Date(set.entry_timestamp), { representation: 'date'}) // YYYY-MM-DD
        if (!acc[date]) acc[date] = []
        acc[date].push(set)
        return acc
    }, {} as Record<string, ExerciseSet[]>)

    const handlePopupClose = () => {
        setExerciseEditorOpen(false)
        setEditorSet(initialEditorSet)
    }

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

                                        {sets.map((set, index) => {
                                            const formattedSetDate = format(parseISO(set.entry_timestamp), 'h:mma')

                                            return (
                                                <Pressable
                                                    onPress={() => {
                                                        setEditorSet(set)
                                                        setExerciseEditorOpen(true)
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
                <Pressable style={styles.addButton} onPress={() => setExerciseEditorOpen(true)}>
                    <Fontisto name="plus-a" size={24} color="#666666" />
                </Pressable>
            </View>

            {exerciseEditorOpen && (
                <ExerciseEditor
                    editorSet={editorSet}
                    setEditorSet={setEditorSet}
                    onClose={() => handlePopupClose()}
                />
            )}
        </Screen>
    )
}