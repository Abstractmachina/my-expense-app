import { Text, type TextProps } from "react-native";

import type { ThemeColor } from "@/constants/theme";
import { cn } from "@/util/ui";
import { PropsWithChildren } from "react";

type TextStyle =
  | "default"
  | "h1"
  | "h2"
  | "small"
  | "smallBold"
  | "link"
  | "linkPrimary"
  | "code";

export type ThemedTextProps = TextProps & {
  type?: TextStyle;
  themeColor?: ThemeColor;
};

const TYPE_CLASS: Record<NonNullable<ThemedTextProps["type"]>, string> = {
  default: "text-base font-medium leading-6",
  h1: "text-5xl font-semibold leading-[52px]",
  h2: "text-[32px] font-semibold leading-[44px]",
  small: "text-sm font-medium leading-5",
  smallBold: "text-sm font-bold leading-5",
  link: "text-sm leading-[30px]",
  linkPrimary: "text-sm leading-[30px] text-[#3c87f7]",
  code: "font-mono text-xs font-medium",
};

// The surface colors are not meant for text, so they fall back to the accent foreground.
const COLOR_CLASS: Record<ThemeColor, string> = {
  text: "text-foreground",
  textSecondary: "text-muted-foreground",
  background: "text-background",
  backgroundElement: "text-accent-foreground",
  backgroundSelected: "text-accent-foreground",
};

const ThemedText = ({
  type = "default",
  themeColor,
  className,
  children,
  ...rest
}: ThemedTextProps & PropsWithChildren) => {
  return (
    <Text
      className={cn(
        COLOR_CLASS[themeColor ?? "text"],
        TYPE_CLASS[type],
        className,
      )}
      {...rest}
    >
      {children}
    </Text>
  );
};

export {ThemedText};