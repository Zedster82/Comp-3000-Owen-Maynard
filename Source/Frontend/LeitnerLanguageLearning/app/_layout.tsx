import { StyleSheet, Text, useColorScheme, View } from 'react-native'

import React from 'react'
import { Stack } from 'expo-router'
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native'

const _layout = () => {


  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false, }}>
        <Stack.Screen name="index" options={{headerShown: true,}}/>

        <Stack.Screen name="Homepage" options={{headerShown: true,}}/>


      </Stack>
    </ThemeProvider>
  )
}

export default _layout

const styles = StyleSheet.create({})