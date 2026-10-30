import { ThemedText } from "@/components/styled-components/themed-text";
import { ThemedView } from "@/components/styled-components/themed-view";

type Props = {};

// shortcut: static placeholder values, wire these to the expenses query once the endpoint exists
const PANELS = [
  { label: "Total this month", value: "€0.00" },
  { label: "Daily average", value: "€0.00" },
  { label: "Top category", value: "—" },
  { label: "Expenses logged", value: "0" },
];

/**
 * Summary panels for the expenses overview. Each panel shows one figure.
 *
 * @returns The overview element.
 */
const Overview = (props: Props) => {
  return (
    <ThemedView className="flex-row flex-wrap gap-3">
      {PANELS.map(({ label, value }) => (
        <ThemedView
          key={label}
          type="backgroundElement"
          className="w-[47%] gap-1 rounded-2xl p-4"
        >
          <ThemedText type="small" themeColor="textSecondary">
            {label}
          </ThemedText>
          <ThemedText type="h2">{value}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
};

export default Overview;
