'use client';

import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/shadcn/button';
import { useUpdateExpensesMutation } from '@/lib/mutations/expenseMutations';
import { Label } from '@/components/shadcn/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group';
import H3 from '@/components/style/H3';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateExpenses } from '@/lib/serverActions/expenseActions';
import { Expense } from '@/payload-types';
import { useExpenseTagsQuery } from '@/lib/queries/expenseTagsQueries';

const CATEGORIES = [
  'taxes',
  'personalRecurring',
  'personalOneOff',
  'investments',
  'business',
  'food',
  'shelter',
  'transport',
  'health',
  'fitness',
  'education',
  'wife',
  'non-essential',
] as const;

type Props = {};

const ChangeCategoryForm = (props: Props) => {
  const expenseTagsQuery = useExpenseTagsQuery();

  const [sourceType, setSourceType] = useState<'category' | 'tag'>('category');
  const [sourceCategory, setSourceCategory] = useState('');
  const [sourceTag, setSourceTag] = useState('');
  const [targetCategory, setTargetCategory] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    // any: the where/data shapes are Payload query objects, not typed here yet
    mutationFn: async (data: { where: any; data: any }) => {
      setIsProcessing(true);
      const result = await updateExpenses(data.where, data.data);
      return result.docs as Expense[];
    },
    onSuccess: async () => {
      console.log('Expenses updated successfully.');
      setSourceCategory('');
      setSourceTag('');
    },
    onSettled: () => {
      setIsProcessing(false);
      queryClient.invalidateQueries({ queryKey: ['expenses'] });

      // queryClient.refetchQueries({ queryKey: ["users", "me"] });
    },
  });

  async function handleOnClick() {
    if (sourceType === 'category') {
      if (!sourceCategory || !targetCategory) {
        console.error('Missing source or target category');
        return;
      }
      mutation.mutate({
        where: { category: { equals: sourceCategory } },
        data: { category: targetCategory },
      });
    }
    if (sourceType === 'tag') {
      if (!sourceTag || !targetCategory) {
        console.error('Missing source tag or target category');
        return;
      }
      mutation.mutate({
        where: { 'tag.name': { equals: sourceTag } },
        data: { category: targetCategory },
      });
    }
  }

  async function handleSelectType(value: string) {
    console.log('selected', value);
    setSourceType(value as 'category' | 'tag');
  }

  return (
    <View className="flex flex-col gap-4">
      <Text>{_processable(sourceType, sourceCategory, sourceTag, targetCategory).toString()}</Text>
      <View>
        <H3>Select Source Type</H3>
        <RadioGroup
          defaultValue="category"
          className="flex"
          value={sourceType}
          onValueChange={handleSelectType}
        >
          <View className="flex items-center gap-3">
            <RadioGroupItem value="category" id="r1" />
            <Label htmlFor="r1">Category</Label>
          </View>
          <View className="flex items-center gap-3">
            <RadioGroupItem value="tag" id="r1" />
            <Label htmlFor="r1">Tag</Label>
          </View>
        </RadioGroup>
      </View>

      {sourceType === 'category' && (
        <View>
          <Label>Source Category</Label>
          <Select
            onValueChange={(value: string) => {
              setSourceCategory(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </View>
      )}

      {sourceType === 'tag' && (
        <View>
          <Label>Source Tag</Label>
          <Select
            onValueChange={(value: string) => {
              setSourceTag(value);
            }}
            disabled={!expenseTagsQuery.isSuccess}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a tag" />
            </SelectTrigger>
            <SelectContent>
              {expenseTagsQuery.isSuccess &&
                expenseTagsQuery.data &&
                expenseTagsQuery?.data?.map((tag) => {
                  return (
                    <SelectItem key={tag.id} value={tag.name}>
                      {tag.name}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </View>
      )}

      <View>
        <Label>Target Category</Label>
        <Select
          onValueChange={(value: string) => {
            setTargetCategory(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectGroup> */}
            {/* <SelectLabel>Fruits</SelectLabel> */}
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
            {/* <SelectItem value="apple">Apple</SelectItem>
							<SelectItem value="banana">Banana</SelectItem>
							<SelectItem value="blueberry">Blueberry</SelectItem>
							<SelectItem value="grapes">Grapes</SelectItem>
							<SelectItem value="pineapple">Pineapple</SelectItem> */}
            {/* </SelectGroup> */}
          </SelectContent>
        </Select>
      </View>
      <Button
        onClick={handleOnClick}
        disabled={!_processable(sourceType, sourceCategory, sourceTag, targetCategory)}
      >
        {mutation.isPending ? 'Processing...' : 'Process'}
      </Button>
    </View>
  );
};

export default ChangeCategoryForm;

function _processable(
  sourceType: 'category' | 'tag',
  sourceCategory?: string,
  sourceTag?: string,
  targetCategory?: string,
): boolean {
  if (sourceType === 'category') {
    if (!sourceCategory || !targetCategory) {
      return false;
    }
  }
  if (sourceType === 'tag') {
    if (!sourceTag || !targetCategory) {
      console.error('Missing source tag or target category');
      return false;
    }
  }
  return true;
}
