import { StyleSheet, Text, useColorScheme, View } from 'react-native'

import React from 'react'
import { Stack } from 'expo-router'
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { Query, QueryClientProvider, useQueryClient } from 'react-query'

const _layout = () => {
  // const queryClient = useQueryClient();

  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* <QueryClientProvider client={queryClient}> */}
        <Stack screenOptions={{ headerShown: false, }}>
          <Stack.Screen name="index" options={{headerShown: true,}}/>

          <Stack.Screen name="Homepage" options={{headerShown: true,}}/>


        </Stack>
      
      {/* </QueryClientProvider> */}
    </ThemeProvider>
  )
}

export default _layout

const styles = StyleSheet.create({})