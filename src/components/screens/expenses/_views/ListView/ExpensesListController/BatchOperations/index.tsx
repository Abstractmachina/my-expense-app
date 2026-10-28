import { ThemedText } from "@/components/styled-components/themed-text";
import { View } from "react-native";
import ChangeCategoryForm from "./ChangeCategoryForm";

type Props = {};

const BatchOperationsPanel = (props: Props) => {
  return (
    <View>
      <ThemedText type="h1">Change Category</ThemedText>
      <ChangeCategoryForm />
    </View>
  );
};

export default BatchOperationsPanel;
