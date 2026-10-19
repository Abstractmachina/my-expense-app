import { createContext, useContext } from 'react';

/** Lets the setup screen tell the root layout a key was saved, so the gate switches without a restart. */
export const ApiKeySavedContext = createContext<() => void>(() => {});

/**
 * Returns the callback to call once an API key has been stored.
 *
 * @returns A function that notifies the root layout.
 */
export function useApiKeySaved(): () => void {
  return useContext(ApiKeySavedContext);
}
