import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Platform } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import DatePicker from '@/components/inputs/DatePicker';

// rn-primitives ships untransformed ES modules that Jest cannot load, so Slot is stubbed as a pass-through.
jest.mock('@rn-primitives/slot', () => ({ Slot: ({ children }: { children: React.ReactNode }) => children }));

// The native picker only exists on device, so it is replaced with a mock.
jest.mock('@react-native-community/datetimepicker', () => ({
  __esModule: true,
  default: jest.fn(() => null),
  DateTimePickerAndroid: { open: jest.fn() },
}));

const nativeEvent = { nativeEvent: { timestamp: 0, utcOffset: 0 } };
const picked = new Date(2026, 9, 3);

/**
 * Returns the props from the last render of the mocked iOS picker.
 *
 * @returns {Record<string, any>} Props passed to the native picker
 */
const lastPickerProps = () => {
  const calls = (DateTimePicker as unknown as jest.Mock).mock.calls;
  return calls[calls.length - 1][0];
};

describe('DatePicker', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('on iOS', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'ios');
    });

    it('renders the inline calendar and reports the picked date', async () => {
      const onChange = jest.fn();
      await render(<DatePicker value={null} onChange={onChange} />);

      expect(lastPickerProps()).toMatchObject({ mode: 'date', display: 'inline' });

      await act(async () => lastPickerProps().onValueChange(nativeEvent, picked));
      expect(onChange).toHaveBeenCalledWith(picked);
    });
  });

  describe('on Android', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'android');
    });

    it('opens the system dialog from a button', async () => {
      await render(<DatePicker value={null} />);

      await fireEvent.press(screen.getByText('Pick a date'));
      expect(DateTimePickerAndroid.open).toHaveBeenCalledWith(
        expect.objectContaining({ mode: 'date' }),
      );
    });

    it('shows the date the user picked in the dialog', async () => {
      await render(<DatePicker />);

      await fireEvent.press(screen.getByText('Pick a date'));
      const { onValueChange } = (DateTimePickerAndroid.open as jest.Mock).mock.calls[0][0];
      await act(async () => onValueChange(nativeEvent, picked));

      expect(screen.getByText(picked.toLocaleDateString())).toBeTruthy();
    });

    it('shows the controlled value without a local state change', async () => {
      await render(<DatePicker value={picked} />);

      expect(screen.getByText(picked.toLocaleDateString())).toBeTruthy();
    });
  });
});
