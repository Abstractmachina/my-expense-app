import { View } from "react-native";
import { Fold } from "react-native-animated-spinkit";

// note: css import triggers error "module nt found". not clear why
// but required and works.

type Props = {
  size?: number;
  color?: string;
  animating?: boolean;
  hidesWhenStopped?: boolean;
  className?: string;
};

const Loader = ({
  size = 40,
  color = "white",
  animating = false,
  hidesWhenStopped = false,
  className,
}: Props) => {
  return (
    <View
      className={className}
      size={size}
      color={color}
      animating={animating}
      hidesWhenStopped={hidesWhenStopped}
    >
      <Fold size={48} color="#FFF" />
    </View>
  );
};

export default Loader;
