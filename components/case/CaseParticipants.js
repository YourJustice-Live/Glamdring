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
          {caseObject.roles.map((caseRole, roleIndex) => (
            <Box key={roleIndex}>
              <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
                {Object.values(CASE_ROLE).map((role) =>
                  role.id === caseRole.roleId ? capitalize(role.name) : null,
                )}
              </Typography>
              {caseRole.accounts.map((account, accountIndex) => (
                <ProfileCompactCard
                  key={accountIndex}
                  account={account}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
