import { StyleSheet } from 'react-native'

export const colorVariants = StyleSheet.create({
  gray: {
    backgroundColor: '#B4B4B4',
    color: '#666666',
  },
  white: {
    backgroundColor: '#E3E3E3',
    color: '#B4B4B4',
  }
})

// BLUEPRINT lol the paddings get doubled bc applied to text and pressable

export const sizeVariants = StyleSheet.create({
  medium: {
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 8,
    fontSize: 18
  },
  small: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 8,
    fontSize: 18
  }
})

export const layoutVariants = StyleSheet.create({
    fill: {},
    fit: {
        alignSelf: 'flex-start'
    }
})