import { PropsWithChildren } from "react";
import { ThemedView } from "../styled-components/themed-view";
import { cn } from "@/util/ui";

type Props = {
  className?: string;
};

const Card = ({ className, children }: Props & PropsWithChildren) => {
  return (
    <ThemedView
      className={cn(
        "w-full bg-zinc-400 bg-opacity-25 p-8 rounded-md flex justify-center",
        className,
      )}
    >
      {children}
    </ThemedView>
  );
};

export default Card;
