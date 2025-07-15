import { globalStyles } from "@/components/shared/globalStyles";
import { View, Text, Pressable } from "react-native";
import Header from "@/components/shared/Header";
import { useEffect, useState } from "react";
import { useExerciseSets } from "@/stores/exercise_sets";
import { styles } from './IndexPage.styles'
import Button from "@/components/shared/Button";
import { useRouter } from "expo-router";
import Screen from "@/components/shared/Screen";
import { fetchExerciseSetsWithStore } from "@/actions/exercise";
import { getErrorMessage } from "@/lib/utils";
import NewExercise from "./NewExercise";

export default function IndexPage() {
    const { exerciseSets } = useExerciseSets()
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [addExerciseOpen, setAddExerciseOpen] = useState<boolean>(false)

    useEffect(() => {
        const getData = async () => {
            if (!exerciseSets) {
                try {
                    setLoading(true)
                    await fetchExerciseSetsWithStore()
                } catch (error) {
                    const msg = getErrorMessage(error)
                    setError(msg)
                } finally {
                    setLoading(false)
                }
            }
        }
        getData()
    }, [exerciseSets])

    return (
        <Screen>
            <Header title='Workout' />

            <View style={styles.content}>
                {error && (
                    <>
                        <Text style={styles.stateMessage}>Error! {error}</Text>
                        <Button
                            onPress={() => fetchExerciseSetsWithStore()}
                            text="Retry"
                        />
                    </>
                )}
                {loading && <Text style={styles.stateMessage}>Loading...</Text>}

                {exerciseSets && (
                    <View>
                        {[...new Set(exerciseSets.map((e) => e.name))].map((name, index) => (
                        <Pressable
                            onPress={() => router.push(`/workout/${name}`)}
                            style={globalStyles.textMenuPressable}
                            key={index}
                        >
                            <Text style={globalStyles.textMenuText}>{name}</Text>
                        </Pressable>
                        ))}
                    </View>
                )}
                
                <Button
                    text="Add Exercise"
                    onPress={() => {setAddExerciseOpen(true)}}
                    style={styles.addExerciseButton}
                    color="white"
                />
            </View>

            {addExerciseOpen && <NewExercise onClose={() => setAddExerciseOpen(false)}/>}
        </Screen>
    )
}