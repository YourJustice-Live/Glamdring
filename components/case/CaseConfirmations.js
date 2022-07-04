import { Button, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_ROLE, CASE_STAGE } from 'constants/contracts';
import { CONFIRMATION_TYPE, POST_TYPE } from 'constants/metadata';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import useCase from 'hooks/useCase';
import { useEffect, useState } from 'react';
import { hexStringToJson } from 'utils/converters';
import CasePostAddDialog from './CasePostAddDialog';
import { useTranslation } from 'next-i18next';

/**
 * A component with case witness and confirmation posts.
 */
export default function CaseConfirmations({ caseObject, sx }) {
  const { accountProfile } = useDataContext();
  const { t } = useTranslation('common');
  const { showDialog, closeDialog } = useDialogContext();
  const { isProfileHasCaseRole } = useCase();
  const [confirmationPosts, setConfirmationPosts] = useState(null);
  const [isAccountProfileCanAddWitness, setIsAccountProfileCanAddWitness] =
    useState(true);
  const [
    isAccountProfileCanAddConfirmation,
    setIsAccountProfileCanAddConfirmation,
  ] = useState(false);

  useEffect(() => {
    if (caseObject) {
      const confirmationPosts = caseObject.posts.filter(
        (post) => post.uriType === POST_TYPE.confirmation,
      );
      const sortedConfirmationPosts = confirmationPosts.sort((a, b) =>
        a?.createdDate?.localeCompare(b?.createdDate),
      );
      // TODO: Use real implementation for next constant
      const isAccountProfileCanAddWitness = false;
      const isAccountProfileCanAddConfirmation = isProfileHasCaseRole(
        caseObject,
        accountProfile?.id,
        CASE_ROLE.witness.id,
      );
      setConfirmationPosts(sortedConfirmationPosts);
      setIsAccountProfileCanAddWitness(isAccountProfileCanAddWitness);
      setIsAccountProfileCanAddConfirmation(isAccountProfileCanAddConfirmation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject]);

  return (
    <Box sx={{ ...sx }}>
      {/* Witness */}
      <Box>
        <Typography sx={{ fontWeight: 'bold' }}>{t('text-witness')}</Typography>
        {caseObject?.witnesses?.length > 0 ? (
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {caseObject?.witnesses?.map((profileId, index) => (
              <ProfileCompactCard key={index} profileId={profileId} />
            ))}
          </Stack>
        ) : (
          <Typography sx={{ mt: 1 }}>{t('text-witness-no')}</Typography>
        )}
        {/* Button to add witness */}
        {caseObject?.stage === CASE_STAGE.open &&
          isAccountProfileCanAddWitness && (
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
                {t('button-case-add-witness')}
              </Button>
            </Box>
          )}
      </Box>
      {/* Confirmations */}
      {caseObject?.witnesses?.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography sx={{ fontWeight: 'bold' }}>
            {t('text-confirmations')}
          </Typography>
          {confirmationPosts && confirmationPosts.length > 0 ? (
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              {confirmationPosts.map((post, index) => {
                const isConfirmed =
                  hexStringToJson(post?.uriData)?.confirmationType ===
                  CONFIRMATION_TYPE.confirmation;
                return (
                  <Paper key={index} sx={{ p: 2 }}>
                    {/* Author */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ProfileCompactCard profileId={post.author} />
                    </Stack>
                    {/* Confirmation */}
                    <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'bold',
                          color: isConfirmed ? 'success.main' : 'danger.main',
                        }}
                        gutterBottom
                      >
                        {t('text-witness')}{' '}
                        {isConfirmed
                          ? t('text-confirmation-confirmed').toLowerCase()
                          : t('text-confirmation-denied').toLowerCase()}{' '}
                        {t('text-case').toLowerCase()}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold' }}
                        gutterBottom
                      >
                        {hexStringToJson(post.uriData)?.confirmationMessage}
                      </Typography>
                      <Typography variant="body2">
                        {new Date(post.createdDate * 1000).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Paper>
                );
              })}
            </Stack>
          ) : (
            <Typography sx={{ mt: 1 }}>{t('text-confirmations-no')}</Typography>
          )}
          {/* Button to add confirmation */}
          {caseObject?.stage === CASE_STAGE.open &&
            isAccountProfileCanAddConfirmation && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    showDialog(
                      <CasePostAddDialog
                        caseObject={caseObject}
                        postType={POST_TYPE.confirmation}
                        onClose={closeDialog}
                      />,
                    )
                  }
                >
                  {t('button-case-add-confirmation')}
                </Button>
              </Box>
            )}
        </Box>
      )}
    </Box>
  );
}
