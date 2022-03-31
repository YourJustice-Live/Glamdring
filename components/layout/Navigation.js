import { AppBar, Box, Button, Stack, Toolbar, Typography } from '@mui/material';
import useWeb3Context from 'hooks/useWeb3Context';
import Image from 'next/image';
import Link from 'next/link';
import { formatAccount } from 'utils/formatters';

/**
 * Component: Navigation
 */
export default function Navigation() {
  const { network, account, connectWallet, disconnectWallet } =
    useWeb3Context();

  return (
    <AppBar
      color="inherit"
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Link href="/">
            <a>
              <Image
                src="/images/logo.svg"
                alt="YourJustice Logo"
                width={160}
                height={48}
              />
            </a>
          </Link>
        </Box>
        {!account && (
          <Button variant="outlined" onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
        {account && network && (
          <Stack direction="row" alignItems="center" spacing={4}>
            <Typography
              variant="body2"
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              Account: {formatAccount(account)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              Chain ID: {network.chainId}
            </Typography>
            <Button variant="outlined" onClick={disconnectWallet}>
              Disconnect Wallet
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
