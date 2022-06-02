import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useDataContext from 'hooks/context/useDataContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import Link from 'next/link';

/**
 * A component that checks requirements before returning the target component (children).
 */
export default function ContentProtector({
  children,
  isAccountRequired,
  isAccountProfileRequired,
  isNoAccountProfileRequired,
}) {
  const { account, connectWallet } = useWeb3Context();
  const { accountProfile } = useDataContext();

  // If user do not have connected account
  if (isAccountRequired && !account) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Content is not available
        </Typography>
        <Typography gutterBottom>
          Please connect wallet to view this content.
        </Typography>
        <Button variant="contained" onClick={connectWallet} sx={{ mt: 2 }}>
          Connect Wallet
        </Button>
      </Box>
    );
  }
  // If user do not have profile
  if (isAccountProfileRequired && !accountProfile) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Content is not available
        </Typography>
        <Typography gutterBottom>
          To view this content you must first claim your soul.
        </Typography>
        <Link href="/profile/create" passHref>
          <Button variant="contained" onClick={connectWallet} sx={{ mt: 2 }}>
            Claim Your Soul
          </Button>
        </Link>
      </Box>
    );
  }
  // If user already have profile
  if (isNoAccountProfileRequired && accountProfile) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Content is not available
        </Typography>
        <Typography gutterBottom>
          This content is only available to users without profiles.
        </Typography>
        <Link href="/" passHref>
          <Button variant="contained" onClick={connectWallet} sx={{ mt: 2 }}>
            Go to Home
          </Button>
        </Link>
      </Box>
    );
  }
  // If everything is ok
  return <>{children}</>;
}
