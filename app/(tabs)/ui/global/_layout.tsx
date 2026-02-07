import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  //const colorScheme = useColorScheme();
  
  return (
      <Stack>
        <Stack.Screen name="global_settings" options={{ headerShown: false }} />
      </Stack>
  );
}
