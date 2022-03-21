import { InsertPhotoOutlined } from '@mui/icons-material';
import { Avatar, Button, Divider, Drawer, Skeleton, Stack, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useAccount from "hooks/useAccount";
import useProfile from 'hooks/useProfile';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { formatAccount } from 'utils/formatters';

/**
 * A component with a navigation for account.
 */
export default function AccountNavigation() {

  const { enqueueSnackbar } = useSnackbar();
  const { account } = useAccount();
  const { getProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const drawerWidth = 240;

  async function loadData() {
    try {
      setProfile(await getProfile(account));
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (account) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', padding: '24px' }}>
        {isLoading ? (
          <>
            <Skeleton variant="circular" sx={{ marginBottom: '1rem' }} width={82} height={82} />
            <Skeleton variant="rectangular" sx={{ marginBottom: '1rem' }} height={64} />
            <Skeleton variant="rectangular" height={32} />
          </>
        ) : (
          <>
            <Avatar sx={{ width: 82, height: 82, marginBottom: '12px' }} src={profile?.avatarNftMetadata?.profilePicture ? profile.avatarNftMetadata.profilePicture : null}>
              <InsertPhotoOutlined />
            </Avatar>
            <Typography gutterBottom><b>Account:</b> {formatAccount(account) || "none"}</Typography>
            <Typography gutterBottom><b>Account has profile:</b> {profile ? "yes" : "no"}</Typography>
            <Divider sx={{ marginBottom: '1.5rem' }} />
            {profile && (
              <Stack spacing={1} direction="column">
                <Link href='/profile' passHref>
                  <Button variant="outlined">Open Own Profile</Button>
                </Link>
                <Link href='/profile/manager' passHref>
                  <Button variant="outlined">Edit Own Profile</Button>
                </Link>
              </Stack>
            )}
            {!profile && (
              <Link href='/profile/manager' passHref>
                <Button variant="outlined">Create Own Profile</Button>
              </Link>
            )}
          </>
        )}
      </Box>
    </Drawer>
  )

}