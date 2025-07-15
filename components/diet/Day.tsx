import { useLocalSearchParams } from "expo-router"
import { Text } from "react-native"

export default function DietDayPage() {
    const { date: rawDate } = useLocalSearchParams()
    const date = Array.isArray(rawDate) ? rawDate[0] : rawDate

    return (
        <Text>{date}</Text>
    )
}