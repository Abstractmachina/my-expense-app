import { act, fireEvent, render, screen } from "@testing-library/react-native";

import DatePicker from "@/components/inputs/DatePicker";
import DatePanel from "@/components/screens/edit-expense/EditView/DatePanel";
import {
  EditViewContext,
  EditViewContextProps,
} from "@/components/screens/edit-expense/EditView/EditViewContext";

// rn-primitives ships untransformed ES modules that Jest cannot load, so Slot is stubbed as a pass-through.
jest.mock("@rn-primitives/slot", () => ({
  Slot: ({ children }: { children: React.ReactNode }) => children,
}));

// The theme imports global.css, which Jest cannot parse, so the themed text is stubbed.
jest.mock("@/components/styled-components/themed-text", () => ({
  ThemedText: ({ children }: { children: React.ReactNode }) => {
    const { Text: MockText } = jest.requireActual("react-native");
    return <MockText>{children}</MockText>;
  },
}));

// The native picker is replaced so the panel's props to it can be inspected.
jest.mock("@/components/inputs/DatePicker", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const picked = new Date(2026, 9, 3);

/**
 * Returns the props from the last render of the mocked date picker.
 *
 * @returns {Record<string, any>} Props passed to DatePicker
 */
const lastPickerProps = () => {
  const calls = (DatePicker as unknown as jest.Mock).mock.calls;
  return calls[calls.length - 1][0];
};

/**
 * Builds an edit-view context with a selected date and a spy setter.
 *
 * @param {Date | null} selectedDate - The date to show in the panel
 * @returns {EditViewContextProps} A context value for EditViewContext.Provider
 */
const makeContext = (selectedDate: Date | null): EditViewContextProps =>
  ({
    selectedDate,
    setSelectedDate: jest.fn(),
  }) as unknown as EditViewContextProps;

/**
 * Renders the panel inside the edit-view context.
 *
 * @param {EditViewContextProps} ctx - The context value to provide
 * @returns {Promise<ReturnType<typeof render>>} The render result
 */
const renderPanel = async (ctx: EditViewContextProps) =>
  render(
    <EditViewContext.Provider value={ctx}>
      <DatePanel />
    </EditViewContext.Provider>,
  );

describe("DatePanel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows the title and the selected date in the header", async () => {
    await renderPanel(makeContext(picked));

    expect(screen.getByText("Date")).toBeTruthy();
    expect(screen.getByText(picked.toLocaleDateString())).toBeTruthy();
  });

  it("shows no date when none is selected", async () => {
    await renderPanel(makeContext(null));

    expect(screen.queryByText(picked.toLocaleDateString())).toBeNull();
    expect(lastPickerProps().value).toBeNull();
  });

  it("opens the picker when the header is pressed", async () => {
    await renderPanel(makeContext(null));

    expect(lastPickerProps().open).toBe(false);
    await fireEvent.press(screen.getByRole("button", { name: /Date/ }));
    expect(lastPickerProps().open).toBe(true);
  });

  it("writes the picked date to context", async () => {
    const ctx = makeContext(null);
    await renderPanel(ctx);

    await act(async () => lastPickerProps().onChange(picked));
    expect(ctx.setSelectedDate).toHaveBeenCalledWith(picked);
  });

  it("closes the picker when the picker requests close", async () => {
    await renderPanel(makeContext(null));

    await fireEvent.press(screen.getByRole("button", { name: /Date/ }));
    await act(async () => lastPickerProps().onClose());
    expect(lastPickerProps().open).toBe(false);
  });
});
