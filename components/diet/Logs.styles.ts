import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    table: {
        marginTop: 100
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        paddingTop: 8,
        paddingBottom: 8,
    },
    textCell: {
        flex: 1,
        fontSize: 16,
        color: '#B4B4B4'
    },
    dateCell: {
        minWidth: 70,
    }
})