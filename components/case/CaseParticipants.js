import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_ROLE } from 'constants/contracts';
import { capitalize } from 'lodash';

/**
 * A component with a case participants.
 */
export default function CaseParticipants({ caseObject, sx }) {
  return (
    <Box sx={{ ...sx }}>
      {caseObject && (
        <Stack spacing={2}>
          {/* Admin */}
          <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
            {capitalize(CASE_ROLE.admin.name)}
          </Typography>
          {caseObject.adminAccounts?.map((account, accountIndex) => (
            <ProfileCompactCard
              key={accountIndex}
              account={account}
              sx={{ mb: 1 }}
            />
          ))}
          {/* Subject */}
          <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
            {capitalize(CASE_ROLE.subject.name)}
          </Typography>
          {caseObject.subjectAccounts?.map((account, accountIndex) => (
            <ProfileCompactCard
              key={accountIndex}
              account={account}
              sx={{ mb: 1 }}
            />
          ))}
          {/* Plaintiff */}
          <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
            {capitalize(CASE_ROLE.plaintiff.name)}
          </Typography>
          {caseObject.plaintiffAccounts?.map((account, accountIndex) => (
            <ProfileCompactCard
              key={accountIndex}
              account={account}
              sx={{ mb: 1 }}
            />
          ))}
          {/* Judge */}
          <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
            {capitalize(CASE_ROLE.judge.name)}
          </Typography>
          {caseObject.judgeAccounts?.map((account, accountIndex) => (
            <ProfileCompactCard
              key={accountIndex}
              account={account}
              sx={{ mb: 1 }}
            />
          ))}
          {/* Witness */}
          <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
            {capitalize(CASE_ROLE.witness.name)}
          </Typography>
          {caseObject.witnessAccounts?.map((account, accountIndex) => (
            <ProfileCompactCard
              key={accountIndex}
              account={account}
              sx={{ mb: 1 }}
            />
          ))}
          {/* Affected */}
          <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
            {capitalize(CASE_ROLE.affected.name)}
          </Typography>
          {caseObject.affectedAccounts?.map((account, accountIndex) => (
            <ProfileCompactCard
              key={accountIndex}
              account={account}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
