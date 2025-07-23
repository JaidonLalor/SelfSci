import FoodEditorForm, { FoodEditorPayload } from "./FoodEditorForm";
import { deleteFoodEntryWithStore, updateFoodEntryWithStore } from "@/actions/foods";
import { FoodEntry } from "@/lib/supabase/food";
import { getErrorMessage } from "@/lib/utils";
import { useFoodEditor } from "@/stores/food_editor";
import { Fontisto } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { styles } from "./FoodEntryEditor.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/shared/Button";
import { FoodPreset } from "@/lib/supabase/food_presets";
import { updateFoodPresetWithStore } from "@/actions/foodPresets";

export default function FoodEntryEditor() {
    const { setLoading, setIsOpen, setError, reset, editorFood } = useFoodEditor()
    
    const handleSubmit = async (payload: FoodEditorPayload) => {
        setLoading(true)
        setError('')

        const newFood: Partial<FoodEntry> = {
            id: editorFood.id,
            name: payload.name,
            servings: payload.servings || 0,
            servings_unit: payload.servingsUnit,
            calories: payload.calories || 0,
            protein_g: payload.protein || 0,
            fat_g: payload.fat || 0,
            carbs_g: payload.carbs || 0,
            note: payload.note,
            source: "manual"
        }

        try {
            await updateFoodEntryWithStore({ newFood })
            setIsOpen(false)
            reset()
        } catch (error) {
            const msg = getErrorMessage(error)
            setError(msg)
        } finally {
            setLoading(false)
        }
    }
    
    const handleDelete = async (id: string) => {
        if (id) {
            setLoading(true)
            setError('')
            try {
                await deleteFoodEntryWithStore(id)
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
        
    const handleNewPreset = async () => {
        setLoading(true)
        setError('')

        const newPreset: Partial<FoodPreset> = {
            id: editorFood.id,
            name: editorFood.name,
            servings_unit: editorFood.servings_unit,
            calories: editorFood.calories || 0,
            protein_g: editorFood.protein_g || 0,
            fat_g: editorFood.fat_g || 0,
            carbs_g: editorFood.carbs_g || 0,
            note: editorFood.note,
        }

        try {
            await updateFoodPresetWithStore({ newPreset })
            setIsOpen(false)
            reset()
        } catch (error) {
            const msg = getErrorMessage(error)
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <FoodEditorForm
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
            <SafeAreaView style={styles.button}>
                <Button
                    onPress={handleNewPreset}
                    text="+ Add Preset"
                    color="white"
                />
            </SafeAreaView>
        </>
    )
}