import { useContext, useMemo } from "react";

import Collapsible from "@/components/layout/Collapsible";
import { ThemedText } from "@/components/styled-components/themed-text";
import PillList from "@/components/tables/pill-list";
import { chunkArray } from "@/util/arrays/chunkArray";
import { EditViewContext } from "./EditViewContext";

type Props = {};

const TagsPanel = ({}: Props) => {
  const ctx = useContext(EditViewContext);

  // PillList takes value/label items, so each tag is mapped to that shape when the tag list changes.
  const paginatedTags = useMemo(
    () =>
      chunkArray(
        (ctx?.allTags ?? []).map((tag) => ({ value: tag.id, label: tag.name })),
        9,
      ),
    [ctx?.allTags],
  );

  function handleSelectTag(tagId: string) {
    const selectedTag = ctx?.allTags?.find((tag) => tag.id === tagId);
    ctx?.setSelectedTag(selectedTag || null);
  }

  return (
    <Collapsible.Item>
      <Collapsible.Header className="flex flex-row justify-between items-center">
        <ThemedText type="h2">Tags</ThemedText>
        <ThemedText type="description" numberOfLines={1}>
          {ctx?.selectedTag?.name}
        </ThemedText>
      </Collapsible.Header>

      <Collapsible.Content>
        <PillList
          onSelect={handleSelectTag}
          activeValue={ctx?.selectedTag?.id}
          paginatedItems={paginatedTags}
        />
      </Collapsible.Content>
    </Collapsible.Item>
  );
};

export default TagsPanel;
