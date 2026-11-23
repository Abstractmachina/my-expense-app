import { fireEvent, render, screen } from "@testing-library/react-native";

import Collapsible from "@/components/layout/Collapsible";
import CategoriesPanel from "@/components/screens/edit-expense/EditView/categories-panel";
import {
  EditViewContext,
  EditViewContextProps,
} from "@/components/screens/edit-expense/EditView/EditViewContext";
import { expenseCategoriesArray } from "@/lib/types/expenseCategories";

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

const PAGE_SIZE = 9;

/**
 * Builds an edit-view context with a selected category and spy setters.
 *
 * @param {ExpenseCategory | null} selected - The category to mark as selected
 * @returns {EditViewContextProps} A context value for EditViewContext.Provider
 */
const makeContext = (
  selected: (typeof expenseCategoriesArray)[number] | null,
): EditViewContextProps =>
  ({
    selectedCategory: selected,
    setSelectedCategory: jest.fn(),
  }) as unknown as EditViewContextProps;

/**
 * Renders the panel inside the edit-view context and opens its collapsible section.
 *
 * @param {EditViewContextProps} ctx - The context value to provide
 * @returns {Promise<ReturnType<typeof render>>} The render result
 */
const renderPanel = async (ctx: EditViewContextProps) => {
  const result = await render(
    <Collapsible>
      <EditViewContext.Provider value={ctx}>
        <CategoriesPanel />
      </EditViewContext.Provider>
    </Collapsible>,
  );
  await fireEvent.press(screen.getByRole("button", { name: /Category/ }));
  return result;
};

describe("CategoriesPanel", () => {
  it("shows the selected category label in the header", async () => {
    await renderPanel(makeContext(expenseCategoriesArray[1]));

    expect(screen.getByText("Category")).toBeTruthy();
    // The label also appears in the hidden measuring copy, so assert it is present rather than unique.
    expect(
      screen.getAllByText(expenseCategoriesArray[1].label, { exact: true })
        .length,
    ).toBeGreaterThan(0);
  });

  it("renders a button for every category", async () => {
    await renderPanel(makeContext(null));

    const buttons = screen.getAllByRole("button", {
      name: new RegExp(
        `^(${expenseCategoriesArray.map((c) => c.label).join("|")})$`,
      ),
    });
    expect(buttons).toHaveLength(expenseCategoriesArray.length);
  });

  it("marks only the selected category as selected", async () => {
    await renderPanel(makeContext(expenseCategoriesArray[0]));

    const selected = screen.getByRole("button", {
      name: expenseCategoriesArray[0].label,
    });
    const other = screen.getByRole("button", {
      name: expenseCategoriesArray[2].label,
    });
    expect(selected.props.accessibilityState.selected).toBe(true);
    expect(other.props.accessibilityState.selected).toBe(false);
  });

  it("sets the category in context when a category button is pressed", async () => {
    const ctx = makeContext(null);
    await renderPanel(ctx);

    await fireEvent.press(
      screen.getByRole("button", { name: expenseCategoriesArray[2].label }),
    );

    expect(ctx.setSelectedCategory).toHaveBeenCalledWith(
      expenseCategoriesArray[2],
    );
  });

  it("renders one page indicator dot per page of categories", async () => {
    await renderPanel(makeContext(null));

    const pages = Math.ceil(expenseCategoriesArray.length / PAGE_SIZE);
    const dots = screen.queryAllByRole("button", { name: /Go to page/ });
    expect(dots).toHaveLength(pages > 1 ? pages : 0);
  });
});
