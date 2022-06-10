import {
  Avatar,
  Badge,
  Divider,
  Drawer,
  Link,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import useDataContext from 'hooks/context/useDataContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import { IconJurisdiction, IconMember } from 'icons/entities';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';
import { formatAddress, formatProfileFirstLastName } from 'utils/formatters';

/**
 * A component with a sidebar (drawer).
 */
export function Sidebar() {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();
  const { accountProfile, isAccountProfileHasAwaitingCases } = useDataContext();
  const { handleError } = useErrors();
  const { getJurisdictions } = useJurisdiction();
  const [accountProfileJurisdictions, setAccountProfileJurisdictions] =
    useState(null);
  const drawerWidth = 320;
  const jurisdictionsLoadingLimit = 10; // TODO: Find out how to optimally download jurisdictions without limits

  useEffect(() => {
    setAccountProfileJurisdictions(null);
    if (accountProfile) {
      getJurisdictions({
        member: accountProfile.id,
        first: jurisdictionsLoadingLimit,
      })
        .then((jurisdictions) => setAccountProfileJurisdictions(jurisdictions))
        .catch((error) => handleError(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountProfile]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', lg: 'block' },
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: palette.sidebar,
          boxShadow: 'none',
          border: 'none',
        },
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
                    width: 82,
                    height: 82,
                    borderRadius: '16px',
                  }}
                  src={accountProfile.uriImage}
                >
                  <IconMember width="82" height="82" />
                </Avatar>
              </Box>
              {/* Profile details */}
              <Box sx={{ flex: '1' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', mb: 0.3 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'bold', color: 'success.main', mr: 1 }}
                  >
                    {`+${accountProfile.totalPositiveRating}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'bold', color: 'danger.main', mr: 1 }}
                  >
                    {`-${accountProfile.totalNegativeRating}`}
                  </Typography>
                </Box>
                <NextLink href={`/profile/${accountProfile.id}`} passHref>
                  <Link sx={{ mb: 2 }} underline="none">
                    {formatProfileFirstLastName(accountProfile)}
                  </Link>
                </NextLink>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatAddress(accountProfile.owner)}
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
              <Link underline="none">{t('button-profile-create-own')}</Link>
            </NextLink>
          )}
          <NextLink href="/profiles" passHref>
            <Link underline="none">{t('text-profiles')}</Link>
          </NextLink>
          <NextLink href="/jurisdictions" passHref>
            <Link underline="none">{t('text-jurisdictions')}</Link>
          </NextLink>
          <NextLink href="/cases" passHref>
            <Link underline="none">
              <Badge
                color="danger"
                badgeContent={isAccountProfileHasAwaitingCases ? 1 : 0}
                variant="dot"
                sx={{ '& .MuiBadge-badge': { top: '4px', right: '-10px' } }}
              >
                {t('text-cases')}
              </Badge>
            </Link>
          </NextLink>
          <NextLink href="/faq" passHref>
            <Link underline="none">{t('text-faq')}</Link>
          </NextLink>
        </Stack>

        {/* Profile Jurisdictions */}
        {accountProfileJurisdictions?.length > 0 && (
          <Box sx={{ mx: 2, mt: 3 }}>
            <Divider />
            <Typography variant="h4" sx={{ mt: 3 }}>
              {t('text-jurisdictions-my')}
            </Typography>
            <Stack sx={{ mt: 3 }} spacing={3}>
              {accountProfileJurisdictions.map((jurisdiction, index) => (
                <NextLink
                  key={index}
                  href={`/jurisdiction/${jurisdiction?.id}`}
                  passHref
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      cursor: 'pointer',
                    }}
                    key={index}
                  >
                    <Avatar
                      sx={{
                        width: 22,
                        height: 22,
                        fontSize: 14,
                        mr: 1,
                      }}
                      src={jurisdiction.uriData?.image}
                    >
                      <IconJurisdiction width="22" height="22" />
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {jurisdiction.name}
                    </Typography>
                  </Box>
                </NextLink>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
