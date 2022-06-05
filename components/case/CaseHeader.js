import { Divider, Link, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import InteractiveAddress from 'components/address/InteractiveAddress';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_STAGE_KEY } from 'constants/i18n';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

/**
 * A component with a case header (address, created date, admin, stage).
 */
export default function CaseHeader({ caseObject, isCaseAddressLinkable, sx }) {
  return (
    <Box sx={{ ...sx }}>
      <CaseAddressJurisdictionCreatedDate
        caseObject={caseObject}
        isCaseAddressLinkable={isCaseAddressLinkable}
      />
      <Divider sx={{ mt: 1, mb: 1 }} />
      <CaseAdminStage caseObject={caseObject} />
    </Box>
  );
}

function CaseAddressJurisdictionCreatedDate({
  caseObject,
  isCaseAddressLinkable,
  sx,
}) {
  const { t } = useTranslation('common');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        ...sx,
      }}
    >
      {caseObject ? (
        <>
          {/* Address and jurisdiction */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
            }}
          >
            {/* Address */}
            <InteractiveAddress
              address={caseObject.id}
              link={`${window.location.origin}/case/${caseObject.id}`}
              isAddressLinkable={isCaseAddressLinkable}
            />
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 1.5, display: { xs: 'none', md: 'block' } }}
            />
            {/* Jurisdiction */}
            <Typography variant="body2" sx={{ mt: { xs: 0.3, md: 0 } }}>
              <NextLink
                href={`/jurisdiction/${caseObject?.jurisdiction?.id || '#'}`}
                passHref
              >
                <Link underline="none">
                  {caseObject?.jurisdiction?.name || t('text-unknown')}
                </Link>
              </NextLink>
            </Typography>
          </Box>
          {/* Created date */}
          <Typography
            variant="body2"
            sx={{ mt: { xs: 0.3, md: 0 }, color: 'text.secondary' }}
          >
            {new Date(caseObject.createdDate * 1000).toLocaleString()}
          </Typography>
        </>
      ) : (
        <Skeleton variant="rectangular" height={18} width={256} />
      )}
    </Box>
  );
}

function CaseAdminStage({ caseObject, sx }) {
  const { t } = useTranslation('common');
  const [adminAccount, setAdminAccount] = useState(null);
  const [stageName, setStageName] = useState(null);

  useEffect(() => {
    if (caseObject) {
      setAdminAccount(caseObject.adminAccounts[0]);
      setStageName(t(CASE_STAGE_KEY[caseObject.stage]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        justifyContent: { xs: 'flex-start', md: 'space-between' },
        alignItems: { xs: 'flex-start', md: 'center' },
        ...sx,
      }}
    >
      <ProfileCompactCard
        account={adminAccount}
        sx={{ mt: { xs: 0.8, md: 0 } }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'flex-start', md: 'flex-end' },
        }}
      >
        <Typography variant="body2" sx={{ mt: 0.3, fontWeight: 'bold' }}>
          {stageName || t('text-unknown')}
        </Typography>
      </Box>
    </Box>
  );
}
