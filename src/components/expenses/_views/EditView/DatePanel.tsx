'use client';

import DatePicker from '@/components/inputs/DatePicker';
import Collapsible from '@/components/layout/Collapsible';
import React, { useContext, useMemo } from 'react';
import { EditViewContext } from './EditViewContext';
import Centered from '@/components/shadcn/Centered';
import { Text } from 'react-native';

type Props = {};

const DatePanel = (props: Props) => {
  const ctx = useContext(EditViewContext);

  function handleOnDateChange(date: Date | null) {
    ctx?.setSelectedDate(date);
  }

  const processedDate = useMemo<Date | null>(() => {
    return ctx?.selectedDate ? new Date(ctx.selectedDate) : null;
  }, [ctx?.selectedDate]);

  return (
    <Collapsible.Item>
      <Collapsible.Header className="flex justify-between">
        <Text>Date</Text> <Text>{processedDate?.toLocaleDateString() || ''}</Text>
      </Collapsible.Header>
      <Collapsible.Content>
        <Centered className="flex justify-center">
          <DatePicker value={ctx?.selectedDate} onChange={handleOnDateChange} />
        </Centered>
      </Collapsible.Content>
    </Collapsible.Item>
  );
};

export default DatePanel;
