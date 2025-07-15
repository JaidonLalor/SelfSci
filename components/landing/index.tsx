import { Text, View, Image, Pressable } from 'react-native'
import Screen from '@/components/shared/Screen'
import Button from '@/components/shared/Button'
import { useRouter } from 'expo-router'

export default function Landing() {
    const router = useRouter()

    return (
        <Screen>
            <View style={{ alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                <Text style={{ fontSize: 96, color: '#B4B4B4' }}>SelfSci</Text>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 32 }}>
                    <Image
                        source={require('@/assets/images/tracker-home.png')}
                        style={{
                            width: 250,
                            height: 500
                        }}
                        resizeMode="contain"
                    />
                    <View style={{ width: 350, height: '100%', justifyContent: 'center', gap: 18 }}>
                        <Text style={{ fontSize: 30, color: '#666666' }}>Data driven self discovery.</Text>
                        <Text style={{ fontSize: 18, color: '#B4B4B4' }}>Track your health, spending, and diet.</Text>
                        <Text style={{ fontSize: 18, color: '#B4B4B4' }}>Uncover patterns and correlations.</Text>
                        <Text style={{ fontSize: 18, color: '#B4B4B4' }}>Optimize your trajectory.</Text>
                        <Button text='Launch App' size='small' color='gray' onPress={() => router.push('/login')} style={{ marginTop: 2 }} />

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