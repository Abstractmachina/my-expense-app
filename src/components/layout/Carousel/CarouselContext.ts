import { ComponentRef, createContext, useContext } from "react"
import type { ScrollView } from "react-native";


type CarouselContextProps = {
  activeIndex: number;
  setActiveIndex: (val:number) => void;
  scrollRef: React.RefObject<ComponentRef<typeof ScrollView> | null>;
  pageWidth: number;
  setPageWidth: (val:number) => void;
  pageCount: number;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
  scrollTo: (index: number) => void;
}

const CarouselContext = createContext<CarouselContextProps | null>(null);

const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("Carousel components must be used within a <Carousel>");
  return context;
};

export { CarouselContext, useCarousel };
export type { CarouselContextProps };
