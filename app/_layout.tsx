import DisconnectModal from "@/components/Modals/DisconnectModal";
import ExportPresetsModal from "@/components/Modals/ExportPresetsModal";
import ImportPresetModal from "@/components/Modals/ImportPresetModal";
import SaveModal from "@/components/Modals/SaveModal";
import SyncModal from "@/components/Modals/SyncModal";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { StoreContext } from "@/hooks/useStore";
import { Store } from "@/models/store";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import 'react-native-reanimated';

//import { useColorScheme } from '@/hooks/useColorScheme';
//import { useColorScheme } from 'nativewind';

export default function RootLayout() {
  // Create store
  const [store] = useState(() => new Store());

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
      <StoreContext.Provider value={{store}}>
        <SyncModal />
        <DisconnectModal />
        <SaveModal />
        <ImportPresetModal />
        <ExportPresetsModal />
        <ThemeProvider value={DarkTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </StoreContext.Provider>
    </GluestackUIProvider>
  );
}