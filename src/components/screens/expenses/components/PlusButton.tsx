import { Plus } from "lucide-react-native";

import { cn } from "@/util/ui";
import { Button } from "@/components/rnr/button";
import { THEME } from "@/lib/theme";

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
      className={cn("size-12 items-center justify-center rounded-full bg-secondary-400", className)}
    >
      <Plus color={THEME.dark["bg-400"]} />
    </Button>
  );
};

export default PlusButton;
