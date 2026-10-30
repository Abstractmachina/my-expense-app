import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ExpensesListController from "./components/ExpensesListController";
import PlusButton from "./components/PlusButton";

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
    <SafeAreaView className="flex-1 gap-4 p-4">
      <ExpensesListController />

      <View pointerEvents="box-none" className="absolute inset-0">
        <PlusButton
          onPress={() => router.push({ pathname: "/edit-expense/[[...id]]" })}
          className="absolute bottom-12 left-8 z-50"
        />
      </View>
    </SafeAreaView>
  );
}
