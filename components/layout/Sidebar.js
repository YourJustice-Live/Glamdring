import { PersonOutlined } from '@mui/icons-material';
import {
  Avatar,
  Divider,
  Drawer,
  Link,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import useWeb3Context from 'hooks/useWeb3Context';
import NextLink from 'next/link';
import { formatAddress } from 'utils/formatters';

/**
 * A component with a sidebar (drawer).
 */
export function Sidebar() {
  const { account, accountProfile } = useWeb3Context();
  const drawerWidth = 240;

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2.5 }}>
        <Avatar
          sx={{ width: 82, height: 82, my: 1.5 }}
          src={accountProfile?.avatarNftUriImage}
        >
          <PersonOutlined />
        </Avatar>
        <Typography gutterBottom>
          <b>Account:</b> {formatAddress(account) || 'none'}
        </Typography>
        <Typography>
          <b>Account has profile:</b> {accountProfile ? 'yes' : 'no'}
        </Typography>
        <Divider sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 } }} />
        <Stack spacing={2} direction="column">
          {accountProfile ? (
            <>
              <NextLink href="/profile" passHref>
                <Link underline="none">Profile</Link>
              </NextLink>
              <NextLink href="/profile/manage" passHref>
                <Link underline="none">Profile Editor</Link>
              </NextLink>
            </>
          ) : (
            <NextLink href="/profile/manage" passHref>
              <Link underline="none">Create Profile</Link>
            </NextLink>
          )}
          <NextLink href="/jurisdiction" passHref>
            <Link underline="none">Jurisdiction</Link>
          </NextLink>
          <NextLink href="/backend" passHref>
            <Link underline="none">Backend</Link>
          </NextLink>
        </Stack>
      </Box>
    </Drawer>
  );
}
