import ResourcesScreen from "../screens/resources/ResourcesScreen";
import ChatScreen from "../screens/ChatScreen";
import TeamScreen from "../screens/TeamScreen";
import OffersScreen from "../screens/OffersScreen";
import EventsScreen from "../screens/events/EventsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const BOTTOM_TABS = {
  RESOURCES: {
    name: 'Resources',
    icon: 'help-circle-outline',
    component: ResourcesScreen,
  },
  OFFERS: {
    name: 'Offers',
    icon: 'tag-outline',
    component: OffersScreen,
  },
  EVENTS: {
    name: 'Events',
    icon: 'calendar-blank-outline',
    component: EventsScreen,
  },
  CHAT: {
    name: 'Chat',
    icon: 'chat-outline',
    component: ChatScreen,
  },
  TEAM: {
    name: 'Team',
    icon: 'account-group-outline',
    component: TeamScreen,
  },
  PROFILE: {
    name: 'Profile',
    icon: 'account-box-outline',
    component: ProfileScreen,
  },
}

export default BOTTOM_TABS;
