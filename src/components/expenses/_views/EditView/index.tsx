import React from 'react';

import CategoriesPanel from './CategoriesPanel';
import EditViewController from './EditViewController';
import TagsPanel from './TagsPanel';
import DatePanel from './DatePanel';
import CommentPanel from './CommentPanel';
import AmountPanel from './AmountPanel';
import SubmitButton from './SubmitButton';
import Providers from './Providers';
import Collapsible from '@/components/layout/Collapsible';
import { Expense } from '@/payload-types';
import EditViewHeader from './EditViewHeader';
import Centered from '@/components/shadcn/Centered';
import { View } from 'react-native';

type Props = {
  existingDoc?: Expense;
  onSaved?: () => void;
  onClose?: () => void;
};

export const EditView = ({ existingDoc, onSaved, onClose }: Props) => {
  const typedDoc = existingDoc;

  const componentKey = typedDoc?.id ? typedDoc.id : `new-${Date.now()}`;

    return (
      <Providers>
        <EditViewController existingDoc={typedDoc} onSaved={onSaved} key={componentKey}>

          <Centered>
            <View className="text-white flex flex-col h-full mytheme-primary-400">
              <EditViewHeader onClose={onClose} />
              <AmountPanel />
              <Collapsible>
                <CategoriesPanel />
                <TagsPanel />
                <DatePanel />
                <CommentPanel />
              </Collapsible>

              <Centered className="fixed bottom-0">
                <SubmitButton />
              </Centered>
            </View>
          </Centered>
        </EditViewController>
      </Providers>
    );

};

export default EditView;
