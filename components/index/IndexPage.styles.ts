import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#D5D5D5',
    paddingLeft: 36,
    paddingRight: 36
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tracker: {
    fontSize: 36,
    color: '#B4B4B4'
  },
  date: {
    fontSize: 16,
    color: '#B4B4B4',
    marginBottom: 2
  },
  settings: {
    fontSize: 18,
    color: '#B4B4B4',
    textDecorationLine: 'underline'
  }
})