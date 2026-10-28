import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import CollapsibleProvider from './CollapsibleProvider';
import CollapsibleItem from './CollapsibleItem';
import CollapsibleHeader from './CollapsibleHeader';
import CollapsibleContent from './CollapsibleContent';


type Props = {
  className?: string
}

const Collapsible = ({className, children}:Props & PropsWithChildren) => {
  return (
    <View className={className}>
      <CollapsibleProvider>{children}</CollapsibleProvider>
    </View>
  )
}

Collapsible.Item = CollapsibleItem;
Collapsible.Header = CollapsibleHeader;
Collapsible.Content = CollapsibleContent;

export default Collapsible;
