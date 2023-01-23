import { forwardRef } from 'react';
import NextLink from 'next/link';
import { BoxProps } from '@mui/material';
import Image from 'next/image';
import useSubdomain from '../hooks/useSubdomain';

interface Props extends BoxProps {
  disabledLink?: boolean;
  university?: boolean;
}

const Logo = forwardRef<any, Props>(({ university = false, disabledLink = false, sx }, ref) => {
  const { subdomain } = useSubdomain();

  const froshitLogo = 'https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/froshit/FROSHIT_Logo.png';
  const universityLogo = `https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/${subdomain}/logo.png`;

  const logo = (
    <Image
      alt={university ? 'University Logo' : 'FROSHIT Logo'}
      src={university ? universityLogo : froshitLogo}
      width={100}
      height={100}
      priority
    />
  );

  return disabledLink ? <>{logo}</> : <NextLink href='/' style={{ textDecoration: 'none' }}>{logo}</NextLink>;
});

export default Logo;
