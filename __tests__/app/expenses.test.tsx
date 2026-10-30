import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import ExpensesScreen from '@/app/(tabs)/expenses';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// lucide-react-native ships ES modules that Jest cannot load, so the icon is stubbed.
jest.mock('lucide-react-native', () => ({ Plus: () => null, Triangle: () => null }));
// rn-primitives ships untransformed ES modules that Jest cannot load, so Slot is stubbed as a pass-through.
jest.mock('@rn-primitives/slot', () => ({ Slot: ({ children }: { children: React.ReactNode }) => children }));

// The theme imports global.css, which Jest cannot parse, so the themed components are stubbed.
jest.mock('@/components/styled-components/themed-text', () => ({
  ThemedText: ({ children }: { children: React.ReactNode }) => {
    const { Text: MockText } = jest.requireActual('react-native');
    return <MockText>{children}</MockText>;
  },
}));

jest.mock('@/components/styled-components/themed-view', () => ({
  ThemedView: ({ children, style }: { children: React.ReactNode; style?: object }) => {
    const { View: MockView } = jest.requireActual('react-native');
    return <MockView style={style}>{children}</MockView>;
  },
}));

// The list view pulls in the table and its dependencies, so it is stubbed.
jest.mock('@/components/screens/expenses/_views/ListView', () => ({
  __esModule: true,
  default: () => {
    const { Text: MockText } = jest.requireActual('react-native');
    return <MockText>list view</MockText>;
  },
}));

describe('ExpensesScreen', () => {
  const router = { push: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useRouter).mockReturnValue(router as never);
  });

  it('shows the Expenses title and the three tabs, with By Date selected first', async () => {
    await render(<ExpensesScreen />);

    expect(screen.getByText('Expenses')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'By Date' }).props.accessibilityState.selected).toBe(true);
    expect(screen.getByRole('tab', { name: 'By Category' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Batch Operations' })).toBeTruthy();
    expect(screen.getByText('list view')).toBeTruthy();
  });

  it('opens the expense route with no id when the add button is pressed', async () => {
    await render(<ExpensesScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Add expense' }));

    expect(router.push).toHaveBeenCalledWith({ pathname: '/edit-expense/[[...id]]' });
  });

  it('shows no edit form on the other tabs', async () => {
    await render(<ExpensesScreen />);

    await fireEvent.press(screen.getByRole('tab', { name: 'By Category' }));

    expect(screen.queryByText('list view')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Add expense' })).toBeNull();
  });
});
