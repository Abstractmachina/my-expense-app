import { Alert } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import DeleteButton from '@/components/screens/edit-expense/EditView/DeleteButton';
import {
  EditViewContext,
  EditViewContextProps,
} from '@/components/screens/edit-expense/EditView/EditViewContext';

// lucide-react-native ships ES modules that Jest cannot load, so the icon is stubbed.
jest.mock('lucide-react-native', () => ({
  Trash2: () => null,
}));

// The theme imports global.css, which Jest cannot parse, so the loader is stubbed.
jest.mock('@/components/animated/Loader', () => () => null);

/**
 * Renders the delete button inside an edit-view context.
 *
 * @param {Partial<EditViewContextProps>} value - Context fields to override
 * @returns {void}
 */
const renderWith = async (value: Partial<EditViewContextProps>) =>
  render(
    <EditViewContext.Provider value={{ remove: jest.fn(), ...value } as EditViewContextProps}>
      <DeleteButton />
    </EditViewContext.Provider>,
  );

describe('DeleteButton', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders nothing when adding a new expense', async () => {
    const { toJSON } = await renderWith({ isNew: true });

    expect(toJSON()).toBeNull();
  });

  it('asks for confirmation before deleting an existing expense', async () => {
    const remove = jest.fn();
    await renderWith({ isNew: false, remove });

    fireEvent.press(screen.getByRole('button'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete expense?',
      'This cannot be undone.',
      expect.any(Array),
    );
    expect(remove).not.toHaveBeenCalled();
  });

  it('deletes when the user confirms', async () => {
    const remove = jest.fn();
    await renderWith({ isNew: false, remove });

    fireEvent.press(screen.getByRole('button'));
    const buttons = jest.mocked(Alert.alert).mock.calls[0][2] ?? [];
    buttons.find((b) => b.text === 'Delete')?.onPress?.();

    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('does not delete when the user cancels', async () => {
    const remove = jest.fn();
    await renderWith({ isNew: false, remove });

    fireEvent.press(screen.getByRole('button'));
    const buttons = jest.mocked(Alert.alert).mock.calls[0][2] ?? [];
    buttons.find((b) => b.text === 'Cancel')?.onPress?.();

    expect(remove).not.toHaveBeenCalled();
  });

  it('is disabled while a delete is running', async () => {
    await renderWith({ isNew: false, isDeleting: true });

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
