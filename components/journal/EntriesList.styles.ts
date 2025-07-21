import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    content: {
        paddingTop: 80,
        paddingBottom: 120
    },
    monthHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    monthTitle: {
        color: '#B4B4B4',
        fontSize: 14
    },
    horizontalLine: {
        height: 1,
        backgroundColor: '#B4B4B4',
        flex: 1
    },
    monthEntriesContainer: {
        paddingTop: 12,
        paddingBottom: 12
    },
    entryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 8,
        paddingTop: 8
    },
    entryTitle: {
        fontSize: 24,
        color: '#666666'
    },
    entryDate: {
        color: '#B4B4B4'
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 48,
        left: 0,
        right: 0,
        height: 82,
        display: 'flex',
        alignItems: 'center'
    },
    addButton: {
        width: 82,
        height: 82,
        borderRadius: 18,
        backgroundColor: '#E3E3E3',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})