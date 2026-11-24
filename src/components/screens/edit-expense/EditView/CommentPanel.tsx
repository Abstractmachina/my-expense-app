import { Textarea } from '@/components/inputs/TextArea';
import Collapsible from '@/components/layout/Collapsible';
import React, { useContext } from 'react';
import { MessageSquareText } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { ThemedText } from '@/components/styled-components/themed-text';
import { Button } from '@/components/rnr/button';
import { Text } from '@/components/rnr/text';
import { EditViewContext } from './EditViewContext';

type Props = {};

const CommentPanel = (props: Props) => {
  const ctx = useContext(EditViewContext);
  const hasComment = !!ctx?.comment?.trim();

  return (
    <Collapsible.Item>
      <Collapsible.Header className="flex flex-row justify-between items-center">
        <ThemedText type="h2">Comment</ThemedText>
        {hasComment && (
          <MessageSquareText
            testID="comment-has-content"
            size={20}
            color={THEME.dark['fg-400']}
          />
        )}
      </Collapsible.Header>
      <Collapsible.Content>
        <Textarea
          accessibilityLabel="Comment"
          className="w-full min-h-20"
          value={ctx?.comment || undefined}
          onChangeText={(text) => ctx?.setComment(text)}
        />
        <Button
          variant="outline"
          size="sm"
          className="mt-2 self-end"
          disabled={!hasComment}
          onPress={() => ctx?.setComment(null)}
        >
          <Text>Clear</Text>
        </Button>
        
      </Collapsible.Content>
    </Collapsible.Item>
  );
};

export default CommentPanel;
