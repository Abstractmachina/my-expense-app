import Collapsible from "@/components/layout/Collapsible";
import { Expense } from "@/payload-types";
import { View } from "react-native";
import AmountPanel from "./AmountPanel";
import CategoriesPanel from "./categories-panel";
import CommentPanel from "./CommentPanel";
import DatePanel from "./DatePanel";
import EditViewController from "./EditViewController";
import EditViewHeader from "./EditViewHeader";
import Providers from "./Providers";
import SubmitButton from "./SubmitButton";
import TagsPanel from "./TagsPanel";
import { ThemedView } from "@/components/styled-components/themed-view";

type Props = {
  existingDoc?: Expense;
  onSaved?: () => void;
  onClose?: () => void;
};

export const EditView = ({ existingDoc, onSaved, onClose }: Props) => {
  const typedDoc = existingDoc;

  const componentKey = typedDoc?.id ? typedDoc.id : `new-${Date.now()}`;

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

          <SubmitButton />
        </ThemedView>
      </EditViewController>
    </Providers>
  );
};

export default EditView;
