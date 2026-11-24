import { fireEvent, render, screen } from "@testing-library/react-native";

import Collapsible from "@/components/layout/Collapsible";
import {
  EditViewContext,
  EditViewContextProps,
} from "@/components/screens/edit-expense/EditView/EditViewContext";
import TagsPanel from "@/components/screens/edit-expense/EditView/TagsPanel";

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

const tags = [
  { id: "t1", name: "Groceries" },
  { id: "t2", name: "Travel" },
];

/**
 * Builds an edit-view context with the tag list and spy setters.
 *
 * @param {ExpenseTag | null} selected - The tag to mark as selected
 * @returns {EditViewContextProps} A context value for EditViewContext.Provider
 */
const makeContext = (selected: (typeof tags)[number] | null): EditViewContextProps =>
  ({
    allTags: tags,
    selectedTag: selected,
    setSelectedTag: jest.fn(),
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
        <TagsPanel />
      </EditViewContext.Provider>
    </Collapsible>,
  );
  await fireEvent.press(screen.getByRole("button", { name: /^Tags/ }));
  return result;
};

describe("TagsPanel", () => {
  it("sets the picked tag in context", async () => {
    const ctx = makeContext(null);
    await renderPanel(ctx);

    await fireEvent.press(screen.getByRole("button", { name: "Travel" }));

    expect(ctx.setSelectedTag).toHaveBeenCalledWith(tags[1]);
  });

  it("collapses the panel after a tag is picked", async () => {
    await renderPanel(makeContext(null));

    await fireEvent.press(screen.getByRole("button", { name: "Travel" }));

    expect(
      screen.getByRole("button", { name: /^Tags/ }).props.accessibilityState
        .expanded,
    ).toBe(false);
  });
});
