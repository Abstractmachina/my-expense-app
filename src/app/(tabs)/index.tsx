import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/styled-components/themed-text";
import { ThemedView } from "@/components/styled-components/themed-view";
import Overview from "@/components/screens/Overview";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store"

export default function HomeScreen() {

  const [name, setName] = useState<string | null>(null);

useEffect(() => {
  SecureStore.getItemAsync("user_name").then(setName);
}, []);
  
  
  return (
    <ThemedView className="">
      {/* Bottom padding clears the tab bar: BottomTabInset (50 iOS / 80 Android) + Spacing.three (16). */}
      <SafeAreaView className="gap-4 px-6">
        <ThemedView>
          <ThemedText type="h1">Overview</ThemedText>
          <ThemedText>Hi, {name}</ThemedText>

        </ThemedView>
        <Overview />

      </SafeAreaView>
    </ThemedView>
  );
}
