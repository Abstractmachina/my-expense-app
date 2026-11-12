import { Button } from '@/components/rnr/button';
import { THEME } from '@/lib/theme';
import { cn } from '@/util/ui';
import { Loader, X } from 'lucide-react-native';


type Props = {
  className?: string;
  variant?: "small";
  onPress?: () => void;
}

const CloseButton = ({className, variant, onPress}:Props) => {



  return (
    <Button
      onPress={onPress}
      className={cn(
        'flex justify-center p-8 hover:cursor-pointer rounded-none border-none',
        variant === 'small' && 'p-8 bg-',
        className,
      )}
      // onClick={handleSubmit}
      // disabled={ctx?.isSaving}
    >
      {false ? <Loader size={23} /> : <X color={THEME.dark['fg-800']} />}
    </Button>
  )
}

export default CloseButton;
