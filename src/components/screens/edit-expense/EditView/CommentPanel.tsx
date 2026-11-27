import { Textarea } from '@/components/inputs/TextArea';
import { MessageSquareText } from 'lucide-react-native';
import { useContext, useRef, useState } from 'react';
import { Modal, Pressable, View, type TextInputInstance } from 'react-native';
import { THEME } from '@/lib/theme';
import { ThemedText } from '@/components/styled-components/themed-text';
import { Button } from '@/components/rnr/button';
import { Text } from '@/components/rnr/text';
import { cn } from '@/util/ui';
import { EditViewContext } from './EditViewContext';

type Props = {};

/**
 * Comment row for the edit form. Tapping it opens a popup with the comment input.
 *
 * @param props - No props.
 * @returns The row and the comment popup.
 */
const CommentPanel = (props: Props) => {
  const ctx = useContext(EditViewContext);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<TextInputInstance>(null);
  const hasComment = !!ctx?.comment?.trim();

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        className={cn(
          'bg-zinc-800 w-full border-none px-8 py-4 m-0 text-xl font-bold',
          'flex flex-row justify-between items-center',
        )}
        accessibilityRole="button"
      >
        <ThemedText type="h2">Comment</ThemedText>
        <View className="flex flex-row items-center gap-2 shrink">
          {hasComment && (
            <MessageSquareText
              testID="comment-has-content"
              size={20}
              color={THEME.dark['fg-400']}
            />
          )}
          <ThemedText type="description" numberOfLines={1}>
            {ctx?.comment ?? ''}
          </ThemedText>
        </View>
      </Pressable>

      {/* Anchored to the top so the input stays above the keyboard. Focus waits for onShow:
          autoFocus fires while the modal is still animating in, and the keyboard does not open. */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        // shortcut: 100ms delay so the focus lands after the modal's first frame; upgrade if it still misses on a device
        onShow={() => {
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-start bg-black/40 pt-24 px-4">
          <View className="bg-zinc-800 p-4 gap-3">
            <Textarea
              ref={inputRef}
              accessibilityLabel="Comment"
              multiline={false}
              returnKeyType="done"
              onSubmitEditing={() => setIsOpen(false)}
              className="w-full min-h-0 h-10"
              value={ctx?.comment || undefined}
              onChangeText={(text) => ctx?.setComment(text)}
            />
            <View className="flex flex-row justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={!hasComment}
                onPress={() => ctx?.setComment(null)}
              >
                <Text>Clear</Text>
              </Button>
              <Button size="sm" onPress={() => setIsOpen(false)}>
                <Text>Done</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CommentPanel;
