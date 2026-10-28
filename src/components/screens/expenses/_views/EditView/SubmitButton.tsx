import { Check } from 'lucide-react-native';
import { useContext } from 'react';
import { EditViewContext } from './EditViewContext';
import Loader from '@/components/animated/Loader';
import { cn } from '@/util/ui';
import { Button } from '@/components/rnr/button';

type Props = {
  className?: string;
  variant?: 'small';
};

const SubmitButton = ({ className, variant }: Props) => {
  const ctx = useContext(EditViewContext);

  function handleSubmit() {
    ctx?.submit();
  }

  return (
    <Button
      className={cn(
        'w-full flex justify-center p-8 hover:cursor-pointer rounded-none border-none',
        variant === 'small' && 'w-auto p-8 bg-my-bg-800 hover:bg-my-bg-700',
        className,
      )}
      onClick={handleSubmit}
      disabled={ctx?.isSaving}
    >
      {ctx?.isSaving ? <Loader size={23} /> : <Check />}
    </Button>
  );
};

export default SubmitButton;
