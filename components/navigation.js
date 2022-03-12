import { AppBar, Box, Button, Toolbar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function Navigation() {

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
        <Button variant='outlined'>Connect Wallet</Button>
      </Toolbar>
    </AppBar>
  )

}