import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    content: {
        position: 'relative',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        gap: 28,
    },
    stateMessage: {
        color: '#B4B4B4',
        fontSize: 24,
    },
    addExerciseButton: {
        position: 'absolute',
        right: 0,
        bottom: 24
    }
})