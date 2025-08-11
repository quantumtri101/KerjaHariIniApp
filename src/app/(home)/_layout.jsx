import { View, Text } from 'react-native'
import React from 'react'
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
// import { Stack, Tabs } from 'expo-router'

import { COLORS, FONTS } from '../../constants'

export default function TabsLayout() {
  const tabBarOptions = {
    tabBarActiveTintColor: COLORS.tabBarActive,
    tabBarInactiveTintColor: COLORS.tabBarInactive,
    tabBarLabelStyle: {
      marginTop: -6,
      marginBottom: 4,
      fontFamily: FONTS.regular
    }
  }
  return (
    <Tabs
      initialRouteName='home'
      screenOptions={{
        headerShown: false,
        lazy: true,
        unmountOnBlur: true
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='home' color={color} size={24} />
          ),
          ...tabBarOptions
        }}

      />
      <Tabs.Screen
        name='(rekomendasi)/rekomendasi'
        options={{
          tabBarLabel: 'Rekomendasi',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name='check-square' color={color} size={22} />
          ),
          ...tabBarOptions
        }}
      />
      <Tabs.Screen
        name='listLamaran'
        options={{
          tabBarLabel: 'List Lamaran',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name='book' color={color} size={20} />
          ),
          ...tabBarOptions
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name='user-alt' color={color} size={20} />
          ),
          ...tabBarOptions
        }}
      />
      <Tabs.Screen
        name='(rekomendasi)/tawaranPekerjaan'
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name='(rekomendasi)/semuaPekerjaan'
        options={{
          href: null
        }}
      />
    </Tabs>
  )
}
