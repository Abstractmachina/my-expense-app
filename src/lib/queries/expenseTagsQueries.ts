import { useQuery } from '@tanstack/react-query';

import type { ExpenseTag } from '@/payload-types';

/**
 * Loads all expense tags. Placeholder: returns an empty list until the endpoint exists.
 *
 * @returns The react-query result holding the tags.
 */
export function useExpenseTagsQuery() {
  return useQuery<ExpenseTag[]>({
    queryKey: ['expenseTags'],
    // shortcut: returns [] instead of calling Payload, replace with the real fetch once the endpoint exists
    queryFn: async () => [],
  });
}
