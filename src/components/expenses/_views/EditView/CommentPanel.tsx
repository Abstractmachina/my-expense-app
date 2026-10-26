'use client';

import { Textarea } from '@/components/inputs/TextArea';
import Collapsible from '@/components/layout/Collapsible';
import React, { useContext } from 'react';
import { EditViewContext } from './EditViewContext';

type Props = {};

const CommentPanel = (props: Props) => {
  const ctx = useContext(EditViewContext);

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    ctx?.setComment(event.target.value);
  }
  return (
    <Collapsible.Item>
      <Collapsible.Header className="flex justify-start">Comment</Collapsible.Header>
      <Collapsible.Content>
        <Textarea
          className="w-full min-h-20"
          value={ctx?.comment || undefined}
          onChange={handleChange}
        />
      </Collapsible.Content>
    </Collapsible.Item>
  );
};

export default CommentPanel;
