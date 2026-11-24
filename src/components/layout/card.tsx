import { PropsWithChildren } from "react";
import { ThemedView } from "../styled-components/themed-view";
import { cn } from "@/util/ui";

type Props = {
  className?: string;
  id?: string;
};

const Card = ({ className, children, ...props }: Props & PropsWithChildren) => {
  return (
    <ThemedView
      className={cn(
        "w-full bg-none p-4 rounded-2xl flex justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </ThemedView>
  );
};

export default Card;
