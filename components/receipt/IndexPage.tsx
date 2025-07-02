import { globalStyles } from "@/shared/globalStyles"
import Header from "@/shared/Header"
import Screen from "@/shared/Screen"
import { Fontisto } from "@expo/vector-icons"
import { Pressable, View } from "react-native"
import { styles } from "./IndexPage.styles"
import { useExpenseEditor } from "@/stores/expense_editor"
import ExpenseEditor from "./ExpenseEditor"

export default function IndexPage() {
    const { isOpen, setIsOpen } = useExpenseEditor()

    return (
        <Screen>
            <Header title="Receipt"/>

            <View style={globalStyles.content}>
                
            </View>

            <View style={styles.addButtonContainer}>
                <Pressable style={styles.addButton} onPress={() => setIsOpen(true)}>
                    <Fontisto name="plus-a" size={24} color="#666666" />
                </Pressable>
            </View>

            {isOpen && (
                <ExpenseEditor/>
            )}
        </Screen>
    )
}