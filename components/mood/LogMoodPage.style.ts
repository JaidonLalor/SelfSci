import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    gap: 28
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  labelText: {
    fontSize: 18,
    color: '#666666'
  },
  noteContainer: {
    gap: 8
  },
  buttonMenu: {
    gap: 8,
  },
  saveButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  error: {
    color: 'red'
  }
})