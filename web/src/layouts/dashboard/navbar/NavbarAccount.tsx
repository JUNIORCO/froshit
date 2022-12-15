import { styled } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
import MyAvatar from '../../../components/MyAvatar';
import useProfile from '../../../hooks/useProfile';

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

type Props = {
  isCollapse: boolean | undefined;
};

export default function NavbarAccount({ isCollapse }: Props) {
  const { profile } = useProfile();

  const getName = () => `${profile?.firstName} ${profile?.lastName}`;
  const getRole = () => profile?.role;

  return (
    <Box>
      <Link underline='none' color='inherit'>
        <RootStyle
          sx={{
            ...(isCollapse && {
              bgcolor: 'transparent',
            }),
          }}
        >
          <MyAvatar />

          <Box
            sx={{
              ml: 2,
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.shorter,
                }),
              ...(isCollapse && {
                ml: 0,
                width: 0,
              }),
            }}
          >
            <Typography variant='subtitle2' noWrap>
              {getName()}
            </Typography>
            <Typography variant='body2' noWrap sx={{ color: 'text.secondary' }}>
              {getRole()}
            </Typography>
          </Box>
        </RootStyle>
      </Link>
    </Box>
  );
}
