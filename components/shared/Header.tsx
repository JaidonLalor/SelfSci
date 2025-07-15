import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

type HeaderProps = {
    type?: 'subsection'
    title: string
}

export default function Header({ type = 'subsection', title }: HeaderProps) {
    const router = useRouter()
    
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <Pressable onPress={() => router.back()}>
                <Text style={{
                    color: '#B4B4B4',
                    textDecorationLine: 'underline',
                    fontSize: 18
                }}>&lt; Back</Text>
            </Pressable>
            <Text style={{
                fontSize: 36,
                color: '#B4B4B4'
            }}>{title}</Text>
        </View>
    )
}