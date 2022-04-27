import { Button, Link, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_STAGE } from 'constants/contracts';
import useCase from 'hooks/useCase';
import useDialogContext from 'hooks/useDialogContext';
import useWeb3Context from 'hooks/useWeb3Context';
import { capitalize } from 'lodash';
import { hexStringToJson } from 'utils/converters';
import CaseCommentPostAddDialog from './CaseCommentPostAddDialog';

/**
 * A component with a case posts.
 */
export default function CasePosts({ caseObject, sx }) {
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const { isAccountHasAnyCaseRole } = useCase();

  return (
    <Box sx={{ ...sx }}>
      {caseObject && (
        <Stack spacing={2}>
          {/* Post list */}
          {caseObject.posts.length == 0 && <Typography>None</Typography>}
          {caseObject.posts.length > 0 && (
            <>
              {caseObject.posts.map((post, index) => (
                <Paper key={index} sx={{ p: 2, overflowX: 'scroll' }}>
                  {/* Post author */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">Author:</Typography>
                    <ProfileCompactCard account={post.author} />
                  </Stack>
                  {/* Post author role */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2">Author Role:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {capitalize(post.entityRole)}
                    </Typography>
                  </Stack>
                  {/* Post created date */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2">Created Date:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {new Date(post.createdDate * 1000).toLocaleString()}
                    </Typography>
                  </Stack>
                  {/* Post type */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2">Type:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {capitalize(post.uriType || 'Unknown')}
                    </Typography>
                  </Stack>
                  {/* Evidence post */}
                  {post.uriType === 'evidence' && (
                    <Stack direction="row" spacing={1}>
                      <Typography variant="body2">Evidence:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        <Link
                          href={
                            hexStringToJson(post.uriData)?.evidenceFileUri ||
                            '#'
                          }
                          underline="none"
                          target="_blank"
                        >
                          {hexStringToJson(post.uriData)?.evidenceTitle ||
                            'Unknown'}
                        </Link>
                      </Typography>
                    </Stack>
                  )}
                  {/* Comment post */}
                  {post.uriType === 'comment' && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2">Message:</Typography>
                      <Paper variant="outlined" sx={{ py: 1, px: 2 }}>
                        <Typography variant="body2">
                          {hexStringToJson(post.uriData)?.commentMessage ||
                            'Unknown'}
                        </Typography>
                      </Paper>
                    </Stack>
                  )}
                  {/* Uri */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2">Uri:</Typography>
                    {post.uri ? (
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold', maxWidth: '240px' }}
                      >
                        <Link href={post.uri} underline="none" target="_blank">
                          {post.uri}
                        </Link>
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold', color: 'danger.main' }}
                      >
                        Not available
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              ))}
            </>
          )}
          {/* Add comment post form */}
          {caseObject.stage === CASE_STAGE.open.id &&
            isAccountHasAnyCaseRole(caseObject, account) && (
              <Button
                variant="outlined"
                onClick={() =>
                  showDialog(
                    <CaseCommentPostAddDialog
                      caseObject={caseObject}
                      onClose={closeDialog}
                    />,
                  )
                }
              >
                Add Comment Post
              </Button>
            )}
        </Stack>
      )}
    </Box>
  );
}
