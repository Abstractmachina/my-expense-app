import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React, { PropsWithChildren } from 'react';

import { useExpenseTagsQuery } from '@/lib/queries/expenseTagsQueries';

/**
 * Wraps a hook in a fresh react-query client.
 *
 * @param props - The children to render inside the provider.
 * @returns The provider element.
 */
function wrapper({ children }: PropsWithChildren) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>;
}

describe('useExpenseTagsQuery', () => {
  it('resolves to an empty list until the endpoint exists', async () => {
    const { result } = renderHook(() => useExpenseTagsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});
