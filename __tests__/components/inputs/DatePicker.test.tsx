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

    it('shows the inline calendar in a modal while open and reports the picked date', async () => {
      const onChange = jest.fn();
      const onClose = jest.fn();
      await render(<DatePicker value={null} onChange={onChange} open onClose={onClose} />);

      expect(lastPickerProps()).toMatchObject({ mode: 'date', display: 'inline' });

      await act(async () => lastPickerProps().onValueChange(nativeEvent, picked));
      expect(onChange).toHaveBeenCalledWith(picked);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('closes when Done is pressed', async () => {
      const onClose = jest.fn();
      await render(<DatePicker value={null} open onClose={onClose} />);

      await fireEvent.press(screen.getByText('Done'));
      expect(onClose).toHaveBeenCalled();
    });

    it('uses its own state when uncontrolled', async () => {
      await render(<DatePicker open onClose={jest.fn()} />);

      await act(async () => lastPickerProps().onValueChange(nativeEvent, picked));
      expect(lastPickerProps().value).toEqual(picked);
    });
  });

  describe('on Android', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'android');
    });

    it('does not open the system dialog while closed', async () => {
      await render(<DatePicker value={null} open={false} onClose={jest.fn()} />);

      expect(DateTimePickerAndroid.open).not.toHaveBeenCalled();
    });

    it('opens the system dialog when opened', async () => {
      await render(<DatePicker value={null} open onClose={jest.fn()} />);

      expect(DateTimePickerAndroid.open).toHaveBeenCalledWith(
        expect.objectContaining({ mode: 'date' }),
      );
    });

    it('reports the picked date and closes', async () => {
      const onChange = jest.fn();
      const onClose = jest.fn();
      await render(<DatePicker value={null} onChange={onChange} open onClose={onClose} />);

      const { onValueChange } = (DateTimePickerAndroid.open as jest.Mock).mock.calls[0][0];
      await act(async () => onValueChange(nativeEvent, picked));

      expect(onChange).toHaveBeenCalledWith(picked);
      expect(onClose).toHaveBeenCalled();
    });

    it('closes when the dialog is dismissed', async () => {
      const onClose = jest.fn();
      await render(<DatePicker value={null} open onClose={onClose} />);

      const { onDismiss } = (DateTimePickerAndroid.open as jest.Mock).mock.calls[0][0];
      await act(async () => onDismiss());

      expect(onClose).toHaveBeenCalled();
    });
  });
});
