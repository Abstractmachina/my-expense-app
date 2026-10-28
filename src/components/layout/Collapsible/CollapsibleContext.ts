import { createContext } from "react"


type CollapsibleElement = {
  id: string;
  open: boolean
}
type CollapsibleContextProps = {
  elements: CollapsibleElement[];
  register: (id: string, defaultOpen?: boolean) => void;
  unregister: (id: string) => void;
  toggle: (id: string) => void;
  setState: (id: string, open: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextProps | null>(null);

export { CollapsibleContext };
export type { CollapsibleContextProps, CollapsibleElement };