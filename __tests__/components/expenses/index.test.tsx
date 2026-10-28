import { fireEvent, render, screen } from '@testing-library/react-native';

import ExpensesScreen from '@/components/expenses';

// lucide-react-native ships ES modules that Jest cannot load, so the icon is stubbed.
jest.mock('lucide-react-native', () => ({ Plus: () => null, Triangle: () => null }));
// rn-primitives ships untransformed ES modules that Jest cannot load, so Slot is stubbed as a pass-through.
jest.mock('@rn-primitives/slot', () => ({ Slot: ({ children }: { children: React.ReactNode }) => children }));

// The theme imports global.css, which Jest cannot parse, so the theme and themed components are stubbed.
jest.mock('@/constants/theme', () => ({
  Spacing: { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64 },
}));

jest.mock('@/components/themed-text', () => ({
  ThemedText: ({ children }: { children: React.ReactNode }) => {
    const { Text: MockText } = jest.requireActual('react-native');
    return <MockText>{children}</MockText>;
  },
}));

jest.mock('@/components/themed-view', () => ({
  ThemedView: ({ children, style }: { children: React.ReactNode; style?: object }) => {
    const { View: MockView } = jest.requireActual('react-native');
    return <MockView style={style}>{children}</MockView>;
  },
}));

// The views import shadcn and other modules that are not in the project yet, so they are stubbed here.
jest.mock('@/components/expenses/_views/ListView', () => ({
  __esModule: true,
  default: () => {
    const { Text: MockText } = jest.requireActual('react-native');
    return <MockText>list view</MockText>;
  },
}));

jest.mock('@/components/expenses/_views/EditView', () => ({
  __esModule: true,
  default: (props: { onSaved?: () => void; onClose?: () => void }) => {
    const { Text: MockText, Pressable: MockPressable } = jest.requireActual('react-native');
    return (
      <>
        <MockText>edit view</MockText>
        <MockPressable onPress={props.onSaved}>
          <MockText>save stub</MockText>
        </MockPressable>
      </>
    );
  },
}));

describe('ExpensesScreen', () => {
  it('shows the Expenses title and the two tabs, with the list selected first', async () => {
    await render(<ExpensesScreen />);

    expect(screen.getByText('Expenses')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'List' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'New' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'List' }).props.accessibilityState.selected).toBe(true);
    expect(screen.getByText('list view')).toBeTruthy();
    expect(screen.queryByText('edit view')).toBeNull();
  });

  it('switches to the edit view when New is pressed and back to the list when saved', async () => {
    await render(<ExpensesScreen />);

    await fireEvent.press(screen.getByRole('tab', { name: 'New' }));
    expect(screen.getByText('edit view')).toBeTruthy();
    expect(screen.queryByText('list view')).toBeNull();

    await fireEvent.press(screen.getByText('save stub'));
    expect(screen.getByText('list view')).toBeTruthy();
  });

  it('opens the new-expense form when the add button is pressed', async () => {
    await render(<ExpensesScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Add expense' }));
    expect(screen.getByText('edit view')).toBeTruthy();
  });
});
