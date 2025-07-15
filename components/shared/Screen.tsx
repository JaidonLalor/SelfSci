import { ReactNode } from "react"
import { Platform, ViewStyle } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { globalStyles } from "./globalStyles"

type ScreenProps = {
    children: ReactNode
    style?: ViewStyle | ViewStyle[]
}

export default function Screen({ children, style }: ScreenProps) {
    return (
        <SafeAreaView
            style={[
                globalStyles.background,
                { paddingTop: Platform.OS === 'web' ? 48 : 0 },
                { paddingBottom: Platform.OS === 'web' ? 48 : 0 },
                style
            ]}
        >
            {children}
        </SafeAreaView>
    )
}