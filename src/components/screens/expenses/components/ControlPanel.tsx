import MonthPicker from "@/components/inputs/MonthPicker";
import { View } from "react-native";

type Props = {
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
};

const ControlPanel = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}: Props) => {
  return (
    <View className="flex flex-col items-center gap-2 justify-center py-4">
      <MonthPicker
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
    </View>
  );
};

export default ControlPanel;
