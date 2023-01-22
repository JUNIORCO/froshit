import { Image } from "react-native";
import useSession from "../../hooks/useSession";

type LogoProps = {
  university?: boolean;
  width?: number;
  height?: number;
}

export default function Logo({ university, width, height }: LogoProps) {
  const { profile } = useSession();

  const imageSource = university ? {
    uri: `https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/${profile?.university?.subdomain || 'froshit'}/logo.png`
  } : require('../../assets/icon.png')

  return (
    <Image
      style={{
        width: width ?? 100,
        height: height ?? 50,
        ...(university && { resizeMode: 'stretch' }),
      }}
      source={imageSource}
    />
  );
}
