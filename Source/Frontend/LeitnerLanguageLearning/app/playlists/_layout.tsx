import { Stack } from 'expo-router'
import React from 'react'

export default function PlaylistsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'View Playlist',
          headerShown: false,
        }} 
      />
    </Stack>
  )
}