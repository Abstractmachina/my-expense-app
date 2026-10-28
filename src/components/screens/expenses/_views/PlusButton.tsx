import { Plus } from "lucide-react-native";

import { cn } from "@/util/ui";
import { Button } from "@/components/rnr/button";

type Props = {
  className?: string;
  onPress?: () => void;
};

/**
 * Round add button. The parent positions it with `className` (for example `absolute bottom-12 left-8`).
 *
 * @param props.className - Extra classes for positioning and layout.
 * @param props.onPress - Called when the button is tapped.
 * @returns The button element.
 */
const PlusButton = ({ className, onPress }: Props) => {
  return (
    <Button
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add expense"
      // Android draws elevation above siblings; zIndex alone does not do that there.
      style={{ elevation: 8 }}
      className={cn("size-16 items-center justify-center rounded-full bg-red-500", className)}
    >
      <Plus color="white" />
    </Button>
  );
};

export default PlusButton;
