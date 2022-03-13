import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useAccount, useNetwork } from "../hooks/web3";

export default function Navigation() {

  const [account, connectWallet, disconectWallet] = useAccount();
  const [network] = useNetwork();

  return (
    <AppBar color='inherit' position='static'>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Link href='/'>
            <a>
              <Image src="/images/logo.svg" alt="YourJustice Logo" width={160} height={48} />
            </a>
          </Link>
        </Box>
        {!account && (
          <Button variant='outlined' onClick={connectWallet}>Connect Wallet</Button>
        )}
        {account && network && (
          <>
            <Typography sx={{ marginRight: "1rem" }}>Account: {account}</Typography>
            <Typography sx={{ marginRight: "1rem" }}>Chain ID: {network.chainId}</Typography>
            <Button variant='outlined' onClick={disconectWallet}>Disconnect Wallet</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  )

}