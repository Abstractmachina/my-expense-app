import { render, screen } from '@testing-library/react-native';

import { EditView } from '@/components/screens/edit-expense/EditView';
import { useExpenseQuery } from '@/lib/queries/expensesQueries';

jest.mock('@/lib/queries/expensesQueries', () => ({
  useExpenseQuery: jest.fn(),
}));

// The loader animation is stubbed to a marker so the test can find it.
jest.mock('@/components/animated/Loader', () => ({
  __esModule: true,
  default: () => {
    const { Text: MockText } = jest.requireActual('react-native');
    return <MockText>loading</MockText>;
  },
}));

// The controller is stubbed to report the expense it was given, and counts its mounts.
const mockControllerMounts = { count: 0 };
jest.mock('@/components/screens/edit-expense/EditView/EditViewController', () => ({
  __esModule: true,
  default: ({ existingDoc }: { existingDoc?: { id?: string } }) => {
    const React = jest.requireActual('react');
    const { Text: MockText } = jest.requireActual('react-native');
    React.useEffect(() => {
      mockControllerMounts.count += 1;
    }, []);
    return <MockText>{existingDoc ? `form ${existingDoc.id}` : 'form new'}</MockText>;
  },
}));
jest.mock('@/components/screens/edit-expense/EditView/Providers', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('@/components/screens/edit-expense/EditView/EditViewHeader', () => () => null);
jest.mock('@/components/screens/edit-expense/EditView/AmountPanel', () => () => null);
jest.mock('@/components/screens/edit-expense/EditView/categories-panel', () => () => null);
jest.mock('@/components/screens/edit-expense/EditView/TagsPanel', () => () => null);
jest.mock('@/components/screens/edit-expense/EditView/DatePanel', () => () => null);
jest.mock('@/components/screens/edit-expense/EditView/CommentPanel', () => () => null);
jest.mock('@/components/screens/edit-expense/EditView/SubmitButton', () => () => null);
jest.mock('@/components/screens/edit-expense/EditView/DeleteButton', () => () => null);
jest.mock('@/components/layout/Collapsible', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/styled-components/themed-view', () => ({
  ThemedView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('EditView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockControllerMounts.count = 0;
  });

  it('keeps the form mounted when the view re-renders while adding', async () => {
    jest.mocked(useExpenseQuery).mockReturnValue({ data: undefined, isLoading: false } as never);

    const { rerender } = await render(<EditView />);
    await rerender(<EditView />);

    expect(mockControllerMounts.count).toBe(1);
  });

  it('shows the form without a loader when adding a new expense', async () => {
    jest.mocked(useExpenseQuery).mockReturnValue({ data: undefined, isLoading: false } as never);

    await render(<EditView />);

    expect(useExpenseQuery).toHaveBeenCalledWith(undefined);
    expect(screen.getByText('form new')).toBeTruthy();
    expect(screen.queryByText('loading')).toBeNull();
  });

  it('shows the loader and not the form while the expense is loading', async () => {
    jest.mocked(useExpenseQuery).mockReturnValue({ data: undefined, isLoading: true } as never);

    await render(<EditView id="abc" />);

    expect(useExpenseQuery).toHaveBeenCalledWith('abc');
    expect(screen.getByText('loading')).toBeTruthy();
    expect(screen.queryByText(/^form/)).toBeNull();
  });

  it('shows the form with the loaded expense once loading finishes', async () => {
    jest.mocked(useExpenseQuery).mockReturnValue({ data: { id: 'abc' }, isLoading: false } as never);

    await render(<EditView id="abc" />);

    expect(screen.getByText('form abc')).toBeTruthy();
    expect(screen.queryByText('loading')).toBeNull();
  });
});
