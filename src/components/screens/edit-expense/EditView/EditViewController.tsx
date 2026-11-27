import { PropsWithChildren, useMemo, useState } from "react";
import { EditViewContext } from "./EditViewContext";
import { Expense, ExpenseTag } from "@/payload-types";
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "@/lib/serverActions/expenseActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/components/informative/sendMessage";
import { useExpenseTagsQuery } from "@/lib/queries/expenseTagsQueries";
import {
  ExpenseCategory,
  getExpenseCategory,
} from "@/lib/types/expenseCategories";

type Props = {
  existingDoc?: Expense;
  onSaved?: () => void;
};

const EditViewController = ({
  children,
  onSaved,
  existingDoc,
}: Props & PropsWithChildren) => {
  const isNew = !existingDoc?.id;
  const queryClient = useQueryClient();

  const initialTags = useExpenseTagsQuery().data;
  const [amount, setAmount] = useState<number | null>(
    isNew ? null : existingDoc?.amount || null,
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategory | null>(
      isNew ? null : getExpenseCategory(existingDoc?.category) || null,
    );
  const [selectedTag, setSelectedTag] = useState<ExpenseTag | null>(
    isNew || !existingDoc.tag
      ? null
      : typeof existingDoc?.tag !== "string"
        ? existingDoc?.tag
        : initialTags?.find((tag) => tag.id === existingDoc?.tag) || null,
  );

  const availableTags = useMemo<ExpenseTag[]>(() => {
    // no category selected, return all tags
    if (!selectedCategory) {
      if (initialTags && initialTags.length > 0) return initialTags;
      return [];
    }

    // category selected, return tags for that category
    return (
      initialTags?.filter((tag) =>
        tag.category?.includes(selectedCategory?.value),
      ) || []
    );
  }, [initialTags, selectedCategory]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    isNew ? new Date() : new Date(existingDoc?.date),
  );
  const [comment, setComment] = useState<string | null>(
    isNew ? null : existingDoc?.comment || null,
  );

  const [isSaving, setIsSaving] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCategory) {
        sendMessage({ message: "Please select a category" });
        return;
      }
      setIsSaving(true);

      let result: null | Expense = null;
      if (isNew) {
        console.log("Creating new expense");
        result = await createExpense({
          amount,
          category: selectedCategory?.value,
          tag: selectedTag?.id,
          date: selectedDate?.toISOString(),
          comment,
        });
      } else {
        result = await updateExpense(existingDoc?.id || "", {
          amount,
          category: selectedCategory?.value,
          tag: selectedTag?.id,
          date: selectedDate?.toISOString(),
          comment,
        });
      }
      return result;
    },
    // any: react-query types the error as unknown; the message is all we read here
    onError: (error: any) => {
      sendMessage({
        message: "Error creating expense",
        description: error.message,
      });
    },
    onSuccess: async (data) => {
      // data.doc should be the newly created document returned from Payload
      if (data) {
        console.log("Expense created successfully", data);
        // Refetch the month lists now so the expense list shows the new expense on arrival
        await queryClient.invalidateQueries({ queryKey: ["expenses"] });
        onSaved?.();
      }
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteExpense(existingDoc?.id || ""),
    onError: (error: Error) => {
      sendMessage({
        message: "Error deleting expense",
        description: error.message,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      onSaved?.();
    },
  });

  async function submit() {
    console.log("submit");

    saveMutation.mutate();
  }

  function remove() {
    deleteMutation.mutate();
  }

  return (
    <EditViewContext.Provider
      value={{
        amount,
        setAmount,
        selectedCategory,
        setSelectedCategory,
        allTags: availableTags || null,
        selectedTag,
        setSelectedTag,
        selectedDate,
        setSelectedDate,
        comment,
        setComment,
        submit,
        remove,
        isSaving,
        isDeleting: deleteMutation.isPending,
        isNew,
      }}
    >
      {children}
    </EditViewContext.Provider>
  );
};

export default EditViewController;
