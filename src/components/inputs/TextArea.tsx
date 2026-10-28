import * as React from 'react';
import { TextInput } from 'react-native';
import { cn } from '@/util/ui';

type TextareaProps = React.ComponentProps<typeof TextInput>;

/**
 * Multiline text input that grows with its content, starting at `min-h-16`.
 *
 * shortcut: height is the raw contentSize, so padding is not added back; check on device for clipping, upgrade if seen.
 *
 * @param {TextareaProps} props - TextInput props, plus a NativeWind `className`
 * @returns {React.JSX.Element} The rendered input
 */
function Textarea({ className, style, editable, onContentSizeChange, ...props }: TextareaProps) {
  const [height, setHeight] = React.useState<number>();

  return (
    <TextInput
      multiline
      textAlignVertical="top"
      editable={editable}
      className={cn(
        'min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base text-foreground placeholder:text-muted-foreground dark:bg-input/30',
        editable === false && 'opacity-50',
        className,
      )}
      style={[{ height }, style]}
      onContentSizeChange={(event) => {
        setHeight(event.nativeEvent.contentSize.height);
        onContentSizeChange?.(event);
      }}
      {...props}
    />
  );
}

export { Textarea };
export type { TextareaProps };
