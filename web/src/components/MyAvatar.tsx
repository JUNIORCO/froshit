// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar, { Props as AvatarProps } from './Avatar';
import useProfile from '../hooks/useProfile';
import { useUser } from '@supabase/auth-helpers-react';

export default function MyAvatar({ ...other }: AvatarProps) {
  const user = useUser();
  const { profile } = useProfile();

  const getFirstName = () => profile ? profile.firstName : user?.user_metadata.firstName;

  return (
    <Avatar
      // src={profile?.photoURL}
      alt={profile?.firstName}
      {...other}
    >
      {createAvatar(getFirstName()).name}
    </Avatar>
  );
}
