import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(102,102,102,0.66)'
    },
    sheet: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: '#D5D5D5',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 24,
    },
    container: {
        display: 'flex',
        gap: 24,
        paddingBottom: 24
    }
})