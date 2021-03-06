import { AttachFileOutlined } from '@mui/icons-material';
import { Button, Link, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_STAGE } from 'constants/contracts';
import { CASE_ROLE_KEY } from 'constants/i18n';
import { POST_TYPE } from 'constants/metadata';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import useCase from 'hooks/useCase';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { hexStringToJson } from 'utils/converters';
import CasePostAddDialog from './CasePostAddDialog';

/**
 * A component with case evidence posts.
 */
export default function CaseEvidence({ caseObject, sx }) {
  const { accountProfile } = useDataContext();
  const { t } = useTranslation('common');
  const { showDialog, closeDialog } = useDialogContext();
  const { isProfileHasAnyCaseRole } = useCase();
  const [evidencePosts, setEvidencePosts] = useState(null);

  useEffect(() => {
    if (caseObject) {
      const evidencePosts = caseObject.posts.filter(
        (post) => post.uriType === POST_TYPE.evidence,
      );
      const sortedEvidencePosts = evidencePosts.sort((a, b) =>
        a?.createdDate?.localeCompare(b?.createdDate),
      );
      setEvidencePosts(sortedEvidencePosts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject]);

  return (
    <Box sx={{ ...sx }}>
      {/* Evidence */}
      {evidencePosts && evidencePosts.length > 0 ? (
        <Stack spacing={1}>
          {evidencePosts.map((post, index) => (
            <Paper key={index} sx={{ p: 2 }}>
              {/* Author */}
              <Stack direction="row" spacing={1} alignItems="center">
                <ProfileCompactCard profileId={post.author} />
                <Typography variant="body2" color="text.secondary">
                  ({t(CASE_ROLE_KEY[post.entityRole])})
                </Typography>
              </Stack>
              {/* File */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mt: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <AttachFileOutlined />
                <Box sx={{ ml: 1 }}>
                  <Link
                    href={hexStringToJson(post.uriData)?.evidenceFileUri || '#'}
                    underline="none"
                    target="_blank"
                    variant="body2"
                  >
                    {hexStringToJson(post.uriData)?.evidenceTitle ||
                      t('text-unknown')}
                  </Link>
                  <Typography variant="body2">
                    {new Date(post.createdDate * 1000).toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography>{t('text-evidence-no')}</Typography>
      )}
      {/* Button to add evidence */}
      {caseObject?.stage === CASE_STAGE.open &&
        isProfileHasAnyCaseRole(caseObject, accountProfile?.id) && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() =>
                showDialog(
                  <CasePostAddDialog
                    caseObject={caseObject}
                    postType={POST_TYPE.evidence}
                    onClose={closeDialog}
                  />,
                )
              }
            >
              {t('button-case-add-evidence')}
            </Button>
          </Box>
        )}
    </Box>
  );
}
