import { Ionicons } from "@expo/vector-icons";
import { View, Text, TextInput as RNTextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Button from "../shared/Button";
import { styles } from "./FoodEditor.styles";
import { useFoodEditor } from "@/stores/food_editor";
import TextInput from "../shared/TextInput";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../shared/globalStyles";
import { deleteFoodEntryWithStore, updateFoodEntryWithStore } from "@/actions/foods";
import { getErrorMessage } from "@/lib/utils";

export default function FoodEditor() {
    const { editorFood, setEditorFood, loading, setLoading, setIsOpen, error, setError, reset } = useFoodEditor()

    const foodNameRef = useRef<RNTextInput>(null)
    const servingUnitRef = useRef<RNTextInput>(null)
    const servingsRef = useRef<RNTextInput>(null)
    const noteRef = useRef<RNTextInput>(null)
    const caloriesRef = useRef<RNTextInput>(null)
    const proteinRef = useRef<RNTextInput>(null)
    const carbsRef = useRef<RNTextInput>(null)
    const fatsRef = useRef<RNTextInput>(null)

    const [noteOpen, setNoteOpen] = useState<boolean>(false)
    const [note, setNote] = useState<string>('')
    const [servingsField, setServingsField] = useState<string>('')
    const [caloriesField, setCaloriesField] = useState<string>('')
    const [proteinField, setProteinField] = useState<string>('')
    const [carbsField, setCarbsField] = useState<string>('')
    const [fatsField, setFatsField] = useState<string>('')

    const handleClose = () => {
        setIsOpen(false)
        reset()
    }

    const handleNoteOpen = () => {
        setNoteOpen(true)
        setTimeout(() => {
            noteRef.current?.focus()
        }, 50)
    }
    const handleNoteClose = () => {
        setNote('')
        setNoteOpen(false)
    }

    const handleFocusFoodNameField = () => { foodNameRef.current?.focus() }
    const handleFocusServingNameField = () => { servingUnitRef.current?.focus() }
    const handleFocusCaloriesField = () => { caloriesRef.current?.focus() }
    const handleFocusProteinField = () => { proteinRef.current?.focus() }
    const handleFocusCarbsField = () => { carbsRef.current?.focus() }
    const handleFocusFatsField = () => { fatsRef.current?.focus() }

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        const servings = Number(servingsField || 0)
        const calories = Number(caloriesField || 0)
        const protein = Number(proteinField || 0)
        const carbs = Number(carbsField || 0)
        const fat = Number(fatsField || 0)

        try {
            
            if (!editorFood.servings_unit) throw new Error('No serving size')

            await updateFoodEntryWithStore({
                newFood: {
                    ...editorFood,
                    note,
                    servings,
                    calories,
                    protein_g: protein,
                    carbs_g: carbs,
                    fat_g: fat,
                }
            })
            setIsOpen(false)
            reset()
        } catch (error) {
            const msg = getErrorMessage(error)
            setError(msg)
        } finally {
            setLoading(false)
        }
    }
    
    const handleCloseDelete = async () => {
        if (editorFood.id) {
            setLoading(true)
            setError('')
            try {
                await deleteFoodEntryWithStore(editorFood.id)
                setIsOpen(false)
                reset()
                setError('')
            } catch (error) {
                const msg = getErrorMessage(error)
                setError(msg)
            } finally {
                setLoading(false)
            }
        } else {
            setIsOpen(false)
            reset()
        }
    }
    
    // Initialize inputs
    useEffect(() => {
        if (editorFood.note) {
            setNote(editorFood.note)
            handleNoteOpen()
        }
        if (editorFood.servings) setServingsField(editorFood.servings.toString())
        if (editorFood.calories) setCaloriesField(editorFood.calories.toString())
        if (editorFood.protein_g) setProteinField(editorFood.protein_g.toString())
        if (editorFood.carbs_g) setCarbsField(editorFood.carbs_g.toString())
        if (editorFood.fat_g) setFatsField(editorFood.fat_g.toString())
    }, [editorFood])

    // Focus name on open
    useEffect(() => {
        handleFocusFoodNameField()
    }, [])

    // If no note, close field
    useEffect(() => {
        const keyboardListener = Keyboard.addListener('keyboardDidHide', () => {
            if (!note.trim()) {
                handleNoteClose()
            }
        })
        return () => {
            keyboardListener.remove()
        }
    }, [note])

    return (
        <TouchableWithoutFeedback onPress={handleClose}>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                {editorFood.id && (
                    <SafeAreaView style={styles.deleteButtonContainer}>
                        <TouchableOpacity style={styles.deleteButton} onPress={handleCloseDelete}>
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
                            value={editorFood.name}
                            onChangeText={(value) => {
                                setEditorFood((prev) => ({ ...prev, name: value }))}
                            }
                            onSubmitEditing={handleFocusServingNameField}
                            returnKeyType="done"
                            autoCapitalize="words"
                            autoCorrect={false}
                            autoComplete="off"
                        />
                    </View>
                    <View style={styles.servingNoteLayout}>
                        <View style={styles.servingSizeContainer}>
                            <Text style={styles.label}>Serving size</Text>
                            <TextInput
                                ref={servingUnitRef}
                                value={editorFood.servings_unit}
                                onChangeText={(value) => {
                                    setEditorFood((prev) => ({ ...prev, servings_unit: value }))}
                                }
                                onSubmitEditing={handleFocusServingNameField}
                                placeholder="1 cup"
                                returnKeyType="done"
                                autoCapitalize="words"
                                autoCorrect={false}
                                autoComplete="off"
                            />
                        </View>
                        <View style={styles.noteButtonContainer}>
                            {noteOpen ? (
                                <View style={styles.noteInputContainer}>
                                    <Text style={styles.label}>Note</Text>
                                    <TextInput
                                        ref={noteRef}
                                        style={styles.noteInput}
                                        value={note}
                                        onChangeText={setNote}
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
                        <View style={styles.numberColumn}>
                            <Text style={styles.label}>Servings</Text>
                            <TextInput
                                ref={servingsRef}
                                style={styles.numberColumnNumberField}
                                placeholder="0"
                                value={servingsField}
                                onChangeText={(value) => setServingsField(value)}
                                keyboardType="decimal-pad"
                                onSubmitEditing={handleFocusCaloriesField}
                            />
                        </View>
                        
                        <View style={styles.numberColumn}>
                            <Text style={styles.label}>Calories</Text>
                            <TextInput
                                ref={caloriesRef}
                                style={styles.numberColumnNumberField}
                                placeholder="0"
                                value={caloriesField}
                                onChangeText={(value) => setCaloriesField(value)}
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
                                value={proteinField}
                                onChangeText={(value) => setProteinField(value)}
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
                                value={carbsField}
                                onChangeText={(value) => setCarbsField(value)}
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
                                value={fatsField}
                                onChangeText={(value) => setFatsField(value)}
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