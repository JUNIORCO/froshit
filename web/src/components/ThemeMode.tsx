import moonIcon from '@iconify/icons-carbon/moon';
import { IconButtonAnimate } from './animate';
import Iconify from './Iconify';
import useSettings from '../hooks/useSettings';

export default function ThemeMode() {
  const { onToggleMode } = useSettings();

  return (
    <IconButtonAnimate color='inherit' onClick={onToggleMode} sx={{ color: 'text.primary' }} >
      <Iconify icon={moonIcon} sx={{ width: 24, height: 24 }} />
    </IconButtonAnimate>
  );
}
