import { toast } from 'sonner-native';

import { sendMessage } from '@/components/informative/sendMessage';

jest.mock('sonner-native', () => ({ toast: jest.fn() }));

describe('sendMessage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows the message with its description, position and duration', () => {
    sendMessage({ message: 'Saved', description: 'Lunch', position: 'bottom-center', duration: 3000 });

    expect(toast).toHaveBeenCalledWith('Saved', {
      description: 'Lunch',
      position: 'bottom-center',
      duration: 3000,
    });
  });

  it('throws when duration is negative', () => {
    expect(() => sendMessage({ message: 'Saved', duration: -1 })).toThrow('Duration must be greater than 0.');
    expect(toast).not.toHaveBeenCalled();
  });
});
