import { useContext, useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import { EditViewContext } from './EditViewContext';

type Props = {};

const AmountPanel = (props: Props) => {
  const ctx = useContext(EditViewContext);

  const [inputValue, setInputValue] = useState<string>(ctx?.amount?.toString() ?? '');


  function handleChange(val: string) {
    // Strictly limit to 2 decimals while typing
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setInputValue(val); // Save as STRING so "12.50" and "12." don't break
    }
  }

  function handleBlur() {
    // Commit the actual number to your context when they click away
    ctx?.setAmount(inputValue === "" ? null : Number(inputValue));

    // Optional: Auto-format to 2 decimals on blur (e.g., turn "12.5" into "12.50")
    if (inputValue !== "") {
      setInputValue(Number(inputValue).toFixed(2));
    }
  }

  return (
    <View className="flex justify-end items-end p-8 gap-4">
      <TextInput
        className="text-[8rem] w-full leading-tight h-40 text-right bg-transparent border-none"
        keyboardType="decimal-pad"
        value={inputValue}
        onChangeText={handleChange}
        onBlur={handleBlur}
        autoFocus
      />
      <View className="size-12 shrink-0 mb-7 border border-solid border-white rounded-full flex justify-center items-center text-2xl">
        <Text>&euro;</Text>
      </View>
    </View>
  );
};

export default AmountPanel;
