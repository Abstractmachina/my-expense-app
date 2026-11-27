import { act, fireEvent, render, screen } from "@testing-library/react-native";

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
 * Renders the panel inside the edit-view context.
 *
 * @param {EditViewContextProps} ctx - The context value to provide
 * @returns {Promise<ReturnType<typeof render>>} The render result
 */
const renderPanel = async (ctx: EditViewContextProps) =>
  render(
    <EditViewContext.Provider value={ctx}>
      <CommentPanel />
    </EditViewContext.Provider>,
  );

/**
 * Opens the comment popup by pressing the row.
 *
 * @returns {Promise<void>} Resolves once the press has been handled
 */
const openPopup = async () => {
  await fireEvent.press(screen.getByRole("button", { name: /^Comment/ }));
};

describe("CommentPanel", () => {
  it("shows the Comment title in the row", async () => {
    await renderPanel(makeContext(null));

    expect(screen.getByText("Comment")).toBeTruthy();
  });

  it("shows the comment text as a preview in the row", async () => {
    await renderPanel(makeContext("Lunch with team"));

    expect(screen.getByText("Lunch with team")).toBeTruthy();
  });

  it("shows the has-content indicator only when there is a comment", async () => {
    await renderPanel(makeContext("Lunch with team"));

    expect(screen.getByTestId("comment-has-content")).toBeTruthy();
  });

  it("hides the has-content indicator when the comment is empty", async () => {
    await renderPanel(makeContext("   "));

    expect(screen.queryByTestId("comment-has-content")).toBeNull();
  });

  it("does not show the input until the row is pressed", async () => {
    await renderPanel(makeContext(null));

    expect(screen.queryByLabelText("Comment")).toBeNull();
  });

  it("opens the popup with the input when the row is pressed", async () => {
    await renderPanel(makeContext("Lunch with team"));

    await openPopup();

    expect(screen.getByLabelText("Comment").props.value).toBe("Lunch with team");
  });

  it("uses a single-line input with a done return key", async () => {
    await renderPanel(makeContext(null));
    await openPopup();

    const input = screen.getByLabelText("Comment");
    expect(input.props.multiline).toBe(false);
    expect(input.props.returnKeyType).toBe("done");
  });

  it("writes the typed text to context", async () => {
    const ctx = makeContext(null);
    await renderPanel(ctx);
    await openPopup();

    await act(async () => {
      fireEvent.changeText(screen.getByLabelText("Comment"), "New comment");
    });
    expect(ctx.setComment).toHaveBeenCalledWith("New comment");
  });

  it("clears the comment when Clear is pressed", async () => {
    const ctx = makeContext("Lunch with team");
    await renderPanel(ctx);
    await openPopup();

    await fireEvent.press(screen.getByRole("button", { name: "Clear" }));
    expect(ctx.setComment).toHaveBeenCalledWith(null);
  });

  it("disables Clear when there is no comment", async () => {
    const ctx = makeContext(null);
    await renderPanel(ctx);
    await openPopup();

    await fireEvent.press(screen.getByRole("button", { name: "Clear" }));
    expect(ctx.setComment).not.toHaveBeenCalled();
  });

  it("closes the popup when Done is pressed", async () => {
    await renderPanel(makeContext("Lunch"));
    await openPopup();

    await fireEvent.press(screen.getByRole("button", { name: "Done" }));

    expect(screen.queryByLabelText("Comment")).toBeNull();
  });

  it("closes the popup when the return key is pressed", async () => {
    await renderPanel(makeContext("Lunch"));
    await openPopup();

    await fireEvent(screen.getByLabelText("Comment"), "submitEditing");

    expect(screen.queryByLabelText("Comment")).toBeNull();
  });
});
