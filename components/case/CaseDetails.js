import { Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { capitalize } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

/**
 * A component with a case details (name, subject, affected).
 */
export default function CaseDetails({ caseObject, caseLaws, sx }) {
  const { t } = useTranslation('common');
  const [subjectTitles, setSubjectTitles] = useState(null);
  const [affectedTitles, setAffectedTitles] = useState(null);

  useEffect(() => {
    if (caseObject && caseLaws) {
      const subjectTitles = [];
      const affectedTitles = [];
      for (const law of caseLaws.values()) {
        subjectTitles.push(capitalize(law.action?.action?.subject));
        for (const rule of law.rules) {
          affectedTitles.push(capitalize(rule.rule?.affected));
        }
      }
      setSubjectTitles(subjectTitles);
      setAffectedTitles(affectedTitles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject, caseLaws]);

  if (caseObject && caseLaws) {
    return (
      <Box sx={{ ...sx }}>
        {/* Name */}
        <Paper sx={{ p: 2.5 }} color="success">
          <Typography variant="h4">{caseObject.name}</Typography>
        </Paper>
        {/* Subject and affected */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            mt: 4,
          }}
        >
          {/* Subject */}
          <Box sx={{ width: { xs: 1, md: 1 / 2 } }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: 'bold' }}>
                {t('case-role-subject')}
              </Typography>
              {subjectTitles && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  ({subjectTitles.join(' / ')})
                </Typography>
              )}
            </Stack>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              {caseObject.subjectAccounts?.map((account, accountIndex) => (
                <ProfileCompactCard key={accountIndex} account={account} />
              ))}
            </Stack>
          </Box>
          {/* Affected */}
          <Box sx={{ width: { xs: 1, md: 1 / 2 }, mt: { xs: 4, md: 0 } }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: 'bold' }}>
                {t('case-role-affected')}
              </Typography>
              {affectedTitles && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  ({affectedTitles.join(' / ')})
                </Typography>
              )}
            </Stack>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              {caseObject.affectedAccounts?.map((account, accountIndex) => (
                <ProfileCompactCard key={accountIndex} account={account} />
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    );
  }

  return <></>;
}
