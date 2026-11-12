import { Separator } from "@/components/rnr/separator";
import { ThemedText } from "@/components/styled-components/themed-text";
import { useContext } from "react";
import { View } from "react-native";
import CloseButton from "./CloseButton";
import { EditViewContext } from "./EditViewContext";
import SubmitButton from "./SubmitButton";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onClose?: () => void;
};

const EditViewHeader = ({ onClose }: Props) => {
  const ctx = useContext(EditViewContext);

  return (
    <SafeAreaView>
      <View className="flex flex-row justify-between items-center">
        <SubmitButton variant="small" />
        <ThemedText type="h1" className="text-2xl text-white flex items-center">
          {ctx?.isNew ? "Add new Expense" : "Edit Expense"}
        </ThemedText>
        <CloseButton variant="small" onPress={onClose} />
      </View>
      <Separator className="w-full bg-white" />
    </SafeAreaView>
  );
};

export default EditViewHeader;
