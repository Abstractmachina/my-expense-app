import { ChevronLeft, Triangle } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { ThemedText } from "../styled-components/themed-text";
import { Button } from "../rnr/button";

type Props = {
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
};

const MonthPicker = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}: Props) => {
  const isCurrentMonth =
    selectedMonth === new Date().getMonth() &&
    selectedYear === new Date().getFullYear();

  function handleDecrease() {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  }

  function handleIncrease() {
    // if the month is the current month and the year is the current year, do nothing
    if (isCurrentMonth) {
      return;
    }
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  }

  return (
    <View className="flex flex-row items-center justify-between">
      <ThemedText className="text-primary-400 text-lg font-semibold">
        {months[selectedMonth]} {selectedYear}
      </ThemedText>
      <View className="flex flex-row items-center gap-2">
        <ArrowButton
          orientation="left"
          onPress={handleDecrease}
          accessibilityLabel="Previous month"
        />
        <ArrowButton
          orientation="right"
          onPress={handleIncrease}
          accessibilityLabel="Next month"
          disabled={isCurrentMonth}
        />
      </View>
    </View>
  );
};

export default MonthPicker;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type ArrowButtonProps = {
  orientation?: "left" | "right" | "up" | "down";
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
};
const ArrowButton = ({
  orientation,
  onPress,
  accessibilityLabel,
  disabled,
}: ArrowButtonProps) => {
  return (
    <Button
      className="rounded-full size-10 bg-primary-400 bg-opacity-75"
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
    >
      <View style={{ transform: [{ rotate: getRotation(orientation) }] }}>
				{/* <Triangle size={16} color="#3f3f46" fill="#3f3f46" /> */}
				<ChevronLeft size={16} />
      </View>
    </Button>
  );
};

function getRotation(orientation?: "left" | "right" | "up" | "down"): string {
  if (orientation === "left") return "-0deg";
  else if (orientation === "right") return "180deg";
  else if (orientation === "up") return "-90deg";
  else if (orientation === "down") return "-90deg";
  else return "-0deg";
}
