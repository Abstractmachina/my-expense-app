import { fireEvent, render, screen } from "@testing-library/react-native";

import MonthPicker from "@/components/inputs/MonthPicker";

// lucide-react-native ships ES modules that Jest cannot load, so the icon is stubbed.
jest.mock("lucide-react-native", () => ({ Triangle: () => null }));

describe("MonthPicker", () => {
  beforeEach(() => {
    // Fix "today" to October 2026 so the current-month rules are predictable.
    jest.useFakeTimers().setSystemTime(new Date(2026, 9, 15));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows the selected month and year", async () => {
    await render(
      <MonthPicker
        selectedMonth={5}
        setSelectedMonth={jest.fn()}
        selectedYear={2025}
        setSelectedYear={jest.fn()}
      />,
    );

    expect(screen.getByText("June 2025")).toBeTruthy();
  });

  it("moves back one month when the previous arrow is pressed", async () => {
    const setMonth = jest.fn();
    const setYear = jest.fn();
    await render(
      <MonthPicker
        selectedMonth={5}
        setSelectedMonth={setMonth}
        selectedYear={2025}
        setSelectedYear={setYear}
      />,
    );

    await fireEvent.press(
      screen.getByRole("button", { name: "Previous month" }),
    );
    expect(setMonth).toHaveBeenCalledWith(4);
    expect(setYear).not.toHaveBeenCalled();
  });

  it("wraps back into the previous year from January", async () => {
    const setMonth = jest.fn();
    const setYear = jest.fn();
    await render(
      <MonthPicker
        selectedMonth={0}
        setSelectedMonth={setMonth}
        selectedYear={2025}
        setSelectedYear={setYear}
      />,
    );

    await fireEvent.press(
      screen.getByRole("button", { name: "Previous month" }),
    );
    expect(setMonth).toHaveBeenCalledWith(11);
    expect(setYear).toHaveBeenCalledWith(2024);
  });

  it("hides the next arrow on the current month", async () => {
    await render(
      <MonthPicker
        selectedMonth={9}
        setSelectedMonth={jest.fn()}
        selectedYear={2026}
        setSelectedYear={jest.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Next month" })).toBeNull();
  });

  it("moves forward one month when the next arrow is pressed", async () => {
    const setMonth = jest.fn();
    await render(
      <MonthPicker
        selectedMonth={5}
        setSelectedMonth={setMonth}
        selectedYear={2026}
        setSelectedYear={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Next month" }));
    expect(setMonth).toHaveBeenCalledWith(6);
  });
});
