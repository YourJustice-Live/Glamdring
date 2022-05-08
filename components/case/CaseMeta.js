import { Button, Link, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_ROLE, CASE_STAGE } from 'constants/contracts';
import useCaseContract from 'hooks/contracts/useCaseContract';
import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
import { formatAddress } from 'utils/formatters';

/**
 * A component with a case meta.
 */
export default function CaseMeta({ caseObject, sx }) {
  return (
    <Box sx={{ ...sx }}>
      <CaseAddress caseObject={caseObject} />
      <CaseName caseObject={caseObject} sx={{ mt: 0.5 }} />
      <CaseAdmin caseObject={caseObject} sx={{ mt: 0.5 }} />
      <CaseStage caseObject={caseObject} sx={{ mt: 0.5 }} />
      <CaseCreatedDate caseObject={caseObject} sx={{ mt: 0.5 }} />
    </Box>
  );
}

function CaseAddress({ caseObject, sx }) {
  return (
    <Stack direction="row" spacing={1} sx={{ ...sx }}>
      <Typography variant="body2">Address: </Typography>
      {caseObject && (
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          <Link
            href={`/case/${caseObject.id}`}
            underline="none"
            target="_blank"
          >
            {formatAddress(caseObject.id)}
          </Link>
        </Typography>
      )}
    </Stack>
  );
}

function CaseName({ caseObject, sx }) {
  return (
    <Stack direction="row" spacing={1} sx={{ ...sx }}>
      <Typography variant="body2">Name: </Typography>
      {caseObject && (
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {caseObject.name}
        </Typography>
      )}
    </Stack>
  );
}

function CaseAdmin({ caseObject, sx }) {
  const [adminAccount, setAdminAccount] = useState(null);

  useEffect(() => {
    if (caseObject) {
      const adminRoles = caseObject.roles.find(
        (role) => role.roleId === CASE_ROLE.admin.id,
      );
      setAdminAccount(adminRoles.accounts[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject]);

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ ...sx }}>
      <Typography variant="body2">Admin: </Typography>
      <ProfileCompactCard account={adminAccount} />
    </Stack>
  );
}

function CaseStage({ caseObject, sx }) {
  const { setStageVerdict } = useCaseContract();

  function getStageName(caseObject) {
    let stageName = caseObject.stage;
    for (const stage of Object.values(CASE_STAGE)) {
      if (stage.id === caseObject.stage) {
        stageName = capitalize(stage.name);
      }
    }
    return stageName || 'Unknown';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ ...sx }}>
      <Typography variant="body2">Stage: </Typography>
      {caseObject && (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {getStageName(caseObject)}
          </Typography>
          {caseObject.stage === CASE_STAGE.open.id && (
            <Button
              size="small"
              variant="outlined"
              sx={{ fontSize: 14 }}
              onClick={() => {
                setStageVerdict(caseObject.id);
              }}
            >
              Set Verdict Stage
            </Button>
          )}
        </>
      )}
    </Stack>
  );
}

function CaseCreatedDate({ caseObject, sx }) {
  return (
    <Stack direction="row" spacing={1} sx={{ ...sx }}>
      <Typography variant="body2">Created Date: </Typography>
      {caseObject && (
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {new Date(caseObject.createdDate * 1000).toLocaleString()}
        </Typography>
      )}
    </Stack>
  );
}
