import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
//import FontAwesomeIcon from '@expo/vector-icons/FontAwesomeIcon';
import TabBarBackground from '@/components/ui/TabBarBackground';
import useOrientation from '@/hooks/useOrientation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Orientation } from 'expo-screen-orientation';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const orientation = useOrientation();

  const isLandscape = orientation == Orientation.LANDSCAPE_LEFT || orientation == Orientation.LANDSCAPE_RIGHT;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        // Change tab bar position based on orientation
        tabBarPosition: isLandscape ? 'right' : 'bottom',
        // tabBarLabelPosition: isLandscape ? 'below-icon' : 'beside-icon',
        tabBarLabelPosition: 'below-icon',
        tabBarVariant: isLandscape ? 'material' : 'uikit',
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
          href: null, //Maybe add this screen later
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
        name="testscreen"
        options={{
          href: null, //Remove when testing
          title: 'Test Screen',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="phone-portrait" color={color} />,
        }}
      />
    </Tabs>
  );
}
