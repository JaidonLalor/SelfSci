import { Platform, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./LogMoodPage.style";
import { useRouter } from "expo-router";
import Button from "../shared/Button";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import { saveMoodEntry } from "@/lib/supabase/mood";

export default function LogMoodPage() {
    const router = useRouter()
    const [valence, setValence] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const handleSave = async () => {
        setError('')
        setLoading(true)
        try {
            const saved = await saveMoodEntry({ valence: valence })
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Unknown error')
            }
        }
        setLoading(false)
        router.back()
    }

    return (
        <SafeAreaView style={[
            styles.background,
            { paddingTop: Platform.OS === 'web' ? 48 : 0 },
            { paddingBottom: Platform.OS === 'web' ? 48 : 0 }
        ]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Text style={styles.back}>&lt; Back</Text>
                </Pressable>
                <Text style={styles.title}>Mood</Text>
            </View>

            <View style={styles.content}>

                {error && (<Text style={styles.error}>Error: {error}</Text>)}

                <View style={styles.sliderContainer}>
                    {/* BLUEPRINT: Would be great to have slider component to handle this and handle styling in future */}

                    <Text style={styles.sliderText}>Valence</Text>
                    {Platform.OS === 'web' ? (
                        <input
                            type="range"
                            min={-5}
                            max={5}
                            step={1}
                            value={valence}
                            onChange={(e) => setValence(Number(e.target.value))}
                            style={{ flex: 1 }}
                        />
                        ) : (
                        <Slider
                            style={styles.slider}
                            value={valence}
                            onValueChange={setValence}
                            minimumValue={-5}
                            maximumValue={5}
                            step={1}
                            minimumTrackTintColor="#666666"
                            maximumTrackTintColor="#B4B4B4"
                            thumbTintColor="#666666"
                        />
                    )}

                    <Text style={styles.sliderText}>{valence > 0 && '+'}{valence}</Text>
                </View>

                <View style={styles.buttonMenu}>
                    <Button
                        text="+ Feeling"
                        onPress={() => {}}
                        color={'white'}
                        size={'small'}
                    />
                    <Button
                        text="+ Note"
                        onPress={() => {}}
                        color={'white'}
                        size={'small'}
                    />
                    <Button
                        text="+ Attach Event"
                        onPress={() => {}}
                        color={'white'}
                        size={'small'}
                    />
                </View>

                <View style={styles.saveButtonContainer}>
                    <Button text="Save" onPress={handleSave} disabled={loading} />
                </View>
            </View>
        </SafeAreaView>
    )
}