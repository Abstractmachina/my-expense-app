import { Toaster } from '@/components/rnr/sonner';
import { PropsWithChildren } from 'react';

type Props = {};

// The QueryClient now comes from the root layout; this only adds the toast host for the form.
const Providers = ({ children }: Props & PropsWithChildren) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default Providers;
