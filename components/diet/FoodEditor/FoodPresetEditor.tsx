import { deleteFoodPresetWithStore, updateFoodPresetWithStore } from "@/actions/foodPresets";
import FoodEditorForm, { FoodEditorPayload } from "./FoodEditorForm";
import { getErrorMessage } from "@/lib/utils";
import { FoodPreset } from "@/lib/supabase/food_presets";
import { useFoodEditor } from "@/stores/food_editor";

export default function FoodPresetEditor() {
    const { setLoading, setIsOpen, setError, reset, editorFood } = useFoodEditor()
    
    const handleSubmit = async (payload: FoodEditorPayload) => {
        setLoading(true)
        setError('')

        const newPreset: Partial<FoodPreset> = {
            id: editorFood.id,
            name: payload.name,
            servings_unit: payload.servingsUnit,
            calories: payload.calories || 0,
            protein_g: payload.protein || 0,
            fat_g: payload.fat || 0,
            carbs_g: payload.carbs || 0,
            note: payload.note,
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
    
    const handleDelete = async (id: string) => {
        if (id) {
            setLoading(true)
            setError('')
            try {
                await deleteFoodPresetWithStore(id)
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
    
    return (
        <FoodEditorForm
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            showServings={false}
            autoFill={false}
        />
    )
}