import { Button } from '@/components/rnr/button';
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
        'w-full flex justify-center p-8 hover:cursor-pointer rounded-none border-none',
        variant === 'small' && 'w-auto p-8 bg-my-bg-800 hover:bg-my-bg-700',
        className,
      )}
      // onClick={handleSubmit}
      // disabled={ctx?.isSaving}
    >
      {false ? <Loader size={23} /> : <X />}
    </Button>
  )
}

export default CloseButton;
