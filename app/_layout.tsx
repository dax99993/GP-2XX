import DisconnectModal from "@/components/Modals/DisconnectModal";
import LoadPresetModal from "@/components/Modals/LoadPresetModal";
import SaveModal from "@/components/Modals/SaveModal";
import SyncModal from "@/components/Modals/SyncModal";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

//import { useColorScheme } from '@/hooks/useColorScheme';
//import { useColorScheme } from 'nativewind';

export default function RootLayout() {
  //const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }


  return (
    <GluestackUIProvider mode={"dark"}>
        <SyncModal/>
        <DisconnectModal/>
        <SaveModal/>
        <LoadPresetModal/>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      </GluestackUIProvider>
  );
}