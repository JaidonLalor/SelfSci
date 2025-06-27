import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#D5D5D5',
    paddingLeft: 36,
    paddingRight: 36
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 36,
    color: '#B4B4B4'
  },
  back: {
    color: '#B4B4B4',
    textDecorationLine: 'underline'
  },
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
  slider: {
    flex: 1,
    flexShrink: 1
  },
  sliderText: {
    fontSize: 18,
    color: '#666666'
  },
  buttonMenu: {
    gap: 8
  },
  saveButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  error: {
    color: 'red'
  }
})