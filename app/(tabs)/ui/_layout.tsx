import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';

import { HapticTab } from '@/components/core/HapticTab';
//import FontAwesomeIcon from '@expo/vector-icons/FontAwesomeIcon';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import useOrientation from '@/hooks/useOrientation';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {orientation, isLandscape} = useOrientation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        // Change tab bar position based on orientation
        tabBarPosition: isLandscape ? 'right' : 'bottom',
        tabBarVariant: isLandscape ? 'material' : 'uikit',
        tabBarLabelPosition: 'below-icon',
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
        name="live"
        options={{
          // href: null, //Maybe add this screen later
          title: 'Live',
          tabBarIcon: ({ color }) => <Ionicons name="pulse" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="edit"
        options={{
          //href: null, //Maybe add this screen later
          title: 'Edit',
          tabBarIcon: ({ color }) => <Ionicons name="options" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="global"
        options={{
          //href: null, //Maybe add this screen later
          title: 'Global',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          href: null, //Remove when testing
          title: 'Test Screen',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="phone-portrait" color={color} />,
        }}
      />
    </Tabs>
  );
}
