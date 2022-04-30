import { AttachFileOutlined } from '@mui/icons-material';
import { Link, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { POST_TYPE } from 'constants/metadata';
import { useEffect, useState } from 'react';
import { hexStringToJson } from 'utils/converters';

/**
 * A component with case evidence posts.
 */
export default function CaseEvidence({ caseObject, sx }) {
  const [evidencePosts, setEvidencePosts] = useState(null);

  useEffect(() => {
    if (caseObject) {
      const evidencePosts = caseObject.posts.filter(
        (post) => post.uriType === POST_TYPE.evidence,
      );
      setEvidencePosts(evidencePosts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject]);

  return (
    <Box sx={{ ...sx }}>
      {evidencePosts && evidencePosts.length > 0 ? (
        <Stack spacing={1}>
          {evidencePosts.map((post, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" spacing={1}>
                <AttachFileOutlined />
                <Link
                  href={hexStringToJson(post.uriData)?.evidenceFileUri || '#'}
                  underline="none"
                  target="_blank"
                >
                  {hexStringToJson(post.uriData)?.evidenceTitle || 'Unknown'}
                </Link>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography>None</Typography>
      )}
    </Box>
  );
}
