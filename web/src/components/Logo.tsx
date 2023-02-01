import { forwardRef } from 'react';
import { BoxProps } from '@mui/material';
import Image from 'next/image';
import useSubdomain from '../hooks/useSubdomain';

interface Props extends BoxProps {
  university?: boolean;
}

const Logo = forwardRef<any, Props>(({ university = false, sx }, ref) => {
  const { subdomain } = useSubdomain();

  const froshitLogo = 'https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/froshit/FROSHIT_Logo.png';
  const universityLogo = `https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/${subdomain}/logo.png`;

  return <Image
    alt={university ? 'University Logo' : 'FROSHIT Logo'}
    src={university ? universityLogo : froshitLogo}
    width={100}
    height={100}
    priority
  />;
});

export default Logo;
