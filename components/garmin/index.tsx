import { useLocalSearchParams, useRouter } from 'expo-router'
import Screen from "@/shared/Screen";
import { View, Text } from "react-native";
import { useExchangeGarminToken } from '@/lib/garmin/exchangeGarminToken';
import { useEffect, useState } from 'react';
import { globalStyles } from '@/shared/globalStyles';
import Button from '@/shared/Button';
import TextInput from '@/shared/TextInput';
import { removeItem } from '@/lib/utils';
import Constants from 'expo-constants'

export default function Garmin() {
    const { code, state } = useLocalSearchParams()
    const singleCode = Array.isArray(code) ? code[0] : code
    const singleState = Array.isArray(state) ? state[0] : state
    const router = useRouter()

    const isInExpoGo = Constants.executionEnvironment === 'storeClient'
    const [devState, setDevState] = useState<string>('')
    const [devCode, setDevCode] = useState<string>('')

    const { exchange, loading, error, data } = useExchangeGarminToken()

    // If opens in mobile browser, redirect to app with params intact
    useEffect(() => {
        const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        const isSelfSciApp = window.location.protocol === 'selfsci:'
        if (isMobileDevice && !isSelfSciApp) {
            // Deep link to native app with params
            window.location.href = `selfsci://garmin?code=${singleCode}&state=${singleState}`
            return
        }

        if (isInExpoGo) return

        // ✅ At this point, you're either:
        // - in a desktop browser (run normally)
        // - in the app itself via deep link (run normally)
        // So it's safe to exchange the token now
        exchange({ state: singleState, code: singleCode }).catch(console.error)
        return
    }, [code, state])

    useEffect(() => {
        if (data) router.push('/settings')
    }, [data])

    return (
        <Screen>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {error && (
                    <View>
                        <Text style={globalStyles.errorMessage}>{error}</Text>
                        <Button text='go back' onPress={() => router.back()}/>
                    </View>
                )}

                {loading && <Text style={{ color: '#B4B4B4', fontSize: 36 }}>Loading...</Text>}

                {data && <Text style={{ color: '#B4B4B4', fontSize: 36 }}>Success!</Text>}

                {isInExpoGo && <Text>Expo Go detected. Redirect later.</Text>}

                {/* {isInExpoGo && (
                    <View style={{ gap: 8 }}>
                        <Text>Detected to be running in Expo Go.</Text>
                        <Text>Redirects out of a browser popup are not possible in Expo Go. Try again on a desktop web browser, to copy the "code" and "state" variables from the console log.</Text>
                        <Text>Then use the dev shortcut in settings to enter them on this page (the /garmin page).</Text>
                        <TextInput
                            value={devState}
                            onChangeText={setDevState}
                            placeholder='state'
                        />
                        <TextInput
                            value={devCode}
                            onChangeText={setDevCode}
                            placeholder='code'
                        />
                        <Button onPress={() => exchange({ code: devCode, state: devState })} text='submit'/>
                        <Button onPress={() => router.back()} color='ghost' text='back'/>
                        <Button onPress={async () => {
                                await removeItem('garmin_code_verifier')
                                await removeItem('garmin_oauth_state')
                            }
                        } color='ghost' text='reset'/>
                    </View>
                )} */}
            </View>
        </Screen>
    )
}