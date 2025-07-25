import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(102,102,102,0.66)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    popup: {
        width: 350,
        backgroundColor: '#D5D5D5',
        borderRadius: 18,
        padding: 20,
        display: 'flex',
        gap: 12,
        marginTop: '20%'
    },
    servingNoteLayout: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8
    },
    servingSizeContainer: {
        flex: 1
    },
    noteButtonContainer: {
        flex: 1,
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    noteInputContainer: {
        width: '100%',
        alignItems: 'flex-start'
    },
    noteInput: {
        width: '100%'
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
    label: {
        color: '#666666',
        marginBottom: 4,
        fontSize: 12
    },
    numberColumnContainer: {
        flexDirection: 'row',
        gap: 6
    },
    numberColumn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
    },
    numberColumnNumberContainer: {
        backgroundColor: '#B4B4B4',
        borderRadius: 10,
        alignSelf: 'stretch',
        paddingTop: 6,
        paddingBottom: 6,
        display: 'flex',
        alignItems: 'center'
    },
    numberColumnNumber: {
        color: '#666666',
        fontSize: 20
    },
    numberColumnNumberField: {
        backgroundColor: '#B4B4B4',
        borderRadius: 10,
        alignSelf: 'stretch',
        paddingTop: 6,
        paddingBottom: 6,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#666666',
        fontSize: 20
    },
    miniLabel: {
        fontSize: 12
    },
    numberContainers: {
        flexDirection: 'row'
    },
    deleteButtonContainer: {
        position: 'absolute',
        top: 0,
        right: 24
    },
    deleteButton: {
        width: 72,
        height: 72,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D5D5D5',
        borderRadius: 18
    },
    dropdown: {
        position: 'absolute',
        top: 54,
        width: '100%',
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 4,
        zIndex: 99, // ensure it's on top
        maxHeight: 136,
    },
    dropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    dropdownText: {
        fontSize: 16,
        color: '#666666'
    }
})