import { useContext, useId } from "react";

import Collapsible from "@/components/layout/Collapsible";
import { CollapsibleContext } from "@/components/layout/Collapsible/CollapsibleContext";
import { ThemedText } from "@/components/styled-components/themed-text";
import {
  expenseCategoriesArray,
  ExpenseCategory,
} from "@/lib/types/expenseCategories";
import { chunkArray } from "@/util/arrays/chunkArray";
import PillList from "../../../../tables/pill-list";
import { EditViewContext } from "../EditViewContext";

const paginatedCategories = chunkArray<ExpenseCategory>(
  expenseCategoriesArray,
  9,
);

type Props = {};

const CategoriesPanel = (props: Props) => {
  const ctx = useContext(EditViewContext);
  const collapsible = useContext(CollapsibleContext);
  const id = useId();

  function handleSelectCategory(categoryValue: string) {
    const selectedCategory = expenseCategoriesArray.find(
      (cat) => cat.value === categoryValue,
    );
    ctx?.setSelectedCategory(selectedCategory || null);
    collapsible?.setState(id, false);
  }

  return (
    <Collapsible.Item id={id}>
      <Collapsible.Header className="flex flex-row justify-between items-center">
        <ThemedText type="h2">Category</ThemedText>
        <ThemedText type="description" numberOfLines={1}>
          {ctx?.selectedCategory?.label}
        </ThemedText>
      </Collapsible.Header>

      <Collapsible.Content>
        <PillList
          onSelect={handleSelectCategory}
          activeValue={ctx?.selectedCategory?.value}
          paginatedItems={paginatedCategories}
        />
      </Collapsible.Content>
    </Collapsible.Item>
  );
};

export default CategoriesPanel;
