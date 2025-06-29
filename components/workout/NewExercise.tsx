import { Pressable, View } from "react-native";
import { styles } from "./NewExercise.styles";

type NewExerciseProps = {
    onClose: () => void
}

export default function NewExercise({ onClose }: NewExerciseProps) {
    return (
        <Pressable style={styles.overlay} onPress={onClose}>
            <View style={styles.popup}>
                
            </View>
        </Pressable>
    )
}