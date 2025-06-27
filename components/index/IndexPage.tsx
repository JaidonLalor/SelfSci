import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, View } from "react-native";
import { styles } from "./IndexPage.styles";
import { useRouter } from "expo-router";
import { Platform } from 'react-native'
import { supabase } from "@/lib/supabase";

export default function IndexPage() {
    const router = useRouter()

    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    })

    return (
        <SafeAreaView style={[
            styles.background,
            { paddingTop: Platform.OS === 'web' ? 48 : 0 },
            { paddingBottom: Platform.OS === 'web' ? 48 : 0 }
        ]}>
            <View style={styles.title}>
                <Text style={styles.tracker}>Tracker</Text>
                <Text style={styles.date}>{today}</Text>
            </View>

            <View style={styles.menu}>
                <Pressable
                    onPress={() => router.push('/mood')}
                    style={styles.pressable}
                >
                    <Text style={styles.pressableText}>Mood</Text>
                </Pressable>
                <Pressable style={styles.pressable} >
                    <Text style={styles.pressableTextDisabled}>Diet</Text>
                </Pressable>
                <Pressable style={styles.pressable} >
                    <Text style={styles.pressableTextDisabled}>Biotracker</Text>
                </Pressable>
                <Pressable style={styles.pressable} >
                    <Text style={styles.pressableTextDisabled}>Workout</Text>
                </Pressable>
                <Pressable style={styles.pressable} >
                    <Text style={styles.pressableTextDisabled}>EEG</Text>
                </Pressable>
                <Pressable style={styles.pressable} >
                    <Text style={styles.pressableTextDisabled}>Journal</Text>
                </Pressable>
                <Pressable style={styles.pressable} >
                    <Text style={styles.pressableTextDisabled}>Task</Text>
                </Pressable>
                <Pressable style={styles.pressable} >
                    <Text style={styles.pressableTextDisabled}>Receipt</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}