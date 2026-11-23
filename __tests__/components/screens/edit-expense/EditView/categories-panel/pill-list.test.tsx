import { fireEvent, render, screen } from "@testing-library/react-native";

import PillList from "@/components/screens/edit-expense/EditView/categories-panel/pill-list";

// The theme imports global.css, which Jest cannot parse, so the themed text is stubbed.
jest.mock("@/components/styled-components/themed-text", () => ({
  ThemedText: ({ children }: { children: React.ReactNode }) => {
    const { Text: MockText } = jest.requireActual("react-native");
    return <MockText>{children}</MockText>;
  },
}));

const alpha = { value: "a", label: "Alpha" };
const beta = { value: "b", label: "Beta" };
const gamma = { value: "c", label: "Gamma" };

// Two pages: the first holds two pills, the second holds one.
const twoPages = [[alpha, beta], [gamma]];

describe("PillList", () => {
  it("renders a pill for every item", async () => {
    await render(<PillList paginatedItems={twoPages} />);

    expect(screen.getByRole("button", { name: "Alpha" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Beta" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Gamma" })).toBeTruthy();
  });

  it("marks only the pill matching activeValue as selected", async () => {
    await render(<PillList paginatedItems={twoPages} activeValue="b" />);

    expect(screen.getByRole("button", { name: "Beta" }).props.accessibilityState.selected).toBe(true);
    expect(screen.getByRole("button", { name: "Alpha" }).props.accessibilityState.selected).toBe(false);
  });

  it("calls onSelect with the value of the pressed item", async () => {
    const onSelect = jest.fn();
    await render(<PillList paginatedItems={twoPages} onSelect={onSelect} />);

    await fireEvent.press(screen.getByRole("button", { name: "Gamma" }));

    expect(onSelect).toHaveBeenCalledWith("c");
  });

  it("renders one page indicator dot per page", async () => {
    await render(<PillList paginatedItems={twoPages} />);

    expect(screen.getAllByRole("button", { name: /Go to page/ })).toHaveLength(2);
  });

  it("moves the active dot to the page that was scrolled to", async () => {
    await render(<PillList paginatedItems={twoPages} />);
    // fireEvent bubbles up to the enclosing ScrollView, so firing on a pill reaches its handlers.
    const pill = screen.getByRole("button", { name: "Alpha" });

    await fireEvent(pill, "layout", { nativeEvent: { layout: { width: 300 } } });
    await fireEvent(pill, "momentumScrollEnd", { nativeEvent: { contentOffset: { x: 300 } } });

    expect(screen.getByLabelText("Go to page 2").props.className).toContain("bg-white");
    expect(screen.getByLabelText("Go to page 1").props.className).toContain("bg-white/40");
  });
});
