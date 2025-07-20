import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    scrollView: {
        paddingTop: 80
    },
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
    darkHeaderLink: {
        color: '#666666',
        textDecorationLine: 'underline',
        fontSize: 18
    },
    headerLinkRightCol: {
        gap: 8,
        alignItems: 'flex-end'
    },
    hero: {
        gap: 10
    },
    date: {
        color: '#B4B4B4',
        fontSize: 18
    },
    titleInput: {
        backgroundColor: 'transparent',
        fontSize: 28,
        lineHeight: 36,
        padding: 0,
        paddingVertical: 0,
        paddingHorizontal: 0,
        textAlignVertical: 'top',
        color: '#666666',
        marginBottom: 8
    },
    horizontalLine: {
        height: 1,
        width: '100%',
        backgroundColor: '#B4B4B4'
    },
    saveButton: {
        paddingVertical: 16,
    },
    markdownInput: {
        marginTop: 24,
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 0,
        padding: 0,
        paddingVertical: 0,
        paddingHorizontal: 0,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 24,
        color: '#666666',
        marginBottom: 80
    }
})