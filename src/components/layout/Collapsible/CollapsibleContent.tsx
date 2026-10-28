import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useCollapsibleItem } from './CollapsibleItem';
import { cn } from '@/util/ui';

type Props = {
  className?: string;
};

const CollapsibleContent = ({ children, className }: PropsWithChildren<Props>) => {
  const { isOpen } = useCollapsibleItem();

  if (!isOpen) return null;

  return (
    <View className={cn("py-4 px-8", className)}>
      {children}
    </View>
  );
};

export default CollapsibleContent;
