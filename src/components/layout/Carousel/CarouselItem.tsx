import { PropsWithChildren } from "react";
import { View } from "react-native";
import { useCarousel } from "./CarouselContext";

type Props = {
  className?: string;
};

/**
 * One carousel page, sized to the carousel width so paging lines up.
 *
 * @param {Props & PropsWithChildren} props - Page content, plus an optional `className`
 * @returns {JSX.Element} A View the width of one page
 */
const CarouselItem = ({ children, className = '' }: Props & PropsWithChildren) => {
  const { pageWidth } = useCarousel();

  return (
    <View style={{ width: pageWidth }} className={className}>
      {children}
    </View>
  );
};

export default CarouselItem;
