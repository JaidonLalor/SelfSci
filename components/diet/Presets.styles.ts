import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    content: {
        paddingTop: 80,
        paddingBottom: 120
    },
    foodRow: {
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 8,
        gap: 8,
    },
    nameCell: {
        fontSize: 16,
        width: 125,
        color: '#B4B4B4',
    },
    foodCell: {
        fontSize: 16,
        flex: 1,
        color: '#B4B4B4',
    },
    fatCell: {
        maxWidth: 25,
    },
    presetsContainer: {
        paddingTop: 12,
        paddingBottom: 12
    },
    spacer: {
        height: 120
    }
})