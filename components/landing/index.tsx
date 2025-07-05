import { Text, View, Image, Pressable } from 'react-native'
import Screen from '@/shared/Screen'
import Button from '@/shared/Button'
import { useRouter } from 'expo-router'

export default function Landing() {
    const router = useRouter()

    return (
        <Screen>
            <View style={{ alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                <Text style={{ fontSize: 96, color: '#B4B4B4' }}>Tracker</Text>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 24 }}>
                    <Image
                        source={require('@/assets/images/tracker-home.png')}
                        style={{
                            width: 250,
                            height: 500
                        }}
                        resizeMode="contain"
                    />
                    <View style={{ width: 300, height: '100%', justifyContent: 'center', gap: 18 }}>
                        <Text style={{ fontSize: 30, color: '#666666' }}>What gets measured gets managed.</Text>
                        <Text style={{ fontSize: 18, color: '#B4B4B4' }}>Track spending, exercise, and diet.</Text>
                        <Text style={{ fontSize: 18, color: '#B4B4B4' }}>See patterns & reflect.</Text>
                        <Button text='Launch App' size='small' color='gray' onPress={() => router.push('/login')} />

                        <Pressable
                            style={{ position: 'absolute', bottom: 24 }}
                            onPress={() => router.push('/privacy')}
                        >
                            <Text style={{ fontSize: 12, color: '#B4B4B4', textDecorationLine: 'underline' }}>Privacy Policy</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Screen>
    )
}