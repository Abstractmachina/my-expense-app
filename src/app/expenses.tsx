import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import EditView from '@/components/expenses/_views/EditView';
import ExpensesListLoader from '@/components/expenses/_views/ListView';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type ExpensesTab = 'list' | 'new';

const TABS: { value: ExpensesTab; label: string }[] = [
  { value: 'list', label: 'List' },
  { value: 'new', label: 'New' },
];

/**
 * The Expenses screen: a title and two tabs, the monthly list and the new-expense form.
 *
 * @returns The screen element.
 */
export default function ExpensesScreen() {
  const [tab, setTab] = useState<ExpensesTab>('list');

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Expenses</ThemedText>

      <ThemedView type="backgroundElement" style={styles.tabBar}>
        {TABS.map(({ value, label }) => {
          const selected = tab === value;
          return (
            <Pressable
              key={value}
              onPress={() => setTab(value)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={[styles.tab, selected && styles.tabSelected]}>
              <ThemedText type="smallBold">{label}</ThemedText>
            </Pressable>
          );
        })}
      </ThemedView>

      {tab === 'list' ? (
        <ExpensesListLoader />
      ) : (
        <EditView onSaved={() => setTab('list')} onClose={() => setTab('list')} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: Spacing.three,
    padding: Spacing.one,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  tabSelected: {
    backgroundColor: 'rgba(127, 127, 127, 0.25)',
  },
});
