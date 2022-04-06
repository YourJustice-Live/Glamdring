import Link from 'next/link';
import {
  AppBar,
  Box,
  Stack,
  Toolbar,
  Typography,
  Divider,
  Avatar,
} from '@mui/material';
import { useRouter } from 'next/router';
import useWeb3Context from 'hooks/useWeb3Context';
import { Logo, IconRoadMap, IconWallet, IconProfile, IconHome } from 'icons';
import { HeaderButton } from './components';

const DEFAULT_JURISDICTION_NAME = 'Crypto Valley';
const DEFAULT_JURISDICTION_IMG_PATH = 'images/defaultJurisdictionAvatar.png';

export default function Navigation() {
  const { network, account, connectWallet } = useWeb3Context();
  const router = useRouter();

  const handleCreateProfile = () => {
    router.push('/profile/manage');
  };

  return (
    <AppBar
      color="inherit"
      position="fixed"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0px 2px 6px rgba(118, 139, 160, 0.05)',
      }}
    >
      <Toolbar>
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex" alignItems="center">
            <Link href="/">
              <a style={{ display: 'flex' }}>
                <Logo />
              </a>
            </Link>

            <Typography
              variant="h5"
              sx={{ color: 'text.secondary', opacity: 0.6, pl: 1.875 }}
            >
              v.0.1
            </Typography>

            <Divider
              orientation="horizontal"
              sx={{
                height: 22,
                width: '1px',
                backgroundColor: 'grey.200',
                opacity: 0.5,
                border: 'none',
                ml: 1.5,
              }}
            />

            <Avatar
              sx={{ width: 22, height: 22, ml: 1.5, mr: 0.75 }}
              src={DEFAULT_JURISDICTION_IMG_PATH}
            />

            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              {DEFAULT_JURISDICTION_NAME}
            </Typography>
          </Box>

          <Box>
            {!account ? (
              <Box display="flex" alignItems="center">
                <Link href="https://yourjustice.life/">
                  <a
                    target="_blank"
                    style={{
                      height: '48px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <IconRoadMap />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 500, color: 'grey.600', pl: 1 }}
                    >
                      Roadmap
                    </Typography>
                  </a>
                </Link>

                <HeaderButton
                  onClick={connectWallet}
                  startIcon={<IconWallet />}
                >
                  Connect Wallet
                </HeaderButton>
              </Box>
            ) : network ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={2.25}
                divider={
                  <Divider
                    orientation="horizontal"
                    sx={{
                      height: 30,
                      width: '1px',
                      backgroundColor: 'grey.200',
                      opacity: 0.5,
                      border: 'none',
                    }}
                  />
                }
              >
                <HeaderButton
                  onClick={handleCreateProfile}
                  startIcon={<IconProfile hexColor="#5E42CC" />}
                >
                  Create own profile
                </HeaderButton>

                <Link href={`/profile/${account}`}>
                  <a>
                    <IconHome />
                  </a>
                </Link>

                <Avatar sx={{ borderRadius: 3, backgroundColor: 'grey.50' }}>
                  <IconProfile hexColor="#092A5199" />
                </Avatar>
              </Stack>
            ) : null}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
