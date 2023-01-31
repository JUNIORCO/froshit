import { Image } from "react-native";
import useSession from "../../hooks/useSession";
import CachedImage from 'expo-cached-image';

type LogoProps = {
  university?: boolean;
  width?: number;
  height?: number;
}

export default function Logo({ university, width, height }: LogoProps) {
  const { profile } = useSession();

  const froshitLogoPath = '../../assets/images/icon.png';
  const universityUrl = profile?.university?.subdomain ? `https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/${profile.university.subdomain}/logo.png` : '';

  const imageStyle = {
    width: width ?? 100,
    height: height ?? 50,
  };

  return university ? (
    <CachedImage
      style={imageStyle}
      source={{ uri: universityUrl }}
      cacheKey={'universityLogo'}
    />
  ) : (
    <Image
      style={imageStyle}
      source={require(froshitLogoPath)}
    />);
}
