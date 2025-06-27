import { Stack } from 'expo-router';

export default function StackLayout() {
    return (
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="about" />
        <Stack.Screen name="ui" options={{ headerShown: false }} />
      </Stack>
    );
}