import { ExerciseSet } from "@/lib/supabase/exercise"
import { Pressable, View, Text } from "react-native"
import { styles } from './ExerciseEditor.styles'
import Button from "@/shared/Button"
import { Fontisto, Ionicons } from "@expo/vector-icons"
import { Dispatch, SetStateAction, useState } from "react"
import { deleteExerciseSetWithStore, updateExerciseSetWithStore } from "@/actions/exercise"
import { getErrorMessage } from "@/lib/utils"

type ExerciseEditorProps = {
    editorSet: ExerciseSet
    setEditorSet: Dispatch<SetStateAction<ExerciseSet>>
    onClose: () => void
}

export default function ExerciseEditor({ editorSet, setEditorSet, onClose }: ExerciseEditorProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const handleIncrementReps = () => {
        setEditorSet((prev) => ({
            ...prev,
            reps: (prev?.reps ?? 0) + 1,
        }))
    }

    const handleDecrementReps = () => {
        setEditorSet((prev) => ({
            ...prev,
            reps: Math.max(0, (prev?.reps ?? 0) - 1),
        }))
    }

    const handleIncrementWeight = () => {
        setEditorSet((prev) => ({
            ...prev,
            weight_lbs: (prev?.weight_lbs ?? 0) + 2.5,
        }))
    }

    const handleDecrementWeight = () => {
        setEditorSet((prev) => ({
            ...prev,
            weight_lbs: Math.max(0, (prev?.weight_lbs ?? 0) -2.5)
        }))
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            setError('')
            await updateExerciseSetWithStore({ newSet: editorSet })
            onClose()
        } catch (error) {
            const msg = getErrorMessage(error)
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            setLoading(true)
            setError('')
            await deleteExerciseSetWithStore(id)
            onClose()
        } catch (error) {
            const msg = getErrorMessage(error)
            setError(msg)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // BLUEPRINT: Add note input
    
    return (
        <Pressable style={styles.overlay} onPress={onClose}>
            <View style={styles.popup}>
                <View style={styles.inputRow}>
                    <Pressable style={styles.button} onPress={handleDecrementReps}>
                        <Fontisto name="minus-a" size={16} color='#666666' />
                    </Pressable>
                    <Text style={styles.number}>
                        {editorSet?.reps ?? 0}
                        <Text style={styles.label}>&nbsp;reps</Text>
                    </Text>
                    <Pressable style={styles.button} onPress={handleIncrementReps}>
                        <Fontisto name="plus-a" size={16} color='#666666' />
                    </Pressable>
                </View>
                <View style={styles.inputRow}>
                    <Pressable style={styles.button} onPress={handleDecrementWeight}>
                        <Text style={styles.twoPointFive}>-2.5</Text>
                    </Pressable>
                    <Text style={styles.number}>
                        {editorSet?.weight_lbs ?? 0}
                        <Text style={styles.label}>&nbsp;lbs</Text>
                    </Text>
                    <Pressable style={styles.button} onPress={handleIncrementWeight}>
                        <Text style={styles.twoPointFive}>+2.5</Text>
                    </Pressable>
                </View>
                
                {/* <Button text="+ Note" onPress={() => {}} size="small" color="white"/> */}

                {error && <Text style={styles.errorMessage}>{error}</Text>}

                <Button
                    text={
                        loading
                            ? 'Loading...'
                            : editorSet.id
                                ? 'Update'
                                : 'Save'
                        }
                    onPress={() => handleSubmit()}
                    size="medium"
                    layout="fill"
                    color="dark"
                />

                {editorSet.id && (
                    <Pressable
                        style={styles.deleteButton}
                        onPress={() => handleDelete(editorSet.id)}
                    >
                        <Ionicons name="trash-outline" size={24} color="#666666" />
                    </Pressable>
                )}
            </View>
        </Pressable>
    )
}