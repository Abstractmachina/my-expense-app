import { act, fireEvent, render, screen } from '@testing-library/react-native';

import AmountPanel from '@/components/screens/edit-expense/EditView/AmountPanel';
import {
  EditViewContext,
  EditViewContextProps,
} from '@/components/screens/edit-expense/EditView/EditViewContext';

// The theme imports global.css, which Jest cannot parse, so the themed view is stubbed.
jest.mock('@/components/styled-components/themed-view', () => ({
  ThemedView: ({ children }: { children: React.ReactNode }) => {
    const { View: MockView } = jest.requireActual('react-native');
    return <MockView>{children}</MockView>;
  },
}));

/**
 * Renders the amount panel inside the edit-view context.
 *
 * @param {Partial<EditViewContextProps>} value - Context fields to override
 * @returns {ReturnType<typeof render>} The render result
 */
const renderWith = (value: Partial<EditViewContextProps>) =>
  render(
    <EditViewContext.Provider
      value={{ amount: null, setAmount: jest.fn(), ...value } as EditViewContextProps}
    >
      <AmountPanel />
    </EditViewContext.Provider>,
  );

describe('AmountPanel', () => {
  it('autofocuses the amount input when adding a new expense', async () => {
    await renderWith({ isNew: true });

    expect(screen.getByDisplayValue('').props.autoFocus).toBe(true);
  });

  it('does not autofocus the amount input when editing an existing expense', async () => {
    await renderWith({ isNew: false, amount: 12.5 });

    expect(screen.getByDisplayValue('12.5').props.autoFocus).toBeFalsy();
  });

  it('shows the existing amount when editing', async () => {
    await renderWith({ isNew: false, amount: 12.5 });

    expect(screen.getByDisplayValue('12.5')).toBeTruthy();
  });

  it('commits the typed amount to the context on blur', async () => {
    const setAmount = jest.fn();
    await renderWith({ isNew: true, setAmount });

    await act(async () => fireEvent.changeText(screen.getByDisplayValue(''), '12.5'));
    await act(async () => fireEvent(screen.getByDisplayValue('12.5'), 'blur'));

    expect(setAmount).toHaveBeenCalledWith(12.5);
    expect(screen.getByDisplayValue('12.50')).toBeTruthy();
  });

  it('ignores input with more than two decimals', async () => {
    await renderWith({ isNew: true });

    await act(async () => fireEvent.changeText(screen.getByDisplayValue(''), '1.234'));

    expect(screen.getByDisplayValue('')).toBeTruthy();
  });
});
