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
    color: '#B4B4B4'
  },
  menu: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  pressable: {
    paddingTop: 8,
    paddingBottom: 8,
    alignSelf: 'flex-start'
  },
  pressableText: {
    fontSize: 24,
    color: '#666666'
  },
  pressableTextDisabled: {
    fontSize: 24,
    color: '#B4B4B4'
  }
})