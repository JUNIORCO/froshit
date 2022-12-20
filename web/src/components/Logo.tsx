import { forwardRef, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { BoxProps } from '@mui/material';
import Image from 'next/image';
import useProfile from '../hooks/useProfile';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import useSubdomain from '../hooks/useSubdomain';

interface Props extends BoxProps {
  disabledLink?: boolean;
  university?: boolean;
}

const Logo = forwardRef<any, Props>(({ university = false, disabledLink = false, sx }, ref) => {
  const { profile }: any = useProfile();
  const supabaseClient = useSupabaseClient();
  const { subdomain } = useSubdomain();

  // const { data: { publicUrl: froshitLogo } } = supabaseClient.storage.from('froshit').getPublicUrl('logo.svg');
  const froshitLogo = 'https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/froshit/logo.webp';
  const [displayedLogo, setDisplayedLogo] = useState<string | null>();

  const universityLogoFromProfile = profile?.university?.imageUrl;

  const getUniversityLogo = async () => {
    if (universityLogoFromProfile) {
      setDisplayedLogo(universityLogoFromProfile);
      return;
    }

    const { data, error } = await supabaseClient.from('university').select('*').eq('subdomain', subdomain).single();
    if (!error) {
      setDisplayedLogo(data.imageUrl);
    }
  };

  useEffect(() => {
    if (university) {
      void getUniversityLogo();
    } else {
      setDisplayedLogo(froshitLogo);
    }
  }, []);

  if (!displayedLogo) {
    return <></>;
  }

  const logo = (
    <Image
      alt={university ? 'University Logo' : 'FROSHIT Logo'}
      src={displayedLogo}
      width={university ? 50 : 90}
      height={university ? 50 : 40}
      priority
    />
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <NextLink href='/' style={{ textDecoration: 'none' }}>{logo}</NextLink>;
});

export default Logo;
