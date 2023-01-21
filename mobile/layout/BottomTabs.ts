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
    background: require('../assets/images/background.png'),
    wrapView: false,
  },
  OFFERS: {
    name: 'Offers',
    icon: 'tag-outline',
    component: OffersScreen,
    background: require('../assets/images/background.png'),
    wrapView: true,
  },
  EVENTS: {
    name: 'Events',
    icon: 'calendar-blank-outline',
    component: EventsScreen,
    background: require('../assets/images/background.png'),
    wrapView: false,
  },
  CHAT: {
    name: 'Chat',
    icon: 'chat-outline',
    component: ChatScreen,
    background: require('../assets/images/background.png'),
    wrapView: false,
  },
  TEAM: {
    name: 'Team',
    icon: 'account-group-outline',
    component: TeamScreen,
    background: require('../assets/images/background.png'),
    wrapView: true,
  },
  PROFILE: {
    name: 'Profile',
    icon: 'account-box-outline',
    component: ProfileScreen,
    background: require('../assets/images/background.png'),
    wrapView: true,
  },
}

export default BOTTOM_TABS;
