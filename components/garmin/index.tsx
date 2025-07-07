import { useLocalSearchParams } from 'expo-router'
import Screen from "@/shared/Screen";
import { View, Text } from "react-native";
import { useExchangeGarminToken } from '@/lib/garmin/exchangeGarminToken';
import { useEffect } from 'react';
import { globalStyles } from '@/shared/globalStyles';
import Button from '@/shared/Button';

export default function Garmin() {
    const { code, state } = useLocalSearchParams()
    const singleCode = Array.isArray(code) ? code[0] : code
    const singleState = Array.isArray(state) ? state[0] : state

    const { exchange, loading, error, data } = useExchangeGarminToken()

    // If opens in mobile browser, redirect to app with params intact
    useEffect(() => {
        const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        if (isMobileDevice) {
            // Deep link to native app with params
            window.location.href = `selfsci://garmin?code=${singleCode}&state=${singleState}`
            return
        }
        return
    }, [code, state])

    // useEffect(() => {
    //     exchange()
    // }, [exchange])

    return (
        <Screen>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {error && <Text style={globalStyles.errorMessage}>{error}</Text>}
                <Text style={{ fontSize: 12}}>Code: {code}</Text>
                <Text style={{ fontSize: 12}}>State: {state}</Text>
                <Button onPress={() => exchange()} text='send test'/>
            </View>
        </Screen>
    )
}