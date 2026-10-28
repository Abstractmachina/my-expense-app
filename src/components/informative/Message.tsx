import { View } from "react-native";
import { ThemedText } from "../styled-components/themed-text";

type Props = {};

const Message = (props: Props) => {
  return (
    <View>
      <ThemedText>Message</ThemedText>
    </View>
  );
};

export default Message;
