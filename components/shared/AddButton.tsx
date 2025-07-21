import { Fontisto } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { styles } from "./AddButton.styles";

type AddButtonProps = {
    onPress: () => void
}

export default function AddButton({ onPress }: AddButtonProps) {
    return (
        <View style={styles.addButtonContainer}>
            <Pressable style={styles.addButton} onPress={onPress}>
                <Fontisto name="plus-a" size={24} color="#666666" />
            </Pressable>
        </View>
    )
}