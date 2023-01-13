import {
  PlasmicRootProvider,
  PlasmicComponent,
} from '@plasmicapp/loader-nextjs';
import { useRouter } from 'next/router';
import { PLASMIC } from '../plasmic';

export default function MyPage() {
  const router = useRouter();
  return (
    <PlasmicRootProvider
      loader={PLASMIC}
      pageQuery={router.query}
    >
      <PlasmicComponent component='Homepage' />
    </PlasmicRootProvider>
  );
}
