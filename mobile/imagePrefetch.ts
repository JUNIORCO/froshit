import { Image } from 'react-native';
import { Asset } from 'expo-asset';

function cacheImages(images: (string | number)[]) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export const imagePrefetch = async (images: string[] = []) => {
  await Promise.allSettled(cacheImages([
    require('./assets/images/background.png'),
    require('./assets/icon.png'),
    ...images,
  ]));
}
