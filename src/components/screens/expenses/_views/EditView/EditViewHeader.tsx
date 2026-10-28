import { Separator } from "@/components/rnr/separator";
import { ThemedText } from "@/components/styled-components/themed-text";
import { useContext } from "react";
import { View } from "react-native";
import CloseButton from "./CloseButton";
import { EditViewContext } from "./EditViewContext";
import SubmitButton from "./SubmitButton";

type Props = {
  onClose?: () => void;
};

const EditViewHeader = ({ onClose }: Props) => {
  const ctx = useContext(EditViewContext);

  return (
    <View>
      <View className="flex justify-between">
        <SubmitButton variant="small" />
        <ThemedText type="h2" className="text-2xl text-white flex items-center">
          {ctx?.isNew ? "Add new Expense" : "Edit Expense"}
        </ThemedText>
        <CloseButton variant="small" onPress={onClose} />
      </View>
      <Separator className="w-full bg-white" />
    </View>
  );
};

export default EditViewHeader;
