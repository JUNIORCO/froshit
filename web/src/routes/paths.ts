function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_FROSHEE_REGISTER = '/froshee';

export const PATH_FROSHEE_REGISTER = {
  register: path(ROOTS_FROSHEE_REGISTER, '/register'),
  success: path(ROOTS_FROSHEE_REGISTER, '/payment-success'),
};

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
  setPassword: path(ROOTS_AUTH, '/set-password'),
};

export const DEMO_PAGE = `${process.env.NODE_ENV === 'development' ? 'http://' : 'https://'}demo.${process.env.ROOT_DOMAIN}`;

export const PATH_PAGE = {
  demo: '/demo',
  pricing: '/pricing',
  about: '/about',
  contact: '/contact',
  support: '/faqs',
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  termsOfService: '/terms-of-service',
  privacyPolicy: '/privacy-policy',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  user: {
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    invite: path(ROOTS_DASHBOARD, '/user/invite'),
  },
  froshees: {
    root: path(ROOTS_DASHBOARD, '/froshees'),
    new: path(ROOTS_DASHBOARD, '/froshees/new'),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/froshees/${id}/edit`),
    view: (id: string) => path(ROOTS_DASHBOARD, `/froshees/${id}/view`),
  },
  team: {
    root: path(ROOTS_DASHBOARD, '/team'),
    new: path(ROOTS_DASHBOARD, '/team/new'),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/team/${id}/edit`),
    view: (id: string) => path(ROOTS_DASHBOARD, `/team/${id}/view`),
  },
  froshs: {
    root: path(ROOTS_DASHBOARD, '/froshs'),
    new: path(ROOTS_DASHBOARD, '/froshs/new'),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/froshs/${id}/edit`),
    view: (id: string) => path(ROOTS_DASHBOARD, `/froshs/${id}/view`),
  },
  event: {
    root: path(ROOTS_DASHBOARD, '/event'),
    new: path(ROOTS_DASHBOARD, '/event/new'),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/event/${id}/edit`),
    view: (id: string) => path(ROOTS_DASHBOARD, `/event/${id}/view`),
  },
  offer: {
    root: path(ROOTS_DASHBOARD, '/offer'),
    new: path(ROOTS_DASHBOARD, '/offer/new'),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/offer/${id}/edit`),
    view: (id: string) => path(ROOTS_DASHBOARD, `/offer/${id}/view`),
  },
  resource: {
    root: path(ROOTS_DASHBOARD, '/resources'),
    new: path(ROOTS_DASHBOARD, '/resources/new'),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/resources/${id}/edit`),
    view: (id: string) => path(ROOTS_DASHBOARD, `/resources/${id}/view`),
  },
  resourceTag: {
    root: path(ROOTS_DASHBOARD, '/resource-tag'),
    new: path(ROOTS_DASHBOARD, '/resource-tag/new'),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/resource-tag/${id}/edit`),
    view: (id: string) => path(ROOTS_DASHBOARD, `/resource-tag/${id}/view`),
  },
  settings: {
    root: path(ROOTS_DASHBOARD, '/settings'),
    university_identity: path(ROOTS_DASHBOARD, '/settings/university-identity'),
  },
};

export const PATH_DOCS = 'https://froshit.com/faqs';
