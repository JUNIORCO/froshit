import { PATH_DASHBOARD } from '../../../routes/paths';
import Iconify from '../../../components/Iconify';
import { Role } from 'prisma/types';

const getIcon = (name: string) => (
  <Iconify icon={name} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  overview: getIcon('carbon:home'),
  analytics: getIcon('carbon:dashboard'),
  event: getIcon('bi:calendar2-event'),
  team: getIcon('carbon:group'),
  frosh: getIcon('fluent-emoji-high-contrast:party-popper'),
  offer: getIcon('tabler:discount'),
  resource: getIcon('carbon:security'),
  branding: getIcon('gala:images'),
  settings: getIcon('carbon:settings-adjust'),
  blog: getIcon('carbon:user'),
  chat: getIcon('carbon:user'),
  mail: getIcon('carbon:user'),
  user: getIcon('carbon:user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('carbon:event'),
  menuItem: getIcon('ic_menu_item'),
};

// navconfig here

const navConfig = [
  // DASHBOARD
  // ----------------------------------------------------------------------
  {
    subheader: 'Dashboards',
    items: [
      { title: 'Overview', path: PATH_DASHBOARD.general.app, icon: ICONS.overview },
      // { title: 'Analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Management',
    items: [
      {
        title: 'Froshees',
        path: PATH_DASHBOARD.froshees.root,
        icon: ICONS.user,
      },
      {
        title: 'Events',
        path: PATH_DASHBOARD.event.root,
        icon: ICONS.event,
      },
      {
        title: 'Teams',
        path: PATH_DASHBOARD.team.root,
        icon: ICONS.team,
      },
      {
        title: 'Offers',
        path: PATH_DASHBOARD.offer.root,
        icon: ICONS.offer,
      },
      {
        title: 'Resources',
        path: PATH_DASHBOARD.resource.root,
        icon: ICONS.resource,
        children: [
          { title: 'Resources', path: PATH_DASHBOARD.resource.root },
          { title: 'Tags', path: PATH_DASHBOARD.resourceTag.root },
        ],
      },
      {
        title: 'Froshs',
        path: PATH_DASHBOARD.froshs.root,
        icon: ICONS.frosh,
      },
    ],
  },
];

export default navConfig;
