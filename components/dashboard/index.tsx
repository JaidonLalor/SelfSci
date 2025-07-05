import { Pressable, Text, View } from "react-native";
import { styles } from "./dashboard.styles";
import { useRouter } from "expo-router";
import { globalStyles } from "@/shared/globalStyles";
import Screen from "@/shared/Screen";
import { useUserSettings } from "@/stores/user_settings";

export default function IndexPage() {
    const router = useRouter()
    const { userSettings } = useUserSettings()

    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    })

    return (
        <Screen>
            <View style={styles.title}>
                <Text style={styles.tracker}>Tracker</Text>
                <View>
                    {/* <Text style={styles.date}>{today}</Text> */}
                    <Pressable onPress={() => router.push('/settings')}>
                        <Text style={styles.settings}>Settings</Text>
                    </Pressable>
                </View>
            </View>

            <View style={globalStyles.content}>
                {userSettings?.enabled_menu_items?.mood && (
                    <Pressable
                        onPress={() => router.push('/mood')}
                        style={globalStyles.textMenuPressable}
                    >
                        <Text style={globalStyles.textMenuText} >Mood</Text>
                    </Pressable>
                )}

                {userSettings?.enabled_menu_items?.workout && (
                    <Pressable
                        onPress={() => router.push('/workout')}
                        style={globalStyles.textMenuPressable}
                    >
                        <Text style={globalStyles.textMenuText} >Workout</Text>
                    </Pressable>
                )}

                {userSettings?.enabled_menu_items?.diet && (
                    <Pressable style={globalStyles.textMenuPressable} >
                        <Text style={globalStyles.textMenuTextDisabled} >Diet</Text>
                    </Pressable>
                )}

                {userSettings?.enabled_menu_items?.biotracker && (
                    <Pressable style={globalStyles.textMenuPressable} >
                        <Text style={globalStyles.textMenuTextDisabled} >Biotracker</Text>
                    </Pressable>
                )}

                {/* <Pressable style={globalStyles.textMenuPressable} >
                    <Text style={globalStyles.textMenuTextDisabled} >EEG</Text>
                </Pressable>

                <Pressable style={globalStyles.textMenuPressable} >
                    <Text style={globalStyles.textMenuTextDisabled} >Journal</Text>
                </Pressable>

                <Pressable style={globalStyles.textMenuPressable} >
                    <Text style={globalStyles.textMenuTextDisabled} >Task</Text>
                </Pressable> */}

                {userSettings?.enabled_menu_items?.expense && (
                    <Pressable
                        style={globalStyles.textMenuPressable}
                        onPress={() => router.push('/receipt')}
                        >
                        <Text style={globalStyles.textMenuText} >Receipt</Text>
                    </Pressable>
                )}
            </View>
        </Screen>
    )
}