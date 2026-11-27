import { fireEvent, render, screen } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ExpenseRoute from '@/app/edit-expense';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

// EditView loads the expense and renders the form, so it is stubbed to show the props the route passes in.
jest.mock('@/components/screens/edit-expense/EditView', () => ({
  __esModule: true,
  default: (props: { id?: string; onSaved?: () => void }) => {
    const { Text: MockText, Pressable: MockPressable } = jest.requireActual('react-native');
    return (
      <>
        <MockText>{props.id ? `edit ${props.id}` : 'add view'}</MockText>
        <MockPressable onPress={props.onSaved}>
          <MockText>save stub</MockText>
        </MockPressable>
      </>
    );
  },
}));

const router = { back: jest.fn(), canGoBack: jest.fn(), replace: jest.fn() };

describe('ExpenseRoute (edit-expense)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useRouter).mockReturnValue(router as never);
  });

  it('passes no id to the edit view when adding', async () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({} as never);

    await render(<ExpenseRoute />);

    expect(screen.getByText('add view')).toBeTruthy();
  });

  it('passes the id from the query string to the edit view when editing', async () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({ id: 'abc' } as never);

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
