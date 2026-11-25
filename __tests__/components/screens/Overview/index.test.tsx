import { render, screen } from '@testing-library/react-native';

import Overview from '@/components/screens/Overview';
import { useExpensesQuery } from '@/lib/queries/expensesQueries';
import type { Expense } from '@/payload-types';

// The theme imports global.css, which Jest cannot parse, so the themed components are stubbed.
jest.mock('@/components/styled-components/themed-text', () => ({
  ThemedText: ({ children }: { children: React.ReactNode }) => {
    const { Text: MockText } = jest.requireActual('react-native');
    return <MockText>{children}</MockText>;
  },
}));

jest.mock('@/components/styled-components/themed-view', () => ({
  ThemedView: ({ children }: { children: React.ReactNode }) => {
    const { View: MockView } = jest.requireActual('react-native');
    return <MockView>{children}</MockView>;
  },
}));

// Stubbed so the test controls the data without a QueryClient or a network call.
jest.mock('@/lib/queries/expensesQueries', () => ({
  useExpensesQuery: jest.fn(),
}));

const mockedUseExpensesQuery = useExpensesQuery as jest.Mock;

const makeExpense = (category: Expense['category'], amount: number): Expense =>
  ({ id: "1", category, amount, date: "2026-10-01", updatedAt: "2026-10-01" });

describe('Overview', () => {
  beforeEach(() => {
    // October 15th, 2026: 31 days in the month, so daily and projected figures are predictable.
    jest.useFakeTimers().setSystemTime(new Date(2026, 9, 15));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the summary figures for the current month', async () => {
    mockedUseExpensesQuery.mockReturnValue({
      data: [makeExpense('food', 30), makeExpense('taxes', 70), makeExpense('transport', 20)],
    });

    await render(<Overview />);

    expect(mockedUseExpensesQuery).toHaveBeenCalledWith(2026, 9);
    expect(screen.getByText('Total this month')).toBeTruthy();
    expect(screen.getByText('€120.00')).toBeTruthy();
    expect(screen.getByText('€3.33')).toBeTruthy();
    expect(screen.getByText('€173.33')).toBeTruthy();
    expect(screen.getByText('€70.00')).toBeTruthy();
    expect(screen.getByText('Taxes')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('shows zero figures and a dash when there are no expenses', async () => {
    mockedUseExpensesQuery.mockReturnValue({ data: undefined });

    await render(<Overview />);

    expect(screen.getAllByText('€0.00')).toHaveLength(4);
    expect(screen.getByText('—')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
  });
});
