import { fireEvent, render, screen } from "@testing-library/react-native";

import IndicatorDots from "@/components/screens/edit-expense/EditView/categories-panel/indicator-dots";

describe("IndicatorDots", () => {
  it("renders one dot per item", async () => {
    await render(<IndicatorDots items={["a", "b", "c"]} activeIndex={0} />);

    expect(screen.getAllByRole("button", { name: /Go to page/ })).toHaveLength(3);
  });

  it("renders nothing when there is only one page", async () => {
    await render(<IndicatorDots items={["a"]} activeIndex={0} />);

    expect(screen.queryAllByRole("button", { name: /Go to page/ })).toHaveLength(0);
  });

  it("renders nothing when there are no pages", async () => {
    await render(<IndicatorDots items={[]} activeIndex={0} />);

    expect(screen.queryAllByRole("button", { name: /Go to page/ })).toHaveLength(0);
  });

  it("highlights only the active dot", async () => {
    await render(<IndicatorDots items={["a", "b"]} activeIndex={1} />);

    const first = screen.getByLabelText("Go to page 1");
    const second = screen.getByLabelText("Go to page 2");
    expect(second.props.className).toContain("bg-white");
    expect(second.props.className).not.toContain("bg-white/40");
    expect(first.props.className).toContain("bg-white/40");
  });

  it("calls onPress with the index of the dot that was pressed", async () => {
    const onPress = jest.fn();
    await render(<IndicatorDots items={["a", "b", "c"]} activeIndex={0} onPress={onPress} />);

    await fireEvent.press(screen.getByLabelText("Go to page 3"));

    expect(onPress).toHaveBeenCalledWith(2);
  });
});
