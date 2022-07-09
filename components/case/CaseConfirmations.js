import { Button, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_ROLE, CASE_STAGE } from 'constants/contracts';
import { CONFIRMATION_TYPE, POST_TYPE } from 'constants/metadata';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import useCase from 'hooks/useCase';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { hexStringToJson } from 'utils/converters';
import CaseNominateAddDialog from './CaseNominateAddDialog';
import CaseRoleAssignDialog from './CaseRoleAssignDialog';
import CasePostAddDialog from './CasePostAddDialog';

/**
 * A component with case witness and confirmation posts.
 */
export default function CaseConfirmations({ caseObject, sx }) {
  return (
    <Box sx={{ ...sx }}>
      <CaseWitnesses caseObject={caseObject} />
      <CaseConfirmationPosts caseObject={caseObject} sx={{ mt: 4 }} />
      <CaseWitnessNominates caseObject={caseObject} sx={{ mt: 4 }} />
    </Box>
  );
}

function CaseWitnesses({ caseObject, sx }) {
  const { accountProfile } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();
  const { t } = useTranslation('common');
  const { isProfileHasCaseRole } = useCase();
  const [
    isAccountProfileCanNominateWitness,
    setIsAccountProfileCanNominateWitness,
  ] = useState(false);

  useEffect(() => {
    setIsAccountProfileCanNominateWitness(false);
    if (caseObject) {
      const isAccountProfileCanNominateWitness = isProfileHasCaseRole(
        caseObject,
        accountProfile?.id,
        CASE_ROLE.subject.id,
      );
      setIsAccountProfileCanNominateWitness(isAccountProfileCanNominateWitness);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject, accountProfile]);

  return (
    <Box sx={{ ...sx }}>
      <Typography sx={{ fontWeight: 'bold' }}>{t('text-witnesses')}</Typography>
      {/* Witnesses */}
      {caseObject?.witnesses?.length > 0 ? (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          {caseObject?.witnesses?.map((profileId, index) => (
            <ProfileCompactCard key={index} profileId={profileId} />
          ))}
        </Stack>
      ) : (
        <Typography sx={{ mt: 1 }}>{t('text-witnesses-no')}</Typography>
      )}
      {/* Button to nominate witness */}
      {caseObject?.stage === CASE_STAGE.open &&
        isAccountProfileCanNominateWitness && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() =>
                showDialog(
                  <CaseNominateAddDialog
                    caseObject={caseObject}
                    nominateRoleId={CASE_ROLE.witness.id}
                    onClose={closeDialog}
                  />,
                )
              }
            >
              {t('button-case-nominate-witness')}
            </Button>
          </Box>
        )}
    </Box>
  );
}

function CaseConfirmationPosts({ caseObject, sx }) {
  const { accountProfile } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();
  const { t } = useTranslation('common');
  const { isProfileHasCaseRole } = useCase();
  const [confirmationPosts, setConfirmationPosts] = useState(null);
  const [
    isAccountProfileCanAddConfirmation,
    setIsAccountProfileCanAddConfirmation,
  ] = useState(false);

  useEffect(() => {
    setIsAccountProfileCanAddConfirmation(false);
    if (caseObject) {
      let confirmationPosts = caseObject.posts.filter(
        (post) => post.uriType === POST_TYPE.confirmation,
      );
      confirmationPosts = confirmationPosts.sort((a, b) =>
        a?.createdDate?.localeCompare(b?.createdDate),
      );
      const isAccountProfileCanAddConfirmation = isProfileHasCaseRole(
        caseObject,
        accountProfile?.id,
        CASE_ROLE.witness.id,
      );
      setConfirmationPosts(confirmationPosts);
      setIsAccountProfileCanAddConfirmation(isAccountProfileCanAddConfirmation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject, accountProfile]);

  if (caseObject?.witnesses?.length > 0) {
    return (
      <Box sx={{ ...sx }}>
        <Typography sx={{ fontWeight: 'bold' }}>
          {t('text-confirmations')}
        </Typography>
        {/* Confirmation posts */}
        {confirmationPosts && confirmationPosts.length > 0 ? (
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {confirmationPosts.map((post, index) => {
              const isConfirmed =
                hexStringToJson(post?.uriData)?.confirmationType ===
                CONFIRMATION_TYPE.confirmation;
              return (
                <Paper key={index} sx={{ p: 2 }}>
                  {/* Author */}
                  <ProfileCompactCard profileId={post.author} />
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
    );
  }

  return <></>;
}

function CaseWitnessNominates({ caseObject, sx }) {
  const { accountProfile } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();
  const { t } = useTranslation('common');
  const { isProfileHasCaseRole } = useCase();
  const [witnessNominates, setWitnessNominates] = useState(null);
  const [isAccountProfileCanAddWitness, setIsAccountProfileCanAddWitness] =
    useState(false);

  useEffect(() => {
    setIsAccountProfileCanAddWitness(false);
    if (caseObject) {
      let witnessNominates = caseObject.nominates.filter(
        (nominate) =>
          hexStringToJson(nominate.uriData)?.role === CASE_ROLE.witness.id,
      );
      witnessNominates = witnessNominates.sort((a, b) =>
        a?.createdDate?.localeCompare(b?.createdDate),
      );
      const isAccountProfileCanAddWitness = isProfileHasCaseRole(
        caseObject,
        accountProfile?.id,
        CASE_ROLE.admin.id,
      );
      setWitnessNominates(witnessNominates);
      setIsAccountProfileCanAddWitness(isAccountProfileCanAddWitness);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject, accountProfile]);

  if (witnessNominates?.length > 0) {
    return (
      <Box sx={{ ...sx }}>
        <Typography sx={{ fontWeight: 'bold' }}>
          {t('text-witnesses-nominated')}
        </Typography>
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          {witnessNominates.map((nominate, index) => {
            return (
              <Paper key={index} sx={{ p: 2 }}>
                {/* Nominator and nominated */}
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                >
                  <ProfileCompactCard
                    profileId={nominate.nominator.id}
                    disableRating={true}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {t('text-nominated-witness')}
                  </Typography>
                  <ProfileCompactCard
                    profileId={nominate.nominated.id}
                    disableRating={true}
                  />
                </Stack>
                {/* Details */}
                <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'bold' }}
                    gutterBottom
                  >
                    {hexStringToJson(nominate.uriData)?.comment}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(nominate.createdDate * 1000).toLocaleString()}
                  </Typography>
                  {/* Button to add witness */}
                  {caseObject?.stage === CASE_STAGE.open &&
                    !caseObject?.witnesses?.includes(nominate.nominated.id) &&
                    isAccountProfileCanAddWitness && (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            showDialog(
                              <CaseRoleAssignDialog
                                caseObject={caseObject}
                                profileId={nominate.nominated.id}
                                roleName={CASE_ROLE.witness.name}
                                onClose={closeDialog}
                              />,
                            )
                          }
                        >
                          {t('button-case-add-witness')}
                        </Button>
                      </Box>
                    )}
                </Paper>
              </Paper>
            );
          })}
        </Stack>
      </Box>
    );
  }
  return <></>;
}
