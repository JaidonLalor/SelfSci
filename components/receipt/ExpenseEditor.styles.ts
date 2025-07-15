import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    additionsContainer: {
        flexDirection: 'row',
        gap: 8
    },
    contextButtons: {
        flexDirection: 'row',
        gap: 8
    },
    dateContainer: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between'
    },
    dateInputs: {
        flexDirection: 'row',
        gap: 8,
    },
    yearInput: {
        width: 60
    },
    monthInput: {
        width: 45
    },
    dayInput: {
        width: 40
    },
    noteContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    noteInput: {
        flex: 1
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