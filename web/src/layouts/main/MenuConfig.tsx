// routes
import { PATH_PAGE } from '../../routes/paths';
// components
// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: 'Home',
    icon: <Iconify icon={'eva:home-fill'} {...ICON_SIZE} />,
    path: '/',
  },
  {
    title: 'Pricing',
    icon: <Iconify icon={'ant-design:dollar-circle-outlined'} {...ICON_SIZE} />,
    path: PATH_PAGE.pricing,
  },
  {
    title: 'About',
    icon: <Iconify icon={'eva:info-outline'} {...ICON_SIZE} />,
    path: PATH_PAGE.about,
  },
  {
    title: 'Contact',
    icon: <Iconify icon={'lucide:contact'} {...ICON_SIZE} />,
    path: PATH_PAGE.contact,
  },
  {
    title: 'Support',
    icon: <Iconify icon={'material-symbols:contact-support-outline'} {...ICON_SIZE} />,
    path: PATH_PAGE.support,
  },
];

export default menuConfig;
