import { View, Pressable } from "react-native";
import { cn } from "@/util/ui";

type Props<T> = {
  onPress?: (index:number) => void;
  items: T[];
  activeIndex: number;
}

const IndicatorDots = <T,>({ items, onPress, activeIndex }: Props<T>) => {
  
  // 
  if (items.length <= 1) return null;

  return (
    <View className="flex flex-row justify-center items-center gap-2 h-4">
      {items.map((_, index) => (
        <Pressable
          key={index}
          onPress={() => { onPress?.(index) }}
          className={cn(
            "appearance-none size-2 rounded-full shrink-0 transition-all duration-300 border-none p-0 m-0 opacity-75 bg-white/40",
            activeIndex === index
            && "bg-white" // Active state (a wider pill shape looks modern)
          )}
          accessibilityRole="button"
          accessibilityLabel={`Go to page ${index + 1}`}
        />
      ))}
    </View>
  );
};

export default IndicatorDots;
