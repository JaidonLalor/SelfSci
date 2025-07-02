import { Pressable, Text, View } from "react-native";
import { styles } from "./IndexPage.styles";
import { useRouter } from "expo-router";
import { globalStyles } from "@/shared/globalStyles";
import Screen from "@/shared/Screen";

export default function IndexPage() {
    const router = useRouter()

    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    })

    return (
        <Screen>
            <View style={styles.title}>
                <Text style={styles.tracker}>Tracker</Text>
                <Text style={styles.date}>{today}</Text>
            </View>

            <View style={globalStyles.content}>
                <Pressable
                    onPress={() => router.push('/mood')}
                    style={globalStyles.textMenuPressable}
                >
                    <Text style={globalStyles.textMenuText} >Mood</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/workout')}
                    style={globalStyles.textMenuPressable}
                >
                    <Text style={globalStyles.textMenuText} >Workout</Text>
                </Pressable>
                <Pressable style={globalStyles.textMenuPressable} >
                    <Text style={globalStyles.textMenuTextDisabled} >Diet</Text>
                </Pressable>
                <Pressable style={globalStyles.textMenuPressable} >
                    <Text style={globalStyles.textMenuTextDisabled} >Biotracker</Text>
                </Pressable>
                <Pressable style={globalStyles.textMenuPressable} >
                    <Text style={globalStyles.textMenuTextDisabled} >EEG</Text>
                </Pressable>
                <Pressable style={globalStyles.textMenuPressable} >
                    <Text style={globalStyles.textMenuTextDisabled} >Journal</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/receipt')}
                    style={globalStyles.textMenuPressable}
                    >
                    <Text style={globalStyles.textMenuTextDisabled} >Task</Text>
                </Pressable>
                <Pressable style={globalStyles.textMenuPressable} >
                    <Text style={globalStyles.textMenuText} >Receipt</Text>
                </Pressable>
            </View>
        </Screen>
    )
}