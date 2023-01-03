import palette from '../theme/palette';
import { ThemeColorPresets } from '../components/settings/type';
import { SUBDOMAIN_COLOR_PALETTE } from '../hardcoded/subdomain-color-palette';

export const defaultPreset = {
  name: 'default',
  ...palette.light.primary,
};

export default function getColorPresets(presetsKey: ThemeColorPresets) {
  return SUBDOMAIN_COLOR_PALETTE[presetsKey];
}
