import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useDataContext from 'hooks/context/useDataContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation('common');
  const { account, connectWallet } = useWeb3Context();
  const { accountProfile } = useDataContext();

  // If user do not have connected account
  if (isAccountRequired && !account) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('text-protector-content-is-not-available')}
        </Typography>
        <Typography gutterBottom>
          {t('text-protector-content-requre-connect-wallet')}
        </Typography>
        <Button variant="contained" onClick={connectWallet} sx={{ mt: 2 }}>
          {t('button-wallet-connect')}
        </Button>
      </Box>
    );
  }
  // If user do not have profile
  if (isAccountProfileRequired && !accountProfile) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('text-protector-content-is-not-available')}
        </Typography>
        <Typography gutterBottom>
          {t('text-protector-content-requre-create-profile')}
        </Typography>
        <Link href="/profile/create" passHref>
          <Button variant="contained" onClick={connectWallet} sx={{ mt: 2 }}>
            {t('button-profile-create-own')}
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
          {t('text-protector-content-is-not-available')}
        </Typography>
        <Typography gutterBottom>
          {t('text-protector-content-requre-no-profile')}
        </Typography>
        <Link href="/" passHref>
          <Button variant="contained" onClick={connectWallet} sx={{ mt: 2 }}>
            {t('button-go-home')}
          </Button>
        </Link>
      </Box>
    );
  }
  // If everything is ok
  return <>{children}</>;
}
