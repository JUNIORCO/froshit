// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar, { Props as AvatarProps } from './Avatar';
import useProfile from '../hooks/useProfile';

export default function MyAvatar({ ...other }: AvatarProps) {
  const { profile } = useProfile();

  return (
    <Avatar
      // src={profile?.photoURL}
      alt={profile?.firstName}
      {...other}
    >
      {createAvatar(profile?.firstName || '').name}
    </Avatar>
  );
}
