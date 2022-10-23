// @mui
import { alpha } from '@mui/material/styles';
import {
  Link,
  Stack,
  Button,
  Tooltip,
  IconButton,
  ButtonProps,
  IconButtonProps,
} from '@mui/material';
//
import Iconify from './Iconify';
import { FROSHIT_INSTAGRAM, FROSHIT_LINKEDIN } from '../config';

// ----------------------------------------------------------------------

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
};

type IProps = IconButtonProps & ButtonProps;

interface Props extends IProps {
  simple?: boolean;
  initialColor?: boolean;
  links?: SocialLinks;
}

export default function SocialsButton({
  initialColor = false,
  simple = true,
  links = {
    linkedin: FROSHIT_LINKEDIN,
    instagram: FROSHIT_INSTAGRAM,
  },
  sx,
  ...other
}: Props) {
  const SOCIALS = [
    {
      name: 'Linkedin',
      icon: 'eva:linkedin-fill',
      socialColor: '#007EBB',
      path: links.linkedin || '#linkedin-link',
    },
    {
      name: 'Instagram',
      icon: 'ant-design:instagram-filled',
      socialColor: '#E02D69',
      path: links.instagram || '#instagram-link',
    },
  ];

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center">
      {SOCIALS.map((social) => {
        const { name, icon, path, socialColor } = social;
        return simple ? (
          <Link key={name} href={path} target="_blank">
            <Tooltip title={name} placement="top">
              <IconButton
                color="inherit"
                sx={{
                  ...(initialColor && {
                    color: socialColor,
                    '&:hover': {
                      bgcolor: alpha(socialColor, 0.08),
                    },
                  }),
                  ...sx,
                }}
                {...other}
              >
                <Iconify icon={icon} sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Tooltip>
          </Link>
        ) : (
          <Button
            key={name}
            href={path}
            color="inherit"
            variant="outlined"
            size="small"
            startIcon={<Iconify icon={icon} />}
            sx={{
              m: 0.5,
              flexShrink: 0,
              ...(initialColor && {
                color: socialColor,
                borderColor: socialColor,
                '&:hover': {
                  borderColor: socialColor,
                  bgcolor: alpha(socialColor, 0.08),
                },
              }),
              ...sx,
            }}
            {...other}
          >
            {name}
          </Button>
        );
      })}
    </Stack>
  );
}
