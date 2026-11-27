import { Alert } from "react-native";
import { Trash2 } from "lucide-react-native";
import { useContext } from "react";
import { EditViewContext } from "./EditViewContext";
import Loader from "@/components/animated/Loader";
import { cn } from "@/util/ui";
import { Button } from "@/components/rnr/button";
import { THEME } from "@/lib/theme";

type Props = {
  className?: string;
};

/**
 * Delete button for an existing expense. Asks for confirmation before deleting. Hidden for new expenses.
 *
 * @param props - Optional extra class names for the button.
 * @returns The button, or null when adding a new expense.
 */
const DeleteButton = ({ className }: Props) => {
  const ctx = useContext(EditViewContext);

  if (!ctx || ctx.isNew) return null;

  function handleDelete() {
    Alert.alert("Delete expense?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => ctx?.remove() },
    ]);
  }

  return (
    <Button
      className={cn(
        "flex justify-center p-8 hover:cursor-pointer rounded-none border-none bg-bg-500",
        className,
      )}
      onPress={handleDelete}
      disabled={ctx.isDeleting || ctx.isSaving}
    >
      {ctx.isDeleting ? <Loader size={12} /> : <Trash2 color={THEME.dark["fg-400"]} />}
    </Button>
  );
};

export default DeleteButton;
