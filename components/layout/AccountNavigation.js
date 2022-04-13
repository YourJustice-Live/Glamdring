import { InsertPhotoOutlined } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import useWeb3Context from 'hooks/useWeb3Context';
import Link from 'next/link';
import { formatAddress } from 'utils/formatters';

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
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2.5 }}>
        <AccountNavigation />
      </Box>
    </Drawer>
  );
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
        mb: 6,
      }}
    >
      <AccountNavigation />
    </Paper>
  );
}

function AccountNavigation() {
  const { account, accountProfile } = useWeb3Context();

  return (
    <>
      <Avatar
        sx={{ width: 82, height: 82, my: 1.5 }}
        src={accountProfile?.avatarNftUriImage}
      >
        <InsertPhotoOutlined />
      </Avatar>
      <Typography gutterBottom>
        <b>Account:</b> {formatAddress(account) || 'none'}
      </Typography>
      <Typography>
        <b>Account has profile:</b> {accountProfile ? 'yes' : 'no'}
      </Typography>
      <Divider sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 } }} />
      {accountProfile && (
        <Stack spacing={1} direction="column">
          <Link href="/profile" passHref>
            <Button variant="outlined">Open Profile</Button>
          </Link>
          <Link href="/profile/manage" passHref>
            <Button variant="outlined">Edit Profile</Button>
          </Link>
        </Stack>
      )}
      {!accountProfile && (
        <Stack>
          <Link href="/profile/manage" passHref>
            <Button variant="outlined">Create Profile</Button>
          </Link>
        </Stack>
      )}
      <Divider sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 } }} />
      <Stack>
        <Link href="/jurisdiction" passHref>
          <Button variant="outlined">Jurisdiction</Button>
        </Link>
      </Stack>
      <Divider sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 } }} />
      <Stack>
        <Link href="/backend" passHref>
          <Button variant="outlined">Backend</Button>
        </Link>
      </Stack>
    </>
  );
}
