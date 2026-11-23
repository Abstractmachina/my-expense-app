import { fireEvent, render, screen } from "@testing-library/react-native";

import PillButton from "@/components/screens/edit-expense/EditView/categories-panel/pill-button";

// The theme imports global.css, which Jest cannot parse, so the themed text is stubbed.
jest.mock("@/components/styled-components/themed-text", () => ({
  ThemedText: ({ children }: { children: React.ReactNode }) => {
    const { Text: MockText } = jest.requireActual("react-native");
    return <MockText>{children}</MockText>;
  },
}));

describe("PillButton", () => {
  it("renders its label as a button", async () => {
    await render(<PillButton>Taxes</PillButton>);

    expect(screen.getByRole("button", { name: "Taxes" })).toBeTruthy();
  });

  it("reports not selected when isActive is not set", async () => {
    await render(<PillButton>Taxes</PillButton>);

    expect(screen.getByRole("button", { name: "Taxes" }).props.accessibilityState.selected).toBeFalsy();
  });

  it("reports selected when isActive is true", async () => {
    await render(<PillButton isActive>Taxes</PillButton>);

    expect(screen.getByRole("button", { name: "Taxes" }).props.accessibilityState.selected).toBe(true);
  });

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    await render(<PillButton onPress={onPress}>Taxes</PillButton>);

    await fireEvent.press(screen.getByRole("button", { name: "Taxes" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
