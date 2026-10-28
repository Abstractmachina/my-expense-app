import React, { useEffect, useMemo, useState } from 'react';

import { Expense, ExpenseTag } from '@/payload-types';

import ExpensesListTable from './ExpensesListTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/rnr/tabs';
import { formatDateTime, isEqualToformattedDates } from '@/util/formatDateTime';
import { getTotal } from '@/util/math/getTotal';
import Loader from '@/components/animated/Loader';
import ControlPanel from './ControlPanel';
import BatchOperationsPanel from './BatchOperations';
import { useExpensesQuery } from '@/lib/queries/expensesQueries';
import { useExpenseTagsQuery } from '@/lib/queries/expenseTagsQueries';
import { Text, View } from 'react-native';


type Props = {};

const ExpensesListController = ({}: Props) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedTab, setSelectedTab] = useState<string>('date');

  const expensesQuery = useExpensesQuery(selectedYear, selectedMonth);
  const expenseTagsQuery = useExpenseTagsQuery();
  const [loading, setLoading] = useState(
    expensesQuery.data && expenseTagsQuery.data ? false : true,
  );

  useEffect(() => {
    if (expensesQuery.data && expenseTagsQuery.data) setLoading(false);
    else setLoading(true);
  }, [expensesQuery.data, expenseTagsQuery.data]);

  const sortedExpensesByDate = useMemo<Map<string, Expense[]> | undefined>(() => {
    if (selectedTab === 'category') return undefined;

    const results =
      expensesQuery.data && expenseTagsQuery.data
        ? _orderExpensesByDay(expensesQuery.data, expenseTagsQuery.data)
        : undefined;
    setLoading(false);
    return results;
  }, [expensesQuery.data, expenseTagsQuery.data, selectedTab]);

  const sortedExpensesByCategory = useMemo<Map<string, Map<string, Expense[]>> | undefined>(() => {
    if (selectedTab === 'date') return undefined;

    const results = expensesQuery.data ? _sortExpensesByCategory(expensesQuery.data) : undefined;
    setLoading(false);
    return results;
  }, [expensesQuery.data, selectedTab]);

  return (
    <>
      <View className="relative h-full px-4 sm:px-0">
        <Text className="mb-8">Expenses</Text>
        <ControlPanel
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <Tabs value={selectedTab} className="" onValueChange={(value: string) => setSelectedTab(value)}>
          <TabsList className="w-full gap-2">
            <TabsTrigger value="date">By Date</TabsTrigger>
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="batch">Batch Operations</TabsTrigger>
          </TabsList>
          <TabsContent value="date">
            {loading ? (
              <View className="w-full h-96 flex justify-center items-center">
                <Loader />
              </View>
            ) : (
              <ExpensesListTable
                expensesByDate={sortedExpensesByDate}
                expensesByCategory={sortedExpensesByCategory}
                sortBy={'date'}
              />
            )}
          </TabsContent>
          <TabsContent value="category">
            {loading ? (
              <Text>... Loading ...</Text>
            ) : (
              <ExpensesListTable
                expensesByDate={sortedExpensesByDate}
                expensesByCategory={sortedExpensesByCategory}
                sortBy={'category'}
              />
            )}
          </TabsContent>
          <TabsContent value="batch">
            <BatchOperationsPanel />
          </TabsContent>
        </Tabs>
      </View>
    </>
  );
};

export default ExpensesListController;

function _orderExpensesByDay(input: Expense[], tags: ExpenseTag[]) {
  const output = new Map<string, Expense[]>();

  for (let i = 0; i < input.length; i++) {
    let expense = input[i];
    if (!expense) continue;

    if (typeof expense.tag === 'string') {
      // fetch full document.
      const fullTag = tags.find((tag) => tag.id === expense?.tag);
      if (fullTag) expense = { ...expense, tag: fullTag };
    }
    // this compares the date as a string.
    // // so wont necessarily match the same day.
    const current = _getExpensesByDate(output, expense.date);
    if (current) {
      output.set(formatDateTime(expense.date, true), [...current, expense]);
    } else {
      output.set(formatDateTime(expense.date, true), [expense]);
    }
  }

  const sortedMap = new Map([...output.entries()].sort().reverse());
  return sortedMap;
}

function _getExpensesByDate(map: Map<string, Expense[]>, date: string): Expense[] | undefined {
  for (const k of map.keys()) {
    const equal = isEqualToformattedDates(date, k);
    if (equal) return map.get(k);
  }
}

function _sortExpensesByCategory(input: Expense[]): Map<string, Map<string, Expense[]>> {
  const output = new Map<string, Map<string, Expense[]>>();

  for (let i = 0; i < input.length; i++) {
    const expense = input[i];
    if (!expense) continue;
    const hasTag =
      typeof expense.tag !== 'string' && expense.tag !== null && expense.tag !== undefined;
    const tag = hasTag ? (expense.tag as ExpenseTag).name : 'Untagged';

    // sort expenses into map
    const foundCategoryMap = _getExpensesByCategory(output, expense.category);
    if (foundCategoryMap) {
      const foundTagArray = _getExpensesByTag(
        foundCategoryMap,
        (expense.tag as ExpenseTag)?.name || '',
      );
      if (foundTagArray) {
        // category exists, tag exists.
        foundCategoryMap.set(tag, [...foundTagArray, expense]);
      } else {
        // category exists, tag does not exist => create new array
        foundCategoryMap.set(tag, [expense]);
      }
    } else {
      //category does not exist => create new category map and new tag array.

      output.set(expense.category, new Map<string, Expense[]>([[tag, [expense]]]));
    }
  }

  // sort map by total amount descending.
  // get each category as array [key, value][]
  let categoryArray = Array.from(output);

  // for each category, get each tag as array [key, value][]
  // sort each category by total amount descending as well

  categoryArray = categoryArray.map((group) => {
    const sortedTagArray = Array.from(group[1]).sort((a, b) => {
      const totalA = getTotal(a[1].map((doc: Expense) => doc.amount || 0));
      const totalB = getTotal(b[1].map((doc: Expense) => doc.amount || 0));
      return totalB - totalA;
    });
    return [group[0], new Map<string, Expense[]>(sortedTagArray)];
  });
  const sortedCategoryArray = categoryArray.sort((a, b) => {
    const tagArrayA = Array.from(a[1]);
    const totalA: number = tagArrayA.reduce((acc, curr) => {
      const subTotal = getTotal(curr[1].map((doc: Expense) => doc.amount || 0));
      return acc + subTotal;
    }, 0);
    const tagArrayB = Array.from(b[1]);
    const totalB: number = tagArrayB.reduce((acc, curr) => {
      const subTotal = getTotal(curr[1].map((doc: Expense) => doc.amount || 0));
      return acc + subTotal;
    }, 0);
    return totalB - totalA;
  });

  return new Map(sortedCategoryArray);
}

/***
 *
 */
function _getExpensesByCategory(
  map: Map<string, Map<string, Expense[]>>,
  category: string,
): Map<string, Expense[]> | undefined {
  for (const k of map.keys()) {
    if (k === category) return map.get(k);
  }
}

function _getExpensesByTag(map: Map<string, Expense[]>, tag: string): Expense[] | undefined {
  for (const k of map.keys()) {
    if (k === tag) return map.get(k);
  }
}
