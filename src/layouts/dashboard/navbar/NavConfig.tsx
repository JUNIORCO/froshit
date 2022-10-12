import { PATH_DASHBOARD } from '../../../routes/paths';
import Iconify from '../../../components/Iconify';

const getIcon = (name: string) => (
  <Iconify icon={name} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  dashboard: getIcon('carbon:dashboard'),
  event: getIcon('carbon:event'),
  team: getIcon('carbon:group'),
  frosh: getIcon('carbon:tag-group'),
  notification: getIcon('carbon:notification'),
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
  analytics: getIcon('ic_analytics'),
  menuItem: getIcon('ic_menu_item'),
};

const navConfig = [
  // DASHBOARD
  // ----------------------------------------------------------------------
  {
    subheader: 'Dashboards',
    items: [
      { title: 'Home', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Management',
    items: [
      {
        title: 'Users',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        // children: [
        //   { title: 'list', path: PATH_DASHBOARD.user.list },
        //   { title: 'create', path: PATH_DASHBOARD.user.new },
        //   { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
        //   { title: 'account', path: PATH_DASHBOARD.user.account },
        // ],
      },
      {
        title: 'Events',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.event,
        children: [
          { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
          { title: 'product', path: PATH_DASHBOARD.eCommerce.demoView },
          { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
          { title: 'create', path: PATH_DASHBOARD.eCommerce.new },
          { title: 'edit', path: PATH_DASHBOARD.eCommerce.demoEdit },
          { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
        ],
      },
      {
        title: 'Teams',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.team,
        children: [
          { title: 'cards', path: PATH_DASHBOARD.user.cards },
          { title: 'list', path: PATH_DASHBOARD.invoice.list },
          { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
          { title: 'create', path: PATH_DASHBOARD.invoice.new },
          { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
        ],
      },
      {
        title: 'Froshs',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.frosh,
        children: [
          { title: 'posts', path: PATH_DASHBOARD.blog.posts },
          { title: 'post', path: PATH_DASHBOARD.blog.demoView },
          { title: 'create', path: PATH_DASHBOARD.blog.new },
        ],
      },
      {
        title: 'Notifications',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.notification,
        children: [
          { title: 'posts', path: PATH_DASHBOARD.blog.posts },
          { title: 'post', path: PATH_DASHBOARD.blog.demoView },
          { title: 'create', path: PATH_DASHBOARD.blog.new },
        ],
      },
      {
        title: 'Resources',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.resource,
        children: [
          { title: 'posts', path: PATH_DASHBOARD.blog.posts },
          { title: 'post', path: PATH_DASHBOARD.blog.demoView },
          { title: 'create', path: PATH_DASHBOARD.blog.new },
        ],
      },
    ],
  },

  // CUSTOMIZATION
  // ----------------------------------------------------------------------
  {
    subheader: 'Customization',
    items: [
      { title: 'Branding', path: PATH_DASHBOARD.general.app, icon: ICONS.branding },
      {
        title: 'Settings',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.settings,
        children: [
          { title: 'Programs', path: PATH_DASHBOARD.user.cards },
        ],
      },
    ],
  },
];

export default navConfig;
