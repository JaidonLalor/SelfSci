import { StyleSheet } from 'react-native'

export const globalStyles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#D5D5D5',
        paddingLeft: 36,
        paddingRight: 36
    },
    content: {
        position: 'relative',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
    },
    scrollView: {
        paddingTop: 80,
        paddingBottom: 120
    },
    spacer: {
        height: 120
    },
    textMenuPressable: {
        paddingTop: 8,
        paddingBottom: 8,
        alignSelf: 'flex-start'
    },
    textMenuText: {
        fontSize: 24,
        color: '#666666'
    },
    textMenuTextDisabled: {
        fontSize: 24,
        color: '#B4B4B4'
    }
})