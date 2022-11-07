import ResourcesScreen from "../screens/ResourcesScreen";
import NotificationsScreen from "../screens/notifications";
import TeamScreen from "../screens/TeamScreen";
import OffersScreen from "../screens/OffersScreen";
import EventsScreen from "../screens/events/EventsScreen";

const BOTTOM_TABS = {
  NOTIFICATIONS: {
    name: 'Notifications',
    icon: 'bell-outline',
    component: NotificationsScreen,
  },
  TEAM: {
    name: 'Team',
    icon: 'account-group-outline',
    component: TeamScreen,
  },
  EVENTS: {
    name: 'Events',
    icon: 'calendar-blank-outline',
    component: EventsScreen,
  },
  OFFERS: {
    name: 'Offers',
    icon: 'tag',
    component: OffersScreen,
  },
  RESOURCES: {
    name: 'Resources',
    icon: 'help-circle-outline',
    component: ResourcesScreen,
  },
}

export default BOTTOM_TABS;
