import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const [profileApi, setProfileApi] = useState([]);
  useEffect(() => {
    const demoapi = async () => {
      const response = await axios.get('/api/users');
      const { users } = response.data;
      setProfileApi(users);

      // const { users } = response.data;
    };
    demoapi();
  }, []);

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const currentUser = profileApi.find((user) => paramCase(user.username) === name);

  return (
    <Page title="User: Create a new user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo người dùng' : 'Chỉnh sửa người dùng'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New user' : capitalCase(name) },
          ]}
        />

        <UserNewEditForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
