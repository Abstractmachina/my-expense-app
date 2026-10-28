import { ExpenseTag } from "@/payload-types";


type ExpenseCategoryType = NonNullable<ExpenseTag['category']>[number];

type ExpenseCategory = {
  label: string;
  value: ExpenseCategoryType;
};

const expenseCategoriesArray : ExpenseCategory[] = [
  {
    label: 'Personal Recurring',
    value: 'personalRecurring',
  },
  {
    label: "Personal One-Off",
    value: 'personalOneOff',
  },
  {
    label: "Investments & Savings",
    value: 'investments',
  },
  {
    label: 'Taxes',
    value: 'taxes',
  },
  {
    label: 'Business',
    value: 'business',
  },
  {
    label: 'Food',
    value: 'food',
  },
  {
    label: 'Shelter',
    value: 'shelter',
  },
  {
    label: 'Transport',
    value: 'transport',
  },
  {
    label: 'Health',
    value: 'health',
  },
  {
    label: 'Fitness',
    value: 'fitness',
  },
  {
    label: 'Education',
    value: 'education',
  },
  {
    label: 'Wife',
    value: 'wife',
  },
  {
    label: 'Non-Essential',
    value: 'non-essential',
  },
];

const getExpenseCategory = (value: string) : ExpenseCategory | undefined => expenseCategoriesArray.find((category) => category.value === value);


export { expenseCategoriesArray, getExpenseCategory };
export type { ExpenseCategory };