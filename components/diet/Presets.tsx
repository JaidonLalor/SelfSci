import { View, Text, ScrollView, Pressable } from "react-native";
import Screen from "../shared/Screen";
import Header from "../shared/Header";
import { useFoodPresets } from "@/stores/food_presets";
import { fetchFoodPresetsWithStore } from "@/actions/foodPresets";
import { useEffect } from "react";
import AddButton from "../shared/AddButton";
import { useFoodEditor } from "@/stores/food_editor";
import { FoodEntry } from "@/lib/supabase/food";
import FoodPresetEditor from "./FoodEditor/FoodPresetEditor";
import { styles } from "./Presets.styles";
import { FoodPreset } from "@/lib/supabase/food_presets";

export default function Presets() {
    const { foodPresets } = useFoodPresets()
    const { isOpen, setIsOpen, setEditorFood, reset } = useFoodEditor()
    
    useEffect(() => {
        if (!foodPresets) fetchFoodPresetsWithStore()
    }, [ foodPresets, fetchFoodPresetsWithStore ])

    const handleOpenFoodEditor = () => {
        reset()
        setIsOpen(true)
    }
    
    const handleSelectPreset = (food: FoodPreset) => {
        const foodEntry: FoodEntry = {
            ...food,
            servings: 0 //Doesn't get submitted to db
        }
        setEditorFood(foodEntry)
        setIsOpen(true)
    }

    return (
        <Screen>
            <Header title="Presets"/>
            
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.presetsContainer}>
                    <View style={styles.foodRow}>
                        <Text style={styles.nameCell}>Name</Text>
                        <Text style={styles.foodCell}>Cal</Text>
                        <Text style={styles.foodCell}>p</Text>
                        <Text style={styles.foodCell}>c</Text>
                        <Text style={[styles.foodCell, styles.fatCell]}>f</Text>
                    </View>
                    {foodPresets &&
                        foodPresets.map((preset, index) => (
                            <Pressable
                                key={index}
                                style={styles.foodRow}
                                onPress={() => handleSelectPreset(preset)}
                            >
                                <Text style={styles.nameCell}>{preset.name}</Text>
                                <Text style={styles.foodCell}>{preset.calories}</Text>
                                <Text style={styles.foodCell}>{preset.protein_g}</Text>
                                <Text style={styles.foodCell}>{preset.carbs_g}</Text>
                                <Text style={[styles.foodCell, styles.fatCell]}>{preset.fat_g}</Text>
                            </Pressable>
                        ))
                    }
                </View>
                <View style={styles.spacer}/>
            </ScrollView>

            <AddButton onPress={handleOpenFoodEditor}/>

            {isOpen && <FoodPresetEditor/>}
        </Screen>
    )
}