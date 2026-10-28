import { toast } from 'sonner-native';

type MessagePosition = 'top-center' | 'bottom-center' | 'center';

/**
 * Shows a toast message.
 *
 * @param {object} args - Message content and display options
 * @param {string} args.message - Toast title
 * @param {string} [args.description] - Optional second line
 * @param {MessagePosition} [args.position] - Where the toast appears
 * @param {number} [args.duration] - How long the toast stays, in milliseconds
 * @param {'info' | 'success' | 'warning' | 'error'} [args.variant] - Kept for callers; sonner-native does not use it here
 * @returns {void}
 * @throws {Error} When duration is negative
 */
const sendMessage = (args: {
  message: string;
  description?: string;
  position?: MessagePosition;
  duration?: number;
  variant?: 'info' | 'success' | 'warning' | 'error';
}) => {
  const { message, description, position, duration } = args;

  if (duration && duration <= 0) throw new Error('Duration must be greater than 0.');

  toast(message, {
    description: description,
    position: position,
    duration: duration,
  });
};

export { sendMessage };
export type { MessagePosition };
