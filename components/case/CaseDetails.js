import { AttachFileOutlined } from '@mui/icons-material';
import { Divider, Link, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { POST_TYPE } from 'constants/metadata';
import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
import { hexStringToJson } from 'utils/converters';

/**
 * A component with a case details (name, subject, affected, evidence).
 */
export default function CaseDetails({ caseObject, caseLaws, sx }) {
  const [subjectTitles, setSubjectTitles] = useState(null);
  const [affectedTitles, setAffectedTitles] = useState(null);
  const [evidencePosts, setEvidencePosts] = useState(null);

  useEffect(() => {
    if (caseObject && caseLaws) {
      const evidencePosts = caseObject.posts.filter(
        (post) => post.uriType === POST_TYPE.evidence,
      );
      const subjectTitles = [];
      const affectedTitles = [];
      for (const law of caseLaws.values()) {
        subjectTitles.push(capitalize(law.action?.action?.subject));
        for (const rule of law.rules) {
          affectedTitles.push(capitalize(rule.rule?.affected));
        }
      }
      setEvidencePosts(evidencePosts);
      setSubjectTitles(subjectTitles);
      setAffectedTitles(affectedTitles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject, caseLaws]);

  return (
    <Box sx={{ ...sx }}>
      {/* Name */}
      <Box>
        <Typography variant="h2">{caseObject?.name}</Typography>
        <Divider sx={{ mt: 1 }} />
      </Box>
      {/* Subject */}
      <Box sx={{ mt: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontWeight: 'bold' }}>Subject</Typography>
          {subjectTitles && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ({subjectTitles.join(' / ')})
            </Typography>
          )}
        </Stack>
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          {caseObject?.subjectAccounts?.map((account, accountIndex) => (
            <ProfileCompactCard key={accountIndex} account={account} />
          ))}
        </Stack>
        {/* Affected */}
        <Box sx={{ mt: 4 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontWeight: 'bold' }}>Affected</Typography>
            {affectedTitles && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                ({affectedTitles.join(' / ')})
              </Typography>
            )}
          </Stack>
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {caseObject?.affectedAccounts?.map((account, accountIndex) => (
              <ProfileCompactCard key={accountIndex} account={account} />
            ))}
          </Stack>
        </Box>
        {/* Evidence */}
        <Box sx={{ mt: 4 }}>
          <Typography sx={{ fontWeight: 'bold' }}>Evidence</Typography>
          {evidencePosts && evidencePosts.length > 0 ? (
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              {evidencePosts.map((post, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <AttachFileOutlined />
                  <Link
                    href={hexStringToJson(post.uriData)?.evidenceFileUri || '#'}
                    underline="none"
                    target="_blank"
                    variant="body2"
                  >
                    {hexStringToJson(post.uriData)?.evidenceTitle || 'Unknown'}
                  </Link>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Typography>None</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
