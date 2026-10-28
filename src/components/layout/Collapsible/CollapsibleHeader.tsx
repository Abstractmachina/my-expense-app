import React, { PropsWithChildren } from 'react';
import { Pressable } from 'react-native';
import { useCollapsibleItem } from './CollapsibleItem';
import { cn } from '@/util/ui';

type Props = {
  className?: string;
};

const CollapsibleHeader = ({ children, className }: PropsWithChildren<Props>) => {
  const { toggle, isOpen } = useCollapsibleItem();

  return (
    <Pressable
      onPress={toggle}
      className={cn(
        'bg-zinc-800 w-full border-none px-8 py-4 m-0 text-xl font-bold',
        className)}
      accessibilityRole="button"
      accessibilityState={{ expanded: isOpen }}
    >
      {children}
    </Pressable>
  );
};

export default CollapsibleHeader;
