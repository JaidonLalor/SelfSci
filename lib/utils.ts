export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error'
}

import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const isWeb = Platform.OS === 'web'

export const setItem = async (key: string, value: string) => {
  if (isWeb) {
    localStorage.setItem(key, value)
  } else {
    await SecureStore.setItemAsync(key, value)
  }
}

export const getItem = async (key: string): Promise<string | null> => {
  if (isWeb) {
    return localStorage.getItem(key)
  } else {
    return await SecureStore.getItemAsync(key)
  }
}

export const removeItem = async (key: string) => {
  if (isWeb) {
    localStorage.removeItem(key)
  } else {
    await SecureStore.deleteItemAsync(key)
  }
}