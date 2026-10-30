import { fireEvent, render, screen } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ExpenseRoute from '@/app/edit-expense/[[...id]]';
import { useExpenseQuery } from '@/lib/queries/expensesQueries';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/lib/queries/expensesQueries', () => ({
  useExpenseQuery: jest.fn(),
}));

// The edit view pulls in the full form, so it is stubbed to show the props the route passes in.
jest.mock('@/components/screens/expenses/_views/EditView', () => ({
  __esModule: true,
  default: (props: { existingDoc?: { id?: string }; onSaved?: () => void }) => {
    const { Text: MockText, Pressable: MockPressable } = jest.requireActual('react-native');
    return (
      <>
        <MockText>{props.existingDoc ? `edit ${props.existingDoc.id}` : 'add view'}</MockText>
        <MockPressable onPress={props.onSaved}>
          <MockText>save stub</MockText>
        </MockPressable>
      </>
    );
  },
}));

const router = { back: jest.fn(), canGoBack: jest.fn(), replace: jest.fn() };

describe('ExpenseRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useRouter).mockReturnValue(router as never);
    jest.mocked(useExpenseQuery).mockReturnValue({ data: undefined } as never);
  });

  it('opens the add form when no id is in the slug', async () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({} as never);

    await render(<ExpenseRoute />);

    expect(useExpenseQuery).toHaveBeenCalledWith(undefined);
    expect(screen.getByText('add view')).toBeTruthy();
  });

  it('renders nothing while the expense in the slug is loading', async () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({ id: ['abc'] } as never);

    await render(<ExpenseRoute />);

    expect(useExpenseQuery).toHaveBeenCalledWith('abc');
    expect(screen.queryByText('add view')).toBeNull();
  });

  it('opens the edit form with the loaded expense when an id is in the slug', async () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({ id: ['abc'] } as never);
    jest.mocked(useExpenseQuery).mockReturnValue({ data: { id: 'abc' } } as never);

    await render(<ExpenseRoute />);

    expect(screen.getByText('edit abc')).toBeTruthy();
  });

  it('goes back to the previous screen when saved and history exists', async () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({} as never);
    router.canGoBack.mockReturnValue(true);

    await render(<ExpenseRoute />);
    await fireEvent.press(screen.getByText('save stub'));

    expect(router.back).toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('falls back to the expenses list when there is no history, as after a deep link', async () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({} as never);
    router.canGoBack.mockReturnValue(false);

    await render(<ExpenseRoute />);
    await fireEvent.press(screen.getByText('save stub'));

    expect(router.replace).toHaveBeenCalledWith('/expenses');
    expect(router.back).not.toHaveBeenCalled();
  });
});
