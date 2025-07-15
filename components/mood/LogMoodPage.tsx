import { useRef, useEffect } from 'react'
import { View, Text, TextInput as RNTextInput } from "react-native";
import TextInput from '@/components/shared/TextInput'
import { styles } from "./LogMoodPage.style";
import { useRouter } from "expo-router";
import Button from "@/components/shared/Button";
import Slider from "@/components/shared/Slider";
import { useState } from "react";
import { saveMoodEntry } from "@/lib/supabase/mood";
import Header from '@/components/shared/Header';
import Screen from '@/components/shared/Screen';

export default function LogMoodPage() {
    const router = useRouter()
    const [valence, setValence] = useState<number>(0)
    const [energy, setEnergy] = useState<number>(0)
    const noteInputRef = useRef<RNTextInput>(null)
    const [noteOpen, setNoteOpen] = useState<boolean>(false)
    const [note, setNote] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const handleSave = async () => {
        setError('')
        setLoading(true)
        try {
            const saved = await saveMoodEntry({ valence: valence, energy: energy, note: note })
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

    useEffect(() => {
        if (noteOpen) {
            setTimeout(() => {
                noteInputRef.current?.focus()
            }, 100)
        }
    }, [noteOpen])

    const handleNoteSubmit = () => {
        if (!note) setNoteOpen(false)
    }

    return (
        <Screen>
            <Header title='Mood' />

            <View style={styles.content}>

                {error && (<Text style={styles.error}>Error: {error}</Text>)}

                <View style={styles.sliderContainer}>
                    <Text style={styles.labelText}>Valence</Text>
                    <Slider
                        value={valence}
                        min={-5}
                        max={5}
                        step={1}
                        onChange={(v) => setValence(v)}
                    />
                    <Text style={styles.labelText}>{valence > 0 && '+'}{valence}</Text>
                </View>
                
                <View style={styles.sliderContainer}>
                    <Text style={styles.labelText}>Energy</Text>
                    <Slider
                        value={energy}
                        min={-5}
                        max={5}
                        step={1}
                        onChange={(v) => setEnergy(v)}
                    />
                    <Text style={styles.labelText}>{energy > 0 && '+'}{energy}</Text>
                </View>

                {noteOpen && (
                    <View style={styles.noteContainer}>
                        <Text style={styles.labelText}>Note</Text>
                        <TextInput
                            ref={noteInputRef}
                            multiline
                            textAlignVertical="top"
                            returnKeyType="done"
                            submitBehavior='blurAndSubmit'
                            onSubmitEditing={handleNoteSubmit}
                            onChangeText={setNote}
                            value={note}
                        />
                    </View>
                )}

                <View style={styles.buttonMenu}>
                    {/* <Button
                        text="+ Feeling"
                        onPress={() => {}}
                        color={'white'}
                        size={'small'}
                    /> */}
                    {!noteOpen && (
                        <Button
                            text="+ Note"
                            onPress={() => setNoteOpen(true)}
                            color={'white'}
                            size={'small'}
                        />
                    )}
                    {/* <Button
                        text="+ Attach Event"
                        onPress={() => {}}
                        color={'white'}
                        size={'small'}
                    /> */}
                </View>

                <View style={styles.saveButtonContainer}>
                    <Button text="Save" onPress={handleSave} disabled={loading} />
                </View>
            </View>
        </Screen>
    )
}