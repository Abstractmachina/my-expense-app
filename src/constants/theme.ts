/**
 * Layout constants. Colors come from the CSS variables in src/global.css, used through Tailwind classes.
 */

import { Platform } from 'react-native';

/** Named surface and text colors. Each one maps to a Tailwind class in the theme-aware components. */
export type ThemeColor = 'text' | 'textSecondary' | 'background' | 'backgroundElement' | 'backgroundSelected';

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
