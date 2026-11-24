import DatePicker from "@/components/inputs/DatePicker";
import { ThemedText } from "@/components/styled-components/themed-text";
import { cn } from "@/util/ui";
import { useContext, useMemo, useState } from "react";
import { Pressable } from "react-native";
import { EditViewContext } from "./EditViewContext";

type Props = {};

const DatePanel = (props: Props) => {
  const ctx = useContext(EditViewContext);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  function handleOnDateChange(date: Date | null) {
    ctx?.setSelectedDate(date);
  }

  const processedDate = useMemo<Date | null>(() => {
    return ctx?.selectedDate ? new Date(ctx.selectedDate) : null;
  }, [ctx?.selectedDate]);

  return (
    <>
      <Pressable
        onPress={() => setIsPickerOpen(true)}
        className={cn(
          "bg-zinc-800 w-full border-none px-8 py-4 m-0 text-xl font-bold",
          "flex flex-row justify-between items-center",
        )}
        accessibilityRole="button"
      >
        <ThemedText type="h2">Date</ThemedText>
        <ThemedText type="description" numberOfLines={1}>
          {processedDate?.toLocaleDateString() || ""}
        </ThemedText>
      </Pressable>
      <DatePicker
        value={ctx?.selectedDate}
        onChange={handleOnDateChange}
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
      />
    </>
  );
};

export default DatePanel;
