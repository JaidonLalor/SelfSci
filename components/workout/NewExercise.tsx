import Button from "@/components/shared/Button";
import { useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/lib/utils";
import HalfSheet from "@/components/shared/HalfSheet";
import TextInput from "@/components/shared/TextInput";
import { Keyboard, TextInput as RNTextInput, Text, View } from "react-native";
import { globalStyles } from "@/components/shared/globalStyles";
import { useRouter } from "expo-router";

type NewExerciseProps = {
    onClose: () => void
}

export default function NewExercise({ onClose }: NewExerciseProps) {
    const [exerciseName, setExerciseName] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const inputRef = useRef<RNTextInput>(null)
    const router = useRouter()

    const handleSubmit = async () => {
        if (exerciseName.length === 0) {
            onClose()
            return
        }

        try {
            setError('')
            setLoading(true)
            router.push(`/workout/${exerciseName}`)
        } catch (error) {
            setError(getErrorMessage(error))
        } finally {
            setLoading(false)
            onClose()
        }
    }

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    return (
        <HalfSheet onClose={onClose}>
            {error && <Text style={globalStyles.errorMessage}>{error}</Text>}
            <View>
                <Text>Exercise Name</Text>
                <TextInput
                    ref={inputRef}
                    value={exerciseName}
                    onChangeText={setExerciseName}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                        Keyboard.dismiss()
                        handleSubmit()
                    }}
                />
            </View>
            <Button
                text={ loading ? 'Loading...' : 'Add Exercise' }
                onPress={() => handleSubmit()}
                size="medium"
                layout="fill"
                color="dark"
                />
        </HalfSheet>
    )
}