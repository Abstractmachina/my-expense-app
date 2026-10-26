/**
 * Placeholder for the Payload-generated types. Replace with the real generated file
 * once it is copied over from the Payload project.
 */

export interface ExpenseTag {
  id: string;
  name: string;
  category?: string[] | null;
}

export interface Expense {
  id?: string;
  amount?: number | null;
  category: string;
  tag?: string | ExpenseTag | null;
  date: string;
  comment?: string | null;
  updatedAt?: string;
}
