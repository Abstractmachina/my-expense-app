import MonthPicker from "@/components/MonthPicker";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

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
				<View className="flex gap-2">
					<Link href="/admin/globals/budget"><Text>Budget</Text></Link>
					<Link href="/admin/collections/income"><Text>Income</Text></Link>
				</View>
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
