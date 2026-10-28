import { useState } from "react";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/styled-components/themed-text";
import { ThemedView } from "@/components/styled-components/themed-view";
import { cn } from "@/util/ui";
import ExpensesListView from "./_views/ListView";
import EditView from "./_views/EditView";
import PlusButton from "./_views/PlusButton";

type ExpensesTab = "list" | "new";

const TABS: { value: ExpensesTab; label: string }[] = [
  { value: "list", label: "List" },
  { value: "new", label: "New" },
];

/**
 * The Expenses screen: a title and two tabs, the monthly list and the new-expense form.
 *
 * @returns The screen element.
 */
export default function ExpensesScreen() {
  const [tab, setTab] = useState<ExpensesTab>("list");

  return (
    <ThemedView className="flex-1 gap-4 p-4">
      <ThemedText type="h1">Expenses</ThemedText>

      <ThemedView type="backgroundElement" className="flex-row rounded-2xl p-1">
        {TABS.map(({ value, label }) => {
          const selected = tab === value;
          return (
            <Pressable
              key={value}
              onPress={() => setTab(value)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              className={cn(
                "flex-1 items-center rounded-2xl py-2",
                selected && "bg-[rgba(127,127,127,0.25)]",
              )}
            >
              <ThemedText type="smallBold">{label}</ThemedText>
            </Pressable>
          );
        })}
      </ThemedView>

      {tab === "list" ? (
        <ExpensesListView />
      ) : (
        <EditView
          onSaved={() => setTab("list")}
          onClose={() => setTab("list")}
        />
      )}

      {tab === "list" && (
        <View pointerEvents="box-none" className="absolute inset-0">
          <PlusButton
            onPress={() => setTab("new")}
            className="absolute bottom-12 left-8 z-50"
          />
        </View>
      )}
    </ThemedView>
  );
}
