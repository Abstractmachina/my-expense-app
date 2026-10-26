import { Button } from '@/components/shadcn/button';
import { cn } from '@/util/ui';
import { Plus } from 'lucide-react-native';
import { Link } from 'expo-router';

type Props = {
  className?: string;
  href?: string;
};

const PlusButton = ({ className, href }: Props) => {
  return (
    <Button asChild className={cn('absolute size-16 rounded-full', className)}>
      <Link href={href || '#'}>
        <Plus />
      </Link>
    </Button>
  );
};

export default PlusButton;
