// hooks
import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth();

  return (
    <Avatar
      src={user?.profile.avatar}
      alt={user?.profile.name}
      color={user?.profile.avatar ? 'default' : createAvatar(user?.profile.name).color}
      {...other}
    >
      {createAvatar(user?.username).name}
    </Avatar>
  );
}
