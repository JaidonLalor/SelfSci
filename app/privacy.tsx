import { Redirect } from 'expo-router'
import { Platform } from 'react-native'
import Privacy from '@/components/privacy'

export default function Index() {
    if (Platform.OS !== 'web') return <Redirect href='/dashboard' />
    return <Privacy/>
}