import { View, type ViewProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { cn } from '@/util/ui';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
  className?: string;
};

const BACKGROUND_CLASS: Record<ThemeColor, string> = {
  text: 'bg-foreground',
  textSecondary: 'bg-muted-foreground',
  background: 'bg-background',
  backgroundElement: 'bg-secondary',
  backgroundSelected: 'bg-muted',
};

export function ThemedView({ style, lightColor, darkColor, type, className, ...otherProps }: ThemedViewProps) {
  return (
    <View className={cn(BACKGROUND_CLASS[type ?? 'background'], className)} style={style} {...otherProps} />
  );
}
