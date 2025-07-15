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
    const caloriesRef = useRef<RNTextInput>(null)
    const proteinRef = useRef<RNTextInput>(null)
    const carbsRef = useRef<RNTextInput>(null)
    const fatsRef = useRef<RNTextInput>(null)

    const [servingsField, setServingsField] = useState<string>('')
    const [caloriesField, setCaloriesField] = useState<string>('')
    const [proteinField, setProteinField] = useState<string>('')
    const [carbsField, setCarbsField] = useState<string>('')
    const [fatsField, setFatsField] = useState<string>('')

    const handleSubmit = async () => {
        setLoading(true)
        setError('')
        try {
            await updateFoodEntryWithStore({ newFood: editorFood })
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

    const handleFocusFoodNameField = () => { foodNameRef.current?.focus() }
    const handleFocusServingNameField = () => { servingUnitRef.current?.focus() }
    const handleFocusCaloriesField = () => { caloriesRef.current?.focus() }
    const handleFocusProteinField = () => { proteinRef.current?.focus() }
    const handleFocusCarbsField = () => { carbsRef.current?.focus() }
    const handleFocusFatsField = () => { fatsRef.current?.focus() }

    useEffect(() => {
        handleFocusFoodNameField()
    }, [])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <SafeAreaView style={styles.deleteButtonContainer}>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleCloseDelete}>
                        <Ionicons name="trash-outline" size={24} color="#666666" />
                    </TouchableOpacity>
                </SafeAreaView>

                <View style={styles.popup}>
                    <View>
                        <Text style={styles.label}>Food name</Text>
                        <TextInput
                            ref={foodNameRef}
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
                                returnKeyType="done"
                                autoCapitalize="words"
                                autoCorrect={false}
                                autoComplete="off"
                            />
                        </View>
                        <View style={styles.noteButtonContainer}>
                            <View>
                                <Button text="+ Note" onPress={() => {}} size="small" color="white"/>
                            </View>
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