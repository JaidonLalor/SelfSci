import { Ionicons } from "@expo/vector-icons";
import { View, Text, TextInput as RNTextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from "react-native";
import Button from "../../shared/Button";
import { styles } from "./FoodEditorForm.styles";
import { useFoodEditor } from "@/stores/food_editor";
import TextInput from "../../shared/TextInput";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../shared/globalStyles";
import { fetchFoodPresetsWithStore } from "@/actions/foodPresets";
import { useFoodPresets } from "@/stores/food_presets";
import { FoodPreset } from "@/lib/supabase/food_presets";

export type FoodEditorPayload = {
    name: string,
    servingsUnit: string,
    noteOpen: boolean,
    note?: string,
    servings: number,
    calories: number,
    protein: number,
    carbs: number,
    fat: number
}

type FoodEditorProps = {
    onSubmit: (payload: FoodEditorPayload) => void
    onDelete: (id: string) => void
    showServings?: boolean
    autoFill?: boolean
}

export default function FoodEditor({ onSubmit, onDelete, showServings = true, autoFill = true }: FoodEditorProps) {
    const { foodPresets } = useFoodPresets()
    const { editorFood, loading, error, setIsOpen, reset } = useFoodEditor()

    const foodNameRef = useRef<RNTextInput>(null)
    const servingUnitRef = useRef<RNTextInput>(null)
    const servingsRef = useRef<RNTextInput>(null)
    const noteRef = useRef<RNTextInput>(null)
    const caloriesRef = useRef<RNTextInput>(null)
    const proteinRef = useRef<RNTextInput>(null)
    const carbsRef = useRef<RNTextInput>(null)
    const fatsRef = useRef<RNTextInput>(null)

    const [form, setForm] = useState({
        name: '',
        servingsUnit: '',
        noteOpen: false,
        note: '',
        servings: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
    })

    useEffect(() => {
        if (autoFill && !foodPresets) fetchFoodPresetsWithStore()
    }, [autoFill, foodPresets, fetchFoodPresetsWithStore])

    const [matchingPresets, setMatchingPresets] = useState<FoodPreset[]>([])


    // Initialize inputs
    useEffect(() => {
        if (editorFood.id) {
            setForm({
                name: editorFood.name || '',
                servingsUnit: editorFood.servings_unit || '',
                noteOpen: !!editorFood.note, // true if there's a note
                note: editorFood.note || '',
                servings: editorFood.servings?.toString() || '',
                calories: editorFood.calories?.toString() || '',
                protein: editorFood.protein_g?.toString() || '',
                carbs: editorFood.carbs_g?.toString() || '',
                fat: editorFood.fat_g?.toString() || '',
            })
        }

        if (editorFood.note) handleNoteOpen()
    }, [editorFood])

    const handleClose = () => {
        setIsOpen(false)
        reset()
    }

    const handleNoteOpen = () => {
        setForm((prev) => ({
            ...prev,
            noteOpen: true,
        }))
        setTimeout(() => {
            noteRef.current?.focus()
        }, 50)
    }

    const handleNoteClose = () => {
        setForm((prev) => ({
            ...prev,
            note: '',
            noteOpen: false,
        }))
    }

    const handleSelectPreset = (preset: FoodPreset) => {
        setForm({
            name: preset.name,
            servingsUnit: preset.servings_unit,
            noteOpen: !!preset.note,
            note: preset.note ?? '',
            servings: '', // let user fill this if needed
            calories: preset.calories.toString(),
            protein: preset.protein_g.toString(),
            carbs: preset.carbs_g.toString(),
            fat: preset.fat_g.toString(),
        })
        setMatchingPresets([])
    }

    const handleSubmit = () => {
        const parsed: FoodEditorPayload = {
            name: form.name.trim(),
            servingsUnit: form.servingsUnit.trim(),
            noteOpen: form.noteOpen,
            note: form.note?.trim() || undefined,
            servings: Number(form.servings || 0),
            calories: Number(form.calories || 0),
            protein: Number(form.protein || 0),
            carbs: Number(form.carbs || 0),
            fat: Number(form.fat || 0),
        }
        onSubmit(parsed)
    }

    const handleDelete = () => {
        if (!editorFood.id) return
        onDelete(editorFood.id)
    }

    const handleFocusFoodNameField = () => { foodNameRef.current?.focus() }
    const handleFocusServingNameField = () => { servingUnitRef.current?.focus() }
    const handleFocusCaloriesField = () => { caloriesRef.current?.focus() }
    const handleFocusProteinField = () => { proteinRef.current?.focus() }
    const handleFocusCarbsField = () => { carbsRef.current?.focus() }
    const handleFocusFatsField = () => { fatsRef.current?.focus() }

    // Focus name on open
    useEffect(() => {
        handleFocusFoodNameField()
    }, [])

    // If no note, close field
    useEffect(() => {
        const keyboardListener = Keyboard.addListener('keyboardDidHide', () => {
            if (!form.note.trim()) {
                handleNoteClose()
            }
        })
        return () => {
            keyboardListener.remove()
        }
    }, [form.note])

    return (
        <TouchableWithoutFeedback onPress={handleClose}>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                {editorFood.id && (
                    <SafeAreaView style={styles.deleteButtonContainer}>
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={24} color="#666666" />
                        </TouchableOpacity>
                    </SafeAreaView>
                )}

                <View style={styles.popup}>
                    <View>
                        <Text style={styles.label}>Food name</Text>
                        <TextInput
                            ref={foodNameRef}
                            placeholder="Oats"
                            value={form.name}
                            onChangeText={(val) => {
                                setForm((prev) => ({ ...prev, name: val }))

                                if (!val.trim()) {
                                    setMatchingPresets([]) // ← clear if empty
                                    return
                                }

                                const filtered = foodPresets?.filter((preset) =>
                                    preset.name.toLowerCase().includes(val.toLowerCase())
                                ) ?? []

                                setMatchingPresets(filtered)
                            }}
                            onSubmitEditing={handleFocusServingNameField}
                            returnKeyType="done"
                            autoCapitalize="words"
                            autoCorrect={false}
                            autoComplete="off"
                        />
                        {matchingPresets.length > 0 && autoFill && (
                            <View style={styles.dropdown}>
                                <ScrollView keyboardShouldPersistTaps="handled">
                                    {matchingPresets.slice(0, 5).map((preset) => (
                                        <TouchableOpacity
                                            key={preset.id}
                                            onPress={() => handleSelectPreset(preset)}
                                            style={styles.dropdownItem}
                                        >
                                            <Text style={styles.dropdownText}>{preset.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                    <View style={styles.servingNoteLayout}>
                        <View style={styles.servingSizeContainer}>
                            <Text style={styles.label}>Serving size</Text>
                            <TextInput
                                ref={servingUnitRef}
                                value={form.servingsUnit}
                                onChangeText={(val) => setForm((prev) => ({ ...prev, servingsUnit: val }))}
                                onSubmitEditing={handleFocusServingNameField}
                                placeholder="1 cup"
                                returnKeyType="done"
                                autoCapitalize="words"
                                autoCorrect={false}
                                autoComplete="off"
                            />
                        </View>
                        <View style={styles.noteButtonContainer}>
                            {form.noteOpen ? (
                                <View style={styles.noteInputContainer}>
                                    <Text style={styles.label}>Note</Text>
                                    <TextInput
                                        ref={noteRef}
                                        style={styles.noteInput}
                                        value={form.note}
                                        onChangeText={(val) => setForm((prev) => ({ ...prev, note: val }))}
                                    />
                                </View>
                            ) : (
                                <View>
                                    <Text style={styles.label} />
                                    <View>
                                        <Button text="+ Note" onPress={handleNoteOpen} size="small" color="white"/>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                    
                    <View style={styles.numberColumnContainer}>
                        {showServings && (
                            <View style={styles.numberColumn}>
                                <Text style={styles.label}>Servings</Text>
                                <TextInput
                                    ref={servingsRef}
                                    style={styles.numberColumnNumberField}
                                    placeholder="0"
                                    value={form.servings}
                                    onChangeText={(val) => setForm((prev) => ({ ...prev, servings: val }))}
                                    keyboardType="decimal-pad"
                                    onSubmitEditing={handleFocusCaloriesField}
                                />
                            </View>
                        )}
                        
                        <View style={styles.numberColumn}>
                            <Text style={styles.label}>Calories</Text>
                            <TextInput
                                ref={caloriesRef}
                                style={styles.numberColumnNumberField}
                                placeholder="0"
                                value={form.calories}
                                onChangeText={(val) => setForm((prev) => ({ ...prev, calories: val }))}
                                keyboardType="decimal-pad"
                                onSubmitEditing={handleFocusProteinField}
                            />
                        </View>
                        
                        <View style={styles.numberColumn}>
                            <Text style={styles.label}>Protein(g)</Text>
                            <TextInput
                                ref={proteinRef}
                                style={styles.numberColumnNumberField}
                                placeholder="0"
                                value={form.protein}
                                onChangeText={(val) => setForm((prev) => ({ ...prev, protein: val }))}
                                keyboardType="decimal-pad"
                                onSubmitEditing={handleFocusCarbsField}
                            />
                        </View>
                        
                        <View style={styles.numberColumn}>
                            <Text style={styles.label}>Carbs(g)</Text>
                            <TextInput
                                ref={carbsRef}
                                style={styles.numberColumnNumberField}
                                placeholder="0"
                                value={form.carbs}
                                onChangeText={(val) => setForm((prev) => ({ ...prev, carbs: val }))}
                                keyboardType="decimal-pad"
                                onSubmitEditing={handleFocusFatsField}
                            />
                        </View>
                        
                        <View style={styles.numberColumn}>
                            <Text style={styles.label}>Fats(g)</Text>
                            <TextInput
                                ref={fatsRef}
                                style={styles.numberColumnNumberField}
                                placeholder="0"
                                value={form.fat}
                                onChangeText={(val) => setForm((prev) => ({ ...prev, fat: val }))}
                                keyboardType="decimal-pad"
                                onSubmitEditing={handleSubmit}
                            />
                        </View>
                    </View>
                    

                    {error && <Text style={globalStyles.errorMessage}>{error}</Text>}

                    <Button
                        text={
                            loading
                                ? 'Loading...'
                                : editorFood.id
                                    ? 'Update'
                                    : 'Save'
                            }
                        onPress={handleSubmit}
                        size="medium"
                        layout="fill"
                        color="dark"
                    />
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}