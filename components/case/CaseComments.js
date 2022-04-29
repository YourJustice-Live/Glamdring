import { capitalize, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { POST_TYPE } from 'constants/metadata';
import { useEffect, useState } from 'react';
import { hexStringToJson } from 'utils/converters';

/**
 * A component with case comment posts.
 */
export default function CaseComments({ caseObject, sx }) {
  const [commentPosts, setCommentsPosts] = useState(null);

  useEffect(() => {
    if (caseObject) {
      const commentPosts = caseObject.posts.filter(
        (post) => post.uriType === POST_TYPE.comment,
      );
      setCommentsPosts(commentPosts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject]);

  return (
    <Box sx={{ ...sx }}>
      {commentPosts && commentPosts.length > 0 ? (
        <Stack spacing={1}>
          {commentPosts.map((post, index) => (
            <Paper key={index} sx={{ p: 2 }}>
              {/* Author */}
              <Stack direction="row" spacing={1} alignItems="center">
                <ProfileCompactCard account={post.author} />
                <Typography variant="body2">
                  ({capitalize(post.entityRole)})
                </Typography>
              </Stack>
              {/* Message */}
              <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {hexStringToJson(post.uriData)?.commentMessage || 'Unknown'}
                </Typography>
                <Typography variant="body2">
                  {new Date(post.createdDate * 1000).toLocaleString()}
                </Typography>
              </Paper>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography>None</Typography>
      )}
    </Box>
  );
}
