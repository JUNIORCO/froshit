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
  const froshitLogo = 'https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/froshit/logo.svg';
  const [displayedLogo, setDisplayedLogo] = useState<string | null>();

  const universityLogoFromProfile = profile?.university?.imageUrl;

  const getUniversityLogo = async () => {
    if (universityLogoFromProfile) {
      setDisplayedLogo(universityLogoFromProfile);
      return;
    }

    const { data, error } = await supabaseClient.from('university').select('*').eq('subdomain', subdomain).single();
    if (!error) {
      console.log('data : ', data);
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

  useEffect(() => {
    console.log('displayedLogo : ', displayedLogo);
  }, [displayedLogo]);

  const logo = displayedLogo && (
    <Image
      alt={university ? 'University Logo' : 'FROSHIT Logo'}
      src={displayedLogo}
      width={50}
      height={50}
      priority
    />
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <NextLink href='/' style={{ textDecoration: 'none' }}>{logo}</NextLink>;
});

export default Logo;
