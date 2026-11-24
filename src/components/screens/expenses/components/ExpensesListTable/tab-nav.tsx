import { TabsList, TabsTrigger } from "@/components/rnr/tabs";
import { ThemedText } from "@/components/styled-components/themed-text";
import { cn } from "@/util/ui";
import { View, Text } from "react-native";

type Props = {
  selectedTab: string;
};

const TabNav = ({selectedTab}: Props) => {
  return (
    <TabsList className="w-full gap-2 rounded-full">
      <TabsTrigger value="date">
        <ThemedText
          className={cn(selectedTab === "date" ? "text-bg-400" : "")}
        >By Date</ThemedText>
      </TabsTrigger>
      <TabsTrigger value="category">
        <ThemedText>By Category</ThemedText>
      </TabsTrigger>
      <TabsTrigger value="batch">
        <ThemedText>Batch Operations</ThemedText>
      </TabsTrigger>
    </TabsList>
  );
};

export default TabNav;
