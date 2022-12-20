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
  frosh: getIcon('carbon:tag-group'),
  notification: getIcon('carbon:notification'),
  offer: getIcon('tabler:discount'),
  resource: getIcon('carbon:security'),
  branding: getIcon('gala:image'),
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
      { title: 'Analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Management',
    items: [
      {
        title: 'Events',
        path: PATH_DASHBOARD.event.root,
        icon: ICONS.event,
      },
      {
        title: 'Froshs',
        path: PATH_DASHBOARD.frosh.root,
        icon: ICONS.frosh,
      },
      {
        title: 'Notifications',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.notification,
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
        title: 'Teams',
        path: PATH_DASHBOARD.team.root,
        icon: ICONS.team,
      },
      {
        title: 'Users',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
      },
    ],
  },

  // CUSTOMIZATION
  // ----------------------------------------------------------------------
  {
    subheader: 'Customization',
    items: [
      {
        title: 'Settings',
        path: PATH_DASHBOARD.settings.root,
        icon: ICONS.settings,
        roles: [Role.Admin],
        children: [
          { title: 'University Identity', path: PATH_DASHBOARD.settings.university_identity },
          { title: 'Programs', path: PATH_DASHBOARD.settings.programs },
        ],
      },
    ],
  },
];

export default navConfig;
