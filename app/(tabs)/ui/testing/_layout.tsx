import { Stack } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <Stack>
        <Stack.Screen name="testlayout" options={{ headerShown: false }}/>
      </Stack>
  );
}
