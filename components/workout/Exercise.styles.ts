import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    daySection: {
        gap: 18,
        marginBottom: 16
    },
    dayTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    dayTitle: {
       color: '#B4B4B4',
       fontSize: 14
    },
    horizontalLine: {
        height: 1,
        backgroundColor: '#B4B4B4',
        flex: 1
    },
    numbersRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8
    },
    timeCell: {
        fontSize: 20,
        color: '#B4B4B4',
        flex: 1
    },
    numberCell: {
        minWidth: 72,
        fontSize: 20,
        color: '#B4B4B4',
    },
    numberText: {
        color: '#666666'
    },
    noteText: {
        fontSize: 16,
        color: '#9B9B9B',
        textAlign: 'right',
        marginTop: 6
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