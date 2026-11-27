import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useContext } from 'react';

import EditViewController from '@/components/screens/edit-expense/EditView/EditViewController';
import { EditViewContext } from '@/components/screens/edit-expense/EditView/EditViewContext';
import { sendMessage } from '@/components/informative/sendMessage';
import { deleteExpense } from '@/lib/serverActions/expenseActions';

jest.mock('@/lib/serverActions/expenseActions', () => ({
  createExpense: jest.fn(),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn(),
}));

jest.mock('@/lib/queries/expenseTagsQueries', () => ({
  useExpenseTagsQuery: () => ({ data: [] }),
}));

jest.mock('@/components/informative/sendMessage', () => ({
  sendMessage: jest.fn(),
}));

const existingDoc = { id: 'abc', amount: 1, category: 'food', date: '2026-10-25' };

/**
 * Child that exposes the context's remove action through a button so the test can press it.
 *
 * @returns {JSX.Element} A button that calls remove
 */
const RemoveTrigger = () => {
  const ctx = useContext(EditViewContext);
  const { Pressable, Text } = jest.requireActual('react-native');
  return (
    <Pressable onPress={() => ctx?.remove()}>
      <Text>remove</Text>
    </Pressable>
  );
};

/**
 * Renders the controller with a fresh query client.
 *
 * @param {() => void} onSaved - Callback the controller should call after a successful delete
 * @returns {ReturnType<typeof render>} The render result
 */
const renderController = async (onSaved: () => void) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <EditViewController existingDoc={existingDoc as never} onSaved={onSaved}>
        <RemoveTrigger />
      </EditViewController>
    </QueryClientProvider>,
  );
};

describe('EditViewController remove', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes the existing expense and calls onSaved on success', async () => {
    jest.mocked(deleteExpense).mockResolvedValue(undefined);
    const onSaved = jest.fn();
    const { getByText } = await renderController(onSaved);

    await act(async () => {
      fireEvent.press(getByText("remove"));
    });

    await waitFor(() => expect(onSaved).toHaveBeenCalledTimes(1));
    expect(deleteExpense).toHaveBeenCalledWith('abc');
  });

  it('shows an error message and does not call onSaved when the delete fails', async () => {
    jest.mocked(deleteExpense).mockRejectedValue(new Error('Error deleting expense: 500 Server Error'));
    const onSaved = jest.fn();
    const { getByText } = await renderController(onSaved);

    await act(async () => {
      fireEvent.press(getByText("remove"));
    });

    await waitFor(() =>
      expect(sendMessage).toHaveBeenCalledWith({
        message: 'Error deleting expense',
        description: 'Error deleting expense: 500 Server Error',
      }),
    );
    expect(onSaved).not.toHaveBeenCalled();
  });
});
