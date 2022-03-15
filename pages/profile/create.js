import { Button, Stack, TextField, Typography } from '@mui/material';
import Layout from 'components/layout/Layout';
import AvatarInput from "components/profile/AvatarInput";
import useAccount from "hooks/useAccount";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

export default function ProfileCreate() {

  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [account] = useAccount();
  const [avatarUrl, setAvatarUrl] = useState(null);

  function onSubmit(data) {
    console.log("data", data);
    console.log("avatarUrl", avatarUrl);
  }

  useEffect(() => {
    // Redirect to index page if account not connected
    if (!account) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <Layout title={"YourJustice / Profile Create"}>
      <Typography variant='h6' gutterBottom>Creating Own Profile</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>

        <Stack spacing={2}>

          <AvatarInput avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />

          <TextField id="outlined-basic" label="First Name" {...register("firstName")} variant="outlined" />
          <TextField id="outlined-basic" label="Second Name" {...register("secondName")} variant="outlined" />

          <Button variant="outlined" type="submit">Create Profile</Button>

        </Stack>

      </form>
    </Layout>
  )
}