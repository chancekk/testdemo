import PropTypes from 'prop-types';

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import axios from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------
AccountChangePassword.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};
export default function AccountChangePassword({ currentUser }) {
  const { confirmPassword } = useAuth();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Vui lòng nhập mật khẩu cũ!'),
    newPassword: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 kí tự').required('Vui lòng nhập mật khẩu mới!'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không đúng!'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const confirmPassword = async (oldPassword, newPassword) => {
        const response = await axios.patch('/api/users/password', { oldPassword, newPassword });
      };
      await confirmPassword(data.oldPassword, data.newPassword);
      reset();
      enqueueSnackbar('Cập nhật thành công!');
    } catch (error) {
      alert('Mật khẩu cũ chưa đúng!');

      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="oldPassword" type="password" label="Mật khẩu cũ" />

          <RHFTextField name="newPassword" type="password" label="Mật khẩu mới" />

          <RHFTextField name="confirmNewPassword" type="password" label="Xác nhận mật khẩu" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Lưu mật khẩu
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
