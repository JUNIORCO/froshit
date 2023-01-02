import ThemeColorPresets from './ThemeColorPresets';
import ThemeLocalization from './ThemeLocalization';

type Props = {
  children: React.ReactNode;
};

export default function ThemeSettings({ children }: Props) {
  return (
    <ThemeColorPresets>
        <ThemeLocalization>
            {children}
        </ThemeLocalization>
    </ThemeColorPresets>
  );
}
