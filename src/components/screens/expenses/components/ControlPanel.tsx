import MonthPicker from "@/components/inputs/MonthPicker";
import Card from "@/components/layout/card";
import { ThemedText } from "@/components/styled-components/themed-text";
import { formatCurrency } from "@/util/currency/format-currency";
import { View } from "react-native";

type Props = {
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  monthlyTotal?: number;
};

const ControlPanel = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  monthlyTotal,
}: Props) => {
  return (
    <Card className="flex flex-col gap-4 py-4 bg-primary-400/10 border border-primary-400/25">
      <MonthPicker
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <View>
        <ThemedText className="text-primary-400 text-sm">Monthly Total</ThemedText>
        <ThemedText type="h2" className="text-primary-400 text-[4rem] font-bold tracking-tighter">
          {formatCurrency(monthlyTotal || 0)}
        </ThemedText>
      </View>
    </Card>
  );
};

export default ControlPanel;
