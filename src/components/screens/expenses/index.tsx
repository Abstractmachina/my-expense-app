import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/styled-components/themed-text";
import { ThemedView } from "@/components/styled-components/themed-view";
import { cn } from "@/util/ui";
import ExpensesListView from "./_views/ListView";
import PlusButton from "./_views/PlusButton";

type ExpensesTab = "date" | "category" | "batch";

const TABS: { value: ExpensesTab; label: string }[] = [
  { value: "date", label: "By Date" },
  { value: "category", label: "By Category" },
  { value: "batch", label: "Batch Operations" },
];

/**
 * The Expenses screen: 3 tabs: date, category, batch operations
 * Add button brings the user to the edit expense screen
 *
 * @returns The screen element.
 */
export default function ExpensesScreen() {
  const router = useRouter();
  // const [tab, setTab] = useState<ExpensesTab>("date");

  return (
    <ThemedView className="flex-1 gap-4 p-4">

      <ExpensesListView />
      
      <View pointerEvents="box-none" className="absolute inset-0">
        <PlusButton
          onPress={() => router.push({ pathname: "/edit-expense/[[...id]]" })}
          className="absolute bottom-12 left-8 z-50"
        />
      </View>
    </ThemedView>
  );
}
