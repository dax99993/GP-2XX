import { Stack } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <Stack>
        <Stack.Screen name="effecttab" options={{ headerShown: false }} />
        <Stack.Screen name="select_effect" options={{ headerShown: false }} />
      </Stack>
  );
}
