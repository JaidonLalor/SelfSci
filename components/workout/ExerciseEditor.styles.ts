import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(102,102,102,0.66)'
    },
    popup: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        height: '42%',
        backgroundColor: '#D5D5D5',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 24,
        display: 'flex',
        gap: 24
    },
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        height: 40,
        width: 60,
        backgroundColor: '#B4B4B4',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    number: {
        fontSize: 34,
        color: '#666666'
    },
    label: {
        color: '#B4B4B4'
    },
    twoPointFive: {
        color: '#666666',
        fontSize: 18
    },
    errorMessage: {
        color: 'red',
        fontSize: 16
    },
    deleteButton: {
        position: 'absolute',
        top: -96,
        left: 24,
        width: 72,
        height: 72,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D5D5D5',
        borderRadius: 18
    }
})