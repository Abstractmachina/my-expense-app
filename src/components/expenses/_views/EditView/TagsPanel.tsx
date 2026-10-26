'use client';

import Collapsible from '@/components/layout/Collapsible';
import React, { useContext, useMemo } from 'react';
import { Pressable, Text } from 'react-native';
import { EditViewContext } from './EditViewContext';
import { ExpenseTag } from '@/payload-types';
import { chunkArray } from '@/utilities/arrays/chunkArray';
import Carousel from '@/components/layout/Carousel';
import { cn } from '@/utilities/ui';

type Props = {
};

const TagsPanel = ({ }: Props) => {

  const ctx = useContext(EditViewContext);

  const paginatedTags = useMemo<ExpenseTag[][]>(() => {
    if (!ctx?.allTags) return [];

    return chunkArray(ctx?.allTags, 9);
  }, [ctx?.allTags]);



  const handleSelectTag = (tag: ExpenseTag) => {
    ctx?.setSelectedTag(tag);
  };


  return (
    <Collapsible.Item>
      <Collapsible.Header className="flex justify-between">
        <Text>Tags</Text> <Text>{ctx?.selectedTag?.name}</Text>
      </Collapsible.Header>
      <Collapsible.Content className="">

        <Carousel>
          <Carousel.Content className="w-full">
            {paginatedTags.map((page, pageIndex) => (
              <Carousel.Item
                key={pageIndex}
                className="w-full flex-shrink-0 snap-start grid grid-cols-3 grid-rows-3 gap-3 px-4"
              >
                {/* 4. Inner Map: The Buttons on this specific slide */}
                {page.map((tag) => (
                  <Pressable
                    key={tag.id}
                    className={cn(
                      'px-4 py-2 bg-neutral-800 text-white border border-white/50 rounded-full hover:bg-white/20 whitespace-nowrap',
                      ctx?.selectedTag?.id === tag.id &&
                        'bg-red-800 active:bg-red-600 hover:bg-red-800',
                    )}
                    onPress={() => handleSelectTag(tag)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: ctx?.selectedTag?.id === tag.id }}
                  >
                    <Text>{tag.name}</Text>
                  </Pressable>
                ))}
              </Carousel.Item>
            ))}
          </Carousel.Content>
          <Carousel.Dots />
        </Carousel>

      </Collapsible.Content>
    </Collapsible.Item>
  );
};

export default TagsPanel;
