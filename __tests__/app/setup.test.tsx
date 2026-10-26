import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

import { ApiKeySavedContext } from '@/auth/api-key-context';
import { verifyApiKey } from '@/auth/payload';
import SetupScreen from '@/app/setup';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/auth/payload', () => ({
  verifyApiKey: jest.fn(),
}));

/**
 * Renders the setup screen inside the API-key-saved context.
 *
 * @param onKeySaved - Callback passed to the context, standing in for the root layout.
 * @returns The render result from `@testing-library/react-native`.
 */
function renderSetup(onKeySaved: () => void) {
  return render(
    <ApiKeySavedContext.Provider value={onKeySaved}>
      <SetupScreen />
    </ApiKeySavedContext.Provider>
  );
}

describe('SetupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores the key and notifies the layout when the backend accepts it', async () => {
    (verifyApiKey as jest.Mock).mockResolvedValue(true);
    const onKeySaved = jest.fn();
    await renderSetup(onKeySaved);

    await fireEvent.changeText(screen.getByPlaceholderText('Paste API Key here...'), '  secret  ');
    await fireEvent.press(screen.getByText('Save & Enter App'));

    await waitFor(() => expect(onKeySaved).toHaveBeenCalledTimes(1));
    expect(verifyApiKey).toHaveBeenCalledWith('secret');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('payload_api_key', 'secret');
  });

  it('does not store the key when the backend rejects it', async () => {
    (verifyApiKey as jest.Mock).mockResolvedValue(false);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const onKeySaved = jest.fn();
    await renderSetup(onKeySaved);

    await fireEvent.changeText(screen.getByPlaceholderText('Paste API Key here...'), 'wrong');
    await fireEvent.press(screen.getByText('Save & Enter App'));

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Invalid key', expect.any(String)));
    expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
    expect(onKeySaved).not.toHaveBeenCalled();
  });
});
