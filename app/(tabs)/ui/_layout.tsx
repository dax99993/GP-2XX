import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
//import FontAwesomeIcon from '@expo/vector-icons/FontAwesomeIcon';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="preset"
        options={{
          title: 'Preset',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="musical-notes" color={color} />,
        }}
      />
      <Tabs.Screen
        name="edit"
        options={{
          title: 'Edit',
          tabBarIcon: ({ color }) => <Ionicons name="options" size={32} color={color} />
        }}
      />
      <Tabs.Screen
        name="testing"
        options={{
          title: 'Test',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="phone-portrait" color={color} />,
        }}
      />
    </Tabs>
  );
}
