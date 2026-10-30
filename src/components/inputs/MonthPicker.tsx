import { Triangle } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { ThemedText } from "../styled-components/themed-text";

type Props = {
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
};

const MonthPicker = ({selectedMonth, setSelectedMonth, selectedYear, setSelectedYear}: Props) => {
	const isCurrentMonth =
		selectedMonth === new Date().getMonth() && selectedYear === new Date().getFullYear();

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
		<View className="flex-row items-center">
			<Pressable onPress={handleDecrease} accessibilityRole="button" accessibilityLabel="Previous month">
				<View style={{ transform: [{ rotate: "-90deg" }] }}>
					<Triangle size={16} color="#3f3f46" fill="#3f3f46" />
				</View>
			</Pressable>
			<ThemedText className="w-40 text-center">
				{months[selectedMonth]} {selectedYear}
			</ThemedText>
			{/* The next arrow is hidden on the current month, so the user cannot go into the future. */}
			{!isCurrentMonth && (
				<Pressable onPress={handleIncrease} accessibilityRole="button" accessibilityLabel="Next month">
					<View style={{ transform: [{ rotate: "90deg" }] }}>
						<Triangle size={16} color="#3f3f46" fill="#3f3f46" />
					</View>
				</Pressable>
			)}
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
