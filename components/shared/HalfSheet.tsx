import { ReactNode } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, TouchableWithoutFeedback, View } from "react-native"
import { styles } from './HalfSheet.styles'

type HalfSheetProps = {
    children: ReactNode
    onClose: () => void
}

export default function HalfSheet({ children, onClose }: HalfSheetProps) {
    return (
        <Pressable style={styles.overlay} onPress={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.sheet}
                >
                    <View style={styles.container}>
                        {children}
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Pressable>
    )
}