import { Stack } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <Stack>
        <Stack.Screen name="screen1" options={{ headerShown: false }}/>
      </Stack>
  );
}
