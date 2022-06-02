import { Divider, Link, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_STAGE_STRING } from 'constants/strings';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { formatAddress } from 'utils/formatters';

/**
 * A component with a case header (address, created date, admin, stage).
 */
export default function CaseHeader({ caseObject, sx }) {
  return (
    <Box sx={{ ...sx }}>
      <CaseAdressJurisdictionCreatedDate caseObject={caseObject} />
      <Divider sx={{ mt: 1, mb: 1 }} />
      <CaseAdminStage caseObject={caseObject} />
    </Box>
  );
}

function CaseAdressJurisdictionCreatedDate({ caseObject, sx }) {
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
            sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}
          >
            {/* Address */}
            <Typography variant="body2">
              <Link href={`/case/${caseObject.id}`} underline="none">
                {formatAddress(caseObject.id)}
              </Link>
            </Typography>
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
                  {caseObject?.jurisdiction?.name || 'Unnamed Jurisdiction'}
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
  const [adminProfileId, setAdminProfileId] = useState(null);
  const [stageName, setStageName] = useState(null);

  useEffect(() => {
    if (caseObject) {
      setAdminProfileId(caseObject.admins[0]);
      setStageName(CASE_STAGE_STRING[caseObject?.stage]);
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
        profileId={adminProfileId}
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
          {stageName || 'Unknown Case Stage'}
        </Typography>
      </Box>
    </Box>
  );
}
