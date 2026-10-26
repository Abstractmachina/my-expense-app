import Centered from '@/components/shadcn/Centered';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';

type Props = {};

const CenteredOverlay = ({ children }: Props & PropsWithChildren) => {
  return (
    <View className="fixed top-0 left-0 right-0 bottom-0 h-screen bg-transparent pointer-events-none">
      <Centered className="relative h-full ">{children}</Centered>
    </View>
  );
};

export default CenteredOverlay;
