import { Pressable } from "react-native";
import { ThemedText } from "@/components/styled-components/themed-text";
import { cn } from "@/util/ui";
import { PropsWithChildren } from "react";

type Props = {
  isActive?: boolean;
  onPress?: () => void;
  className?: string;
};

const PillButton = ({ onPress, isActive, className , children}: Props & PropsWithChildren) => {
  return (
    <Pressable
      className={cn(
        "grow px-4 py-2 bg-bg-500 text-primary-300 border border-fg-300 rounded-full whitespace-nowrap flex flex-row justify-center text-nowrap",
        isActive && " bg-primary-400 active:bg-primary-300",
        className,
      )}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{
        selected: isActive,
      }}
    >
      <ThemedText type="description" numberOfLines={1}>
        {children}
      </ThemedText>
    </Pressable>
  );
};

export default PillButton;
