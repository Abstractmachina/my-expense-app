import { act, fireEvent, render, screen } from "@testing-library/react-native";

import Collapsible from "@/components/layout/Collapsible";
import CommentPanel from "@/components/screens/edit-expense/EditView/CommentPanel";
import {
  EditViewContext,
  EditViewContextProps,
} from "@/components/screens/edit-expense/EditView/EditViewContext";

// rn-primitives ships untransformed ES modules that Jest cannot load, so Slot is stubbed as a pass-through.
jest.mock("@rn-primitives/slot", () => ({
  Slot: ({ children }: { children: React.ReactNode }) => children,
}));

// lucide-react-native ships ES modules that Jest cannot load, so the icon is stubbed.
jest.mock("lucide-react-native", () => ({
  MessageSquareText: ({ testID }: { testID?: string }) => {
    const { View: MockView } = jest.requireActual("react-native");
    return <MockView testID={testID} />;
  },
}));

// The theme imports global.css, which Jest cannot parse, so the themed text is stubbed.
jest.mock("@/components/styled-components/themed-text", () => ({
  ThemedText: ({ children }: { children: React.ReactNode }) => {
    const { Text: MockText } = jest.requireActual("react-native");
    return <MockText>{children}</MockText>;
  },
}));

/**
 * Builds an edit-view context with a comment and a spy setter.
 *
 * @param {string | null} comment - The comment to show in the panel
 * @returns {EditViewContextProps} A context value for EditViewContext.Provider
 */
const makeContext = (comment: string | null): EditViewContextProps =>
  ({
    comment,
    setComment: jest.fn(),
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
        <CommentPanel />
      </EditViewContext.Provider>
    </Collapsible>,
  );
  await fireEvent.press(screen.getByRole("button", { name: /^Comment/ }));
  return result;
};

describe("CommentPanel", () => {
  it("shows the Comment title in the header", async () => {
    await renderPanel(makeContext(null));

    expect(screen.getByText("Comment")).toBeTruthy();
  });

  it("shows the has-content indicator only when there is a comment", async () => {
    await renderPanel(makeContext("Lunch with team"));

    expect(screen.getByTestId("comment-has-content")).toBeTruthy();
  });

  it("hides the has-content indicator when the comment is empty", async () => {
    await renderPanel(makeContext("   "));

    expect(screen.queryByTestId("comment-has-content")).toBeNull();
  });

  it("does not show the comment text as a header preview", async () => {
    await renderPanel(makeContext("Lunch with team"));

    // The text appears only in the textarea, not as a header description.
    expect(screen.queryAllByText("Lunch with team")).toHaveLength(0);
    expect(screen.getByDisplayValue("Lunch with team")).toBeTruthy();
  });

  it("clears the comment when Clear is pressed", async () => {
    const ctx = makeContext("Lunch with team");
    await renderPanel(ctx);

    await fireEvent.press(screen.getByRole("button", { name: "Clear" }));
    expect(ctx.setComment).toHaveBeenCalledWith(null);
  });

  it("disables Clear when there is no comment", async () => {
    const ctx = makeContext(null);
    await renderPanel(ctx);

    await fireEvent.press(screen.getByRole("button", { name: "Clear" }));
    expect(ctx.setComment).not.toHaveBeenCalled();
  });

  it("uses a single-line input with a done return key", async () => {
    await renderPanel(makeContext(null));

    const input = screen.getByLabelText("Comment");
    expect(input.props.multiline).toBe(false);
    expect(input.props.returnKeyType).toBe("done");
  });

  it("collapses the panel when the return key is pressed", async () => {
    await renderPanel(makeContext("Lunch"));

    await fireEvent(screen.getByLabelText("Comment"), "submitEditing");

    expect(
      screen.getByRole("button", { name: /^Comment/ }).props.accessibilityState
        .expanded,
    ).toBe(false);
  });

  it("writes the typed text to context", async () => {
    const ctx = makeContext(null);
    await renderPanel(ctx);

    await act(async () => {
      fireEvent.changeText(screen.getByLabelText("Comment"), "New comment");
    });
    expect(ctx.setComment).toHaveBeenCalledWith("New comment");
  });
});
