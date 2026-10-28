import DatePicker from '@/components/inputs/DatePicker';
import Collapsible from '@/components/layout/Collapsible';
import { useContext, useMemo } from 'react';
import { EditViewContext } from './EditViewContext';
import { Text, View } from 'react-native';

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
        <View className="flex justify-center">
          <DatePicker value={ctx?.selectedDate} onChange={handleOnDateChange} />
        </View>
      </Collapsible.Content>
    </Collapsible.Item>
  );
};

export default DatePanel;
