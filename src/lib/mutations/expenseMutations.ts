import { useMutation } from '@tanstack/react-query';

import { updateExpenses } from '@/lib/serverActions/expenseActions';

/**
 * Mutation for the batch "Change Category" update. Wraps the placeholder `updateExpenses`.
 *
 * @returns The react-query mutation object.
 */
export function useUpdateExpensesMutation() {
  return useMutation({
    mutationFn: (args: { where: Record<string, unknown>; data: Record<string, unknown> }) =>
      updateExpenses(args.where, args.data),
  });
}
