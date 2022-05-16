import {
  Avatar,
  Drawer,
  Link,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import useWeb3Context from 'hooks/useWeb3Context';
import { IconProfile } from 'icons';
import NextLink from 'next/link';
import { palette } from 'theme/palette';
import { formatAddress } from 'utils/formatters';

/**
 * A component with a sidebar (drawer).
 */
export function Sidebar() {
  const { account, accountProfile } = useWeb3Context();
  const drawerWidth = 280;

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
        {/* Profile */}
        {accountProfile && (
          <Paper sx={{ p: 2, mt: 2, mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {/* Profile image */}
              <Box sx={{ mr: 1.5 }}>
                <Avatar
                  sx={{
                    bgcolor: 'grey.50',
                    width: 82,
                    height: 82,
                    borderRadius: '16px',
                  }}
                  src={accountProfile.avatarNftUriImage}
                >
                  <IconProfile hexColor={palette.grey[600]} />
                </Avatar>
              </Box>
              {/* Profile details */}
              <Box sx={{ flex: '1' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Typography sx={{ color: 'success.main', mr: 1 }}>
                    {`+${accountProfile.avatarNftTotalPositiveRating}`}
                  </Typography>
                  <Typography sx={{ color: 'danger.main', mr: 1 }}>
                    {`-${accountProfile.avatarNftTotalNegativeRating}`}
                  </Typography>
                </Box>
                <NextLink href={`/profile/${accountProfile.account}`} passHref>
                  <Link sx={{ mb: 2 }} underline="none">
                    {accountProfile.avatarNftUriFirstName || 'Anonymous'}{' '}
                    {accountProfile.avatarNftUriLastName}
                  </Link>
                </NextLink>
                <Box>
                  <Typography variant="body2">
                    {formatAddress(accountProfile.account)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}
        {/* Links */}
        <Stack spacing={2} direction="column" sx={{ mx: 2 }}>
          {account && !accountProfile && (
            <NextLink href="/profile/create" passHref>
              <Link underline="none">Create Own Profile</Link>
            </NextLink>
          )}
          <NextLink href="/profiles" passHref>
            <Link underline="none">Profiles</Link>
          </NextLink>
          <NextLink href="/jurisdictions" passHref>
            <Link underline="none">Jurisdictions</Link>
          </NextLink>
          <NextLink href="/faq" passHref>
            <Link underline="none">FAQ</Link>
          </NextLink>
        </Stack>
      </Box>
    </Drawer>
  );
}
