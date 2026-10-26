import { fireEvent, render, screen } from '@testing-library/react-native';

import ExpensesScreen from '@/app/expenses';

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
  it('shows the Expenses title and the two tabs, with the list selected first', () => {
    render(<ExpensesScreen />);

    expect(screen.getByText('Expenses')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'List' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'New' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'List' }).props.accessibilityState.selected).toBe(true);
    expect(screen.getByText('list view')).toBeTruthy();
    expect(screen.queryByText('edit view')).toBeNull();
  });

  it('switches to the edit view when New is pressed and back to the list when saved', () => {
    render(<ExpensesScreen />);

    fireEvent.press(screen.getByRole('tab', { name: 'New' }));
    expect(screen.getByText('edit view')).toBeTruthy();
    expect(screen.queryByText('list view')).toBeNull();

    fireEvent.press(screen.getByText('save stub'));
    expect(screen.getByText('list view')).toBeTruthy();
  });
});
