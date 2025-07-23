import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerLink: {
        color: '#B4B4B4',
        textDecorationLine: 'underline',
        fontSize: 18
    },
    headerLinkRightCol: {
        gap: 8,
        alignItems: 'flex-end'
    },
    heroContainer: {
        height: 450,
        display: 'flex',
        justifyContent: 'center'
    },
    date: {
        color: '#B4B4B4',
        fontSize: 18
    },
    bigNumber: {
        color: '#666666',
        fontSize: 64
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 5
    },
    statColumn1: {
        color: '#B4B4B4',
        fontSize: 14,
        width: 55
    },
    statColumn2: {
        color: '#B4B4B4',
        fontSize: 14,
        width: 80
    },
    entriesContainer: {
        marginBottom: 120,
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
    },
})