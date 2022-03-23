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
      <Box sx={{ overflow: 'auto', p: 2.5 }}>
        {isLoading ? (
          <>
            <Skeleton variant="circular" sx={{ mb: 2 }} width={82} height={82} />
            <Skeleton variant="rectangular" sx={{ mb: 1 }} height={64} />
            <Skeleton variant="rectangular" height={32} />
          </>
        ) : (
          <>
            <Avatar sx={{ width: 82, height: 82, mb: 1.5 }} src={profile?.avatarNftMetadata?.image ? profile.avatarNftMetadata.image : null}>
              <InsertPhotoOutlined />
            </Avatar>
            <Typography gutterBottom><b>Account:</b> {formatAccount(account) || "none"}</Typography>
            <Typography><b>Account has profile:</b> {profile ? "yes" : "no"}</Typography>
            <Divider sx={{ mt: 3, mb: 3 }} />
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
              <Stack>
                <Link href='/profile/manager' passHref>
                  <Button variant="outlined">Create Own Profile</Button>
                </Link>
              </Stack>
            )}
            <Divider sx={{ mt: 3, mb: 3 }} />
            <Stack>
              <Link href='/jurisdiction' passHref>
                <Button variant="outlined">Open Jurisdiction</Button>
              </Link>
            </Stack>
          </>
        )}
      </Box>
    </Drawer>
  )

}