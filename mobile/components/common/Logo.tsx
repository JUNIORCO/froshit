import { Image } from "react-native";

export default function Logo() {
  const froshitLogo = 'https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/froshit/logo.jpg';

  return (
    <Image
      style={{
        width: 100,
        height: 35
      }}
      source={{ uri: froshitLogo }}
    />
  );
}
