import { InsertPhotoOutlined } from '@mui/icons-material';
import { Avatar, Button, Divider, Drawer, Paper, Skeleton, Stack, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useAccount from "hooks/useAccount";
import useProfile from 'hooks/useProfile';
import useToasts from "hooks/useToasts";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatAccount } from 'utils/formatters';

/**
 * A component with a drawer style account navigation .
 */
export function DrawerAccountNavigation({ sx }) {
  const drawerWidth = 240;
  return (
    <Drawer
      variant="permanent"
      sx={{
        ...sx,
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2.5 }}>
        <AccountNavigation />
      </Box>
    </Drawer>
  )
}

/**
 * A component with a paper style account navigation .
 */
export function PaperAccountNavigation({ sx }) {
  return (
    <Paper
      elevation={6}
      sx={{
        ...sx,
        p: 3,
        mb: 6
      }}
    >
      <AccountNavigation />
    </Paper>
  )
}

function AccountNavigation() {

  const { showToastError } = useToasts();
  const { account } = useAccount();
  const { getProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  async function loadData() {
    try {
      setProfile(await getProfile(account));
    } catch (error) {
      showToastError(error);
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
    <>
      {isLoading ? (
        <>
          <Skeleton variant="circular" sx={{ mb: 2 }} width={82} height={82} />
          <Skeleton variant="rectangular" sx={{ mb: 1 }} height={64} />
          <Skeleton variant="rectangular" height={32} />
        </>
      ) : (
        <>
          <Avatar sx={{ width: 82, height: 82, my: 1.5 }} src={profile?.avatarNftMetadata?.image ? profile.avatarNftMetadata.image : null}>
            <InsertPhotoOutlined />
          </Avatar>
          <Typography gutterBottom><b>Account:</b> {formatAccount(account) || "none"}</Typography>
          <Typography><b>Account has profile:</b> {profile ? "yes" : "no"}</Typography>
          <Divider sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 } }} />
          {profile && (
            <Stack spacing={1} direction="column">
              <Link href='/profile' passHref>
                <Button variant="outlined">Open Profile</Button>
              </Link>
              <Link href='/profile/manager' passHref>
                <Button variant="outlined">Edit Profile</Button>
              </Link>
            </Stack>
          )}
          {!profile && (
            <Stack>
              <Link href='/profile/manager' passHref>
                <Button variant="outlined">Create Profile</Button>
              </Link>
            </Stack>
          )}
          <Divider sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 } }} />
          <Stack>
            <Link href='/jurisdiction' passHref>
              <Button variant="outlined">Open Jurisdiction</Button>
            </Link>
          </Stack>
        </>
      )}
    </>
  )
}