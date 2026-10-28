import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ExpensesListController from "./ExpensesListController";

const queryClient = new QueryClient();

export const ExpensesListView = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ExpensesListController />
    </QueryClientProvider>
  );
};

export default ExpensesListView;
