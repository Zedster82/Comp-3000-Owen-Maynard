import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useState } from "react";
import { Tabs } from "expo-router";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { PlaylistsProvider } from "@/hooks/usePlaylists";
import { Stack } from "expo-router";

import {
  Query,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "react-query";

const _layout = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });

  const colorScheme = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <PlaylistsProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Tabs
            screenOptions={{
              tabBarShowLabel: true,
              tabBarButton: undefined,
              tabBarActiveTintColor:
                colorScheme === "dark" ? "#FFFFFF" : "#0066CC",
              tabBarInactiveTintColor:
                colorScheme === "dark" ? "#888888" : "#888888",
              tabBarStyle: {
                backgroundColor: colorScheme === "dark" ? "#121212" : "#FFFFFF",
                height: 60,
              },
            }}
          >
            <Tabs.Screen
              name="Homepage"
              options={{
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
              }}
            />
            {/* <Tabs.Screen
          name="Homepage"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        /> */}
            <Tabs.Screen
              name="Playlists"
              options={{
                title: "Playlists",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="list" size={size} color={color} />
                ),
              }}
            />

            <Tabs.Screen
              // or any other route
              name="Flashcards"
              options={{
                title: "Flashcards",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="card" size={size} color={color} />
                ),
              }}
            />

            <Tabs.Screen
              name="index" // or any other route
              options={{
                href: null, // This prevents it from showing in the tab bar
                tabBarStyle: { display: "none" }, //Hide the tab bar for this screen
                headerShown: false, // Hide the header
              }}
            />

            <Tabs.Screen
              name="(auth)/Login" // or any other route
              options={{
                href: null, // This prevents it from showing in the tab bar
                tabBarStyle: { display: "none" }, //Hide the tab bar for this screen
                headerShown: false, // Hide the header
              }}
            />
            <Tabs.Screen
              name="(auth)/Register" // or any other route
              options={{
                href: null, // This prevents it from showing in the tab bar
                tabBarStyle: { display: "none" }, //Hide the tab bar for this screen
                headerShown: false, // Hide the header
              }}
            />
            <Tabs.Screen
              name="playlists" // or any other route
              options={{
                href: null, // This prevents it from showing in the tab bar
              }}
            />
            <Tabs.Screen
              name="playlists/[id]" // or any other route
              options={{
                href: null, // This prevents it from showing in the tab bar
                tabBarStyle: { display: "none" }, //Hide the tab bar for this screen
                headerShown: false, // Hide the header
              }}
            />
          </Tabs>
        </ThemeProvider>
      </PlaylistsProvider>
    </QueryClientProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({});
