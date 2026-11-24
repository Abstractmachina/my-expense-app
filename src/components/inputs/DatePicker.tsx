import { useEffect, useState } from "react";
import { Modal, Platform, View } from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { Button } from "@/components/rnr/button";
import { Text } from "@/components/rnr/text";


type Props = {
  /** The selected date when the component is controlled */
  value?: Date | null;
  /** Callback fired when a date is selected */
  onChange?: (date: Date | null) => void;
  /** Whether the picker is open. Android opens its system dialog when this turns true */
  open: boolean;
  /** Callback fired when the picker should close */
  onClose: () => void;
}

/**
 * Native date picker, opened by the parent. Android shows the system dialog; iOS shows an inline calendar in a modal.
 *
 * @param {Props} props - `value` for controlled use, `onChange` for selections, `open`/`onClose` for visibility
 * @returns {JSX.Element | null} The modal on iOS, or null on Android (the system dialog renders itself)
 */
function DatePicker({ value, onChange, open, onClose }: Props) {
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

  // Open the Android system dialog when the parent requests it
  useEffect(() => {
    if (open && Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode: 'date',
        value: selected ?? new Date(),
        onValueChange: (_event, date) => {
          handleSelect(date);
          onClose();
        },
        onDismiss: onClose,
      });
    }
  }, [open]);

  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-zinc-800 p-4">
          <DateTimePicker
            mode="date"
            display="inline"
            value={selected ?? new Date()}
            onValueChange={(_event, date) => handleSelect(date)}
          />
          <Button variant="outline" onPress={onClose}>
            <Text>Done</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default DatePicker;
