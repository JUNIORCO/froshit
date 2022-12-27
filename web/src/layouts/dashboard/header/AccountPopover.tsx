import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { alpha } from '@mui/material/styles';
import { Box, Divider, MenuItem, Stack, Typography } from '@mui/material';
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import useProfile from '../../../hooks/useProfile';
import RoleBasedGuard from '../../../guards/RoleBasedGuard';

type MenuOption = {
  label: string;
  path: string;
  roles?: string[];
}

const MENU_OPTIONS: MenuOption[] = [
  {
    label: 'Profile',
    path: PATH_DASHBOARD.user.profile,
  },
  {
    label: 'Invite',
    path: PATH_DASHBOARD.user.invite,
  },
];

export default function AccountPopover() {
  const router = useRouter();

  const { profile } = useProfile();

  const supabaseClient = useSupabaseClient();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleNavItemClick = (path: string) => {
    setOpen(null);
    void router.push(path);
  };

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
      return;
    }

    void router.replace(PATH_AUTH.login);

    if (isMountedRef.current) {
      handleClose();
    }
  };

  const getName = () => `${profile?.firstName} ${profile?.lastName}`;
  const getEmail = () => profile?.email;

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: '\'\'',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <MyAvatar />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant='subtitle2' noWrap>
            {getName()}
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }} noWrap>
            {getEmail()}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            option.roles ? <RoleBasedGuard roles={option.roles}><Box key={option.label} style={{
                textDecoration: 'none',
                color: 'inherit',
              }}>
                <MenuItem key={option.label} onClick={() => handleNavItemClick(option.path)}>
                  {option.label}
                </MenuItem>
              </Box> </RoleBasedGuard> :
              <Box key={option.label} style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem key={option.label} onClick={() => handleNavItemClick(option.path)}>
                  {option.label}
                </MenuItem>
              </Box>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
