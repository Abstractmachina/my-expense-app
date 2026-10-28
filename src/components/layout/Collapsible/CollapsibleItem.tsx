import React, { createContext, useContext, useEffect, useId, PropsWithChildren } from 'react';
import { View } from 'react-native';
import { CollapsibleContext } from './CollapsibleContext';

type ItemContextProps = {
  isOpen: boolean;
  toggle: () => void;
};

export const CollapsibleItemContext = createContext<ItemContextProps | null>(null);

export const useCollapsibleItem = () => {
  const context = useContext(CollapsibleItemContext);
  if (!context) {
    throw new Error("Collapsible components must be used within a Collapsible.Item");
  }
  return context;
};

type Props = {
  defaultOpen?: boolean;
  className?: string;
};

const CollapsibleItem = ({ children, defaultOpen = false, className }: PropsWithChildren<Props>) => {
  const rootContext = useContext(CollapsibleContext);
  const id = useId();

  if (!rootContext) {
    throw new Error("CollapsibleItem must be used within a CollapsibleProvider");
  }

  // 1. Destructure the stable functions out of the context
  const { register, unregister, elements, toggle } = rootContext;

  useEffect(() => {
    register(id, defaultOpen);
    return () => unregister(id);
  }, [id, register, unregister, defaultOpen]);

  const currentElement = rootContext.elements.find((el) => el.id === id);
  const isOpen = currentElement?.open ?? false;

  const itemContextValue = {
    isOpen,
    toggle: () => rootContext.toggle(id),
  };

  return (
    <CollapsibleItemContext.Provider value={itemContextValue}>
      <View className={className}>
        {children}
      </View>
    </CollapsibleItemContext.Provider>
  );
};

export default CollapsibleItem;