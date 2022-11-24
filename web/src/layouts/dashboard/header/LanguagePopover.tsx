import { useState } from 'react';
// @mui
import { MenuItem, Stack } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import Iconify from '../../../components/Iconify';
import useSettings from '../../../hooks/useSettings';
// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const { onToggleMode } = useSettings();
  const { allLangs, currentLang, onChangeLang } = useLocales();

  const [openLanguage, setOpenLanguage] = useState<HTMLElement | null>(null);

  const handleLanguageOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpenLanguage(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setOpenLanguage(null);
  };

  const handleChangeLang = (newLang: string) => {
    onChangeLang(newLang);
    handleLanguageClose();
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleLanguageOpen}
        sx={{
          width: 40,
          height: 40,
          ...(openLanguage && { bgcolor: 'action.selected' }),
        }}
      >
        <Iconify icon='material-symbols:language' />
      </IconButtonAnimate>

      <IconButtonAnimate
        onClick={onToggleMode}
        sx={{
          width: 40,
          height: 40,
        }}
      >
        <Iconify icon='ph:moon-bold' />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(openLanguage)}
        anchorEl={openLanguage}
        onClose={handleLanguageClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Stack spacing={0.75}>
          {allLangs.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang.value}
              onClick={() => handleChangeLang(option.value)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
    </>
  );
}
