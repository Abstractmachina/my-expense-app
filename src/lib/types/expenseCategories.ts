import { ExpenseTag } from "@/payload-types";

type ExpenseCategoryType = NonNullable<ExpenseTag["category"]>[number];

type ExpenseCategory = {
  label: string;
  value: ExpenseCategoryType;
};

const expenseCategoriesArray: ExpenseCategory[] = [
  {
    label: "Personal Recurring",
    value: "personalRecurring",
  },
  {
    label: "Personal One-Off",
    value: "personalOneOff",
  },
  {
    label: "Investments",
    value: "investments",
  },
  {
    label: "Taxes",
    value: "taxes",
  },
  {
    label: "Business",
    value: "business",
  },
];

const getExpenseCategory = (value: string): ExpenseCategory | undefined =>
  expenseCategoriesArray.find((category) => category.value === value);

export { expenseCategoriesArray, getExpenseCategory };
export type { ExpenseCategory };
