import { Button, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_STAGE } from 'constants/contracts';
import { CASE_ROLE_KEY } from 'constants/i18n';
import { POST_TYPE } from 'constants/metadata';
import useDialogContext from 'hooks/context/useDialogContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useCase from 'hooks/useCase';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { hexStringToJson } from 'utils/converters';
import CasePostAddDialog from './CasePostAddDialog';

/**
 * A component with case comment posts.
 */
export default function CaseComments({ caseObject, sx }) {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const { isAccountHasAnyCaseRole } = useCase();
  const [commentPosts, setCommentsPosts] = useState(null);

  useEffect(() => {
    if (caseObject) {
      const commentPosts = caseObject.posts.filter(
        (post) => post.uriType === POST_TYPE.comment,
      );
      const sortedCommentPosts = commentPosts.sort((a, b) =>
        a?.createdDate?.localeCompare(b?.createdDate),
      );
      setCommentsPosts(sortedCommentPosts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject]);

  return (
    <Box sx={{ ...sx }}>
      {/* Comments */}
      {commentPosts && commentPosts.length > 0 ? (
        <Stack spacing={1}>
          {commentPosts.map((post, index) => (
            <Paper key={index} sx={{ p: 2 }}>
              {/* Author */}
              <Stack direction="row" spacing={1} alignItems="center">
                <ProfileCompactCard account={post.author} />
                <Typography variant="body2" color="text.secondary">
                  ({t(CASE_ROLE_KEY[post.entityRole])})
                </Typography>
              </Stack>
              {/* Message */}
              <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold' }}
                  gutterBottom
                >
                  {hexStringToJson(post.uriData)?.commentMessage ||
                    t('text-unknown')}
                </Typography>
                <Typography variant="body2">
                  {new Date(post.createdDate * 1000).toLocaleString()}
                </Typography>
              </Paper>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography>{t('text-no-comments')}</Typography>
      )}
      {/* Button to add comment */}
      {caseObject?.stage === CASE_STAGE.open &&
        isAccountHasAnyCaseRole(caseObject, account) && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() =>
                showDialog(
                  <CasePostAddDialog
                    caseObject={caseObject}
                    postType={POST_TYPE.comment}
                    onClose={closeDialog}
                  />,
                )
              }
            >
              {t('button-add-comment')}
            </Button>
          </Box>
        )}
    </Box>
  );
}
