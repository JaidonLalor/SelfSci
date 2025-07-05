import { Redirect } from 'expo-router'
import { Platform } from 'react-native'
import LandingPage from '@/components/landing'

export default function Index() {
    if (Platform.OS !== 'web') return <Redirect href='/dashboard' />
    return <LandingPage/>
}