import { Divider, Link, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_STAGE } from 'constants/contracts';
import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
import { formatAddress } from 'utils/formatters';

/**
 * A component with a case top (address, created date, admin, stage).
 */
export default function CaseTop({ caseObject, sx }) {
  return (
    <Box sx={{ ...sx }}>
      <CaseAdressCreatedDate caseObject={caseObject} />
      <Divider sx={{ mt: 1, mb: 1 }} />
      <CaseAdminStage caseObject={caseObject} />
    </Box>
  );
}

function CaseAdressCreatedDate({ caseObject, sx }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...sx,
      }}
    >
      {caseObject ? (
        <>
          <Typography variant="body2">
            <Link href={`/case/${caseObject.id}`} underline="none">
              {formatAddress(caseObject.id)}
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
  const [adminAccount, setAdminAccount] = useState(null);
  const [stageName, setStageName] = useState(null);

  useEffect(() => {
    if (caseObject) {
      setAdminAccount(caseObject.adminAccounts[0]);
      setStageName(
        capitalize(
          Object.values(CASE_STAGE).find(
            (stage) => stage.id === caseObject?.stage,
          )?.name,
        ),
      );
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
        sx={{ mt: { xs: 1, md: 0 } }}
      />
      <Typography variant="body2">
        <strong>Stage:</strong> {stageName || 'Unknown'}
      </Typography>
    </Box>
  );
}
