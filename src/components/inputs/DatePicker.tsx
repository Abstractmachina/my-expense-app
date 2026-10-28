import { useState } from "react";
import { Platform } from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { Button } from "@/components/rnr/button";
import { Text } from "@/components/rnr/text";


type Props = {
  /** The selected date when the component is controlled */
  value?: Date | null;
  /** Callback fired when a date is selected */
  onChange?: (date: Date | null) => void;
}

/**
 * Native date picker: an inline calendar on iOS, a system dialog opened by a button on Android.
 *
 * @param {Props} props - `value` for controlled use, `onChange` for selections
 * @returns {JSX.Element} The date picker for the current platform
 */
function DatePicker({value, onChange } : Props) {
  const [internalDate, setInternalDate] = useState<Date | null>(null);

  // If `value` is passed, the component is controlled by the parent
  const isControlled = value !== undefined;

  // Use the prop if controlled, otherwise use the internal state
  const selected = isControlled ? value : internalDate;

  /**
   * Handles a date chosen in the native picker. Dismissals never reach this.
   *
   * @param {Date} date - The chosen date
   * @returns {void}
   */
  const handleSelect = (date: Date) => {
    // Only update internal state if we aren't being controlled by a parent
    if (!isControlled) {
      setInternalDate(date);
    }
    // Always fire the onChange callback if the parent provided one
    onChange?.(date);
  };

  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        mode="date"
        display="inline"
        value={selected ?? new Date()}
        onValueChange={(_event, date) => handleSelect(date)}
      />
    );
  }

  return (
    <Button
      variant="outline"
      onPress={() =>
        DateTimePickerAndroid.open({
          mode: 'date',
          value: selected ?? new Date(),
          onValueChange: (_event, date) => handleSelect(date),
        })
      }
    >
      <Text>{selected ? selected.toLocaleDateString() : 'Pick a date'}</Text>
    </Button>
  );
};

export default DatePicker;
