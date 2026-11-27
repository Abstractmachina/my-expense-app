import Collapsible from "@/components/layout/Collapsible";
import Loader from "@/components/animated/Loader";
import { useExpenseQuery } from "@/lib/queries/expensesQueries";
import { View } from "react-native";
import AmountPanel from "./AmountPanel";
import CategoriesPanel from "./categories-panel";
import CommentPanel from "./CommentPanel";
import DatePanel from "./DatePanel";
import EditViewController from "./EditViewController";
import EditViewHeader from "./EditViewHeader";
import DeleteButton from "./DeleteButton";
import Providers from "./Providers";
import SubmitButton from "./SubmitButton";
import TagsPanel from "./TagsPanel";
import { ThemedView } from "@/components/styled-components/themed-view";

type Props = {
  id?: string;
  onSaved?: () => void;
  onClose?: () => void;
};

/**
 * Add or edit form for an expense. Loads the expense first and shows a loader until then.
 *
 * @param props - `id` of the expense to edit (omit to add), plus save and close handlers.
 * @returns The form, or a loader while the expense is loading.
 */
export const EditView = ({ id, onSaved, onClose }: Props) => {
  // isLoading, not isPending: a disabled query (add mode, no id) is pending forever.
  const { data: existingDoc, isLoading } = useExpenseQuery(id);

  // The form reads existingDoc once, on mount, so it must not render before the load finishes.
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader />
      </View>
    );
  }

  const typedDoc = existingDoc ?? undefined;

  // Stable key: a changing key remounts the controller on every render and wipes the form input.
  const componentKey = typedDoc?.id ?? "new";

  return (
    <Providers>
      <EditViewController
        existingDoc={typedDoc}
        onSaved={onSaved}
        key={componentKey}
      >
        <ThemedView className="flex flex-col h-full">
          <EditViewHeader onClose={onClose} />
          <AmountPanel />
          <Collapsible>
            <CategoriesPanel />
            <TagsPanel />
            <DatePanel />
            <CommentPanel />
          </Collapsible>

          <View className="flex flex-row items-center">
            <SubmitButton className="grow"/>
            <DeleteButton />
          </View>
        </ThemedView>
      </EditViewController>
    </Providers>
  );
};

export default EditView;
