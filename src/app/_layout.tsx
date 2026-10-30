import {
  DarkTheme,
  DefaultTheme, // <-- Added
  Slot,
  Stack,
  ThemeProvider,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ApiKeySavedContext } from "@/auth/api-key-context";
import { AnimatedSplashOverlay } from "@/components/animated/animated-icon";
import { PortalHost } from "@rn-primitives/portal";

import "@/global.css";

SplashScreen.preventAutoHideAsync();

// One client for the whole app, so every screen's queries share the same cache.
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState(); // <-- Added to check if router is awake

  // 1. Check for the API key when the app boots
  useEffect(() => {
    async function checkApiKey() {
      try {
        const key = await SecureStore.getItemAsync("payload_api_key");
        setHasKey(!!key);
      } catch (error) {
        setHasKey(false);
      } finally {
        setIsReady(true);
      }
    }
    checkApiKey();
  }, []);

  // 2. Redirect the user based on their state
  useEffect(() => {
    // Wait until our store check is done AND the router is fully mounted
    if (!isReady || !navigationState?.key) return;

    const inSetupScreen = segments[0] === "setup";

    if (!hasKey && !inSetupScreen) {
      router.replace("/setup");
    } else if (hasKey && inSetupScreen) {
      router.replace("/");
    } else {
      // If we don't need to redirect, hide the native splash screen!
      SplashScreen.hideAsync();
    }
  }, [hasKey, isReady, segments, navigationState?.key]);

  // Show a loading spinner while we check the SecureStore
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Conditionally render the Setup screen OR the App Tabs based on auth state
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <ApiKeySavedContext.Provider value={() => setHasKey(true)}>
          {hasKey ? (
            // The tab group and the add/edit route both live in this stack, so the route is reachable from the tabs.
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="edit-expense/[[...id]]" options={{ presentation: "modal" }} />
            </Stack>
          ) : (
            <Slot />
          )}
        </ApiKeySavedContext.Provider>
        <PortalHost />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
