import { Check } from 'lucide-react-native';
import { useContext } from 'react';
import { EditViewContext } from './EditViewContext';
import Loader from '@/components/animated/Loader';
import { cn } from '@/util/ui';
import { Button } from '@/components/rnr/button';
import { THEME } from '@/lib/theme';

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
        'flex justify-center p-8 hover:cursor-pointer rounded-none border-none bg-bg-800',
        variant === 'small' && 'p-8  w-12 h-12',
        className,
      )}
      onClick={handleSubmit}
      disabled={ctx?.isSaving}
    >
      {ctx?.isSaving ? <Loader size={23} /> : <Check color={THEME.dark['fg-400']} />}
    </Button>
  );
};

export default SubmitButton;
