import { createContext } from "react"
import { ExpenseCategory } from "../../_types/expenseCategories";
import { ExpenseTag } from "@/payload-types";


type EditViewContextProps = {
  amount: number | null;
  setAmount: (amount: number | null) => void;
  selectedCategory: ExpenseCategory | null;
  setSelectedCategory: (category: ExpenseCategory | null) => void;
  selectedTag: ExpenseTag | null;
  setSelectedTag: (tag: ExpenseTag | null) => void;
  allTags: ExpenseTag[] | null;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  comment: string | null;
  setComment: (comment: string | null) => void;
  submit: () => void;
  isSaving?: boolean;
  isNew?: boolean;
}

const EditViewContext = createContext<EditViewContextProps | null>(null);

export { EditViewContext };
export type { EditViewContextProps };