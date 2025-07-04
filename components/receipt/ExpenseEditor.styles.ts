import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    contextButtons: {
        flexDirection: 'row',
        gap: 8
    },
    deleteButton: {
        position: 'absolute',
        top: -120,
        left: 0,
        width: 72,
        height: 72,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D5D5D5',
        borderRadius: 18
    }
})