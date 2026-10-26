"use client";

import { Separator } from '@/components/shadcn/separator';
import H2 from '@/components/style/H2';
import { Check, X } from 'lucide-react';
import { EditViewContext } from './EditViewContext';
import { useContext } from 'react';
import { View } from 'react-native';
import SubmitButton from './SubmitButton';
import CloseButton from './CloseButton';

type Props = {
  onClose?: () => void;
};

const EditViewHeader = ({ onClose }: Props) => {
  const ctx = useContext(EditViewContext);

  return (
    <View>
      <View className="flex justify-between">
        <SubmitButton variant="small" />
        <H2 className="text-2xl text-white flex items-center">{ctx?.isNew ? 'Add new Expense' : 'Edit Expense'}</H2>
        <CloseButton variant="small" onPress={onClose} />
      </View>
      <Separator className="w-full bg-white" />
    </View>
  );
};

export default EditViewHeader;
