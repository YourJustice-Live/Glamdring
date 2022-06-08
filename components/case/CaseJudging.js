import { Construction } from '@mui/icons-material';
import { Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_ROLE, CASE_STAGE, JURISDICTION_ROLE } from 'constants/contracts';
import { IS_NOT_MAIN_JURISDICTION_CASE_JUDGING_DISABLED } from 'constants/features';
import useDialogContext from 'hooks/context/useDialogContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useCaseContract from 'hooks/contracts/useCaseContract';
import useCase from 'hooks/useCase';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { hexStringToJson } from 'utils/converters';
import CaseCancelDialog from './CaseCancelDialog';
import CaseVerdictMakeDialog from './CaseVerdictMakeDialog';

/**
 * A component with a case judges, verdict or cancellation.
 */
export default function CaseJudging({ caseObject, caseLaws, sx }) {
  const { t } = useTranslation('common');
  const isMainJurisdiction =
    caseObject.jurisdiction?.id?.toLowerCase() ===
    process.env.NEXT_PUBLIC_MAIN_JURISDICTION_CONTRACT_ADDRESS?.toLowerCase();

  if (!isMainJurisdiction && IS_NOT_MAIN_JURISDICTION_CASE_JUDGING_DISABLED) {
    return (
      <Box sx={{ ...sx }}>
        <CaseJudges caseObject={caseObject} sx={{ mb: 4 }} />
        <Typography sx={{ fontWeight: 'bold' }}>{t('text-verdict')}</Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <Construction fontSize="small" />
          <Typography>{t('text-feature-judging-coming-soon')}</Typography>
        </Stack>
      </Box>
    );
  } else {
    return (
      <Box sx={{ ...sx }}>
        <CaseJudges caseObject={caseObject} sx={{ mb: 4 }} />
        {caseObject?.stage < CASE_STAGE.verdict && (
          <CaseRequireVerdictStage caseObject={caseObject} />
        )}
        {caseObject?.stage === CASE_STAGE.verdict && (
          <CaseAwaitingJudge caseObject={caseObject} caseLaws={caseLaws} />
        )}
        {caseObject?.stage === CASE_STAGE.closed && (
          <CaseVerdict caseObject={caseObject} />
        )}
        {caseObject.stage === CASE_STAGE.cancelled && (
          <CaseCancellation caseObject={caseObject} />
        )}
      </Box>
    );
  }
}

function CaseJudges({ caseObject, sx }) {
  const { account } = useWeb3Context();
  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { getJurisdiction, isAccountHasJurisdictionRole } = useJurisdiction();
  const { isAccountHasCaseRole } = useCase();
  const { assignRole } = useCaseContract();
  const [
    isAccountHasJurisdictionJudgeRole,
    setIsAccountHasJurisdictionJudgeRole,
  ] = useState(false);
  const [isAccountHasCaseJudgeRole, setIsAccountHasCaseJudgeRole] =
    useState(false);

  function becomeJudge() {
    assignRole(caseObject.id, account, CASE_ROLE.judge.name)
      .then(() =>
        showToastSuccess(t('notification-data-is-successfully-updated')),
      )
      .catch((error) => handleError(error));
  }

  useEffect(() => {
    setIsAccountHasJurisdictionJudgeRole(false);
    setIsAccountHasCaseJudgeRole(false);
    // Define if an account has a judge role in a case and jurisdiction
    if (account && caseObject?.jurisdiction?.id) {
      getJurisdiction(caseObject.jurisdiction.id)
        .then((jurisdiction) => {
          const isAccountHasJurisdictionJudgeRole =
            isAccountHasJurisdictionRole(
              jurisdiction,
              account,
              JURISDICTION_ROLE.judge.id,
            );
          const isAccountHasCaseJudgeRole = isAccountHasCaseRole(
            caseObject,
            account,
            CASE_ROLE.judge.id,
          );
          setIsAccountHasJurisdictionJudgeRole(
            isAccountHasJurisdictionJudgeRole,
          );
          setIsAccountHasCaseJudgeRole(isAccountHasCaseJudgeRole);
        })
        .catch((error) => handleError(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, caseObject]);

  return (
    <Box sx={{ ...sx }}>
      <Typography sx={{ fontWeight: 'bold' }}>{t('text-judges')}</Typography>
      {caseObject?.judgeAccounts?.length > 0 ? (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          {caseObject?.judgeAccounts?.map((account, accountIndex) => (
            <ProfileCompactCard key={accountIndex} account={account} />
          ))}
        </Stack>
      ) : (
        <Typography sx={{ mt: 1 }}>{t('text-judge-not-assigned')}</Typography>
      )}
      {caseObject?.stage < CASE_STAGE.closed &&
        isAccountHasJurisdictionJudgeRole &&
        !isAccountHasCaseJudgeRole && (
          <Button
            variant="outlined"
            onClick={() => {
              becomeJudge();
            }}
            sx={{ mt: 2 }}
          >
            {t('button-case-become-judge')}
          </Button>
        )}
    </Box>
  );
}

function CaseRequireVerdictStage({ caseObject, sx }) {
  const { t } = useTranslation('common');
  const { setStageVerdict } = useCaseContract();

  return (
    <Box sx={{ ...sx }}>
      <Typography sx={{ fontWeight: 'bold' }}>{t('text-verdict')}</Typography>
      <Typography sx={{ mt: 1 }}>
        {t('text-verdict-stage-required-before-making-verdict')}
      </Typography>
      <Button
        variant="outlined"
        onClick={() => {
          setStageVerdict(caseObject?.id);
        }}
        sx={{ mt: 2 }}
      >
        {t('button-case-set-verdict-stage')}
      </Button>
    </Box>
  );
}

function CaseAwaitingJudge({ caseObject, caseLaws, sx }) {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const { isAccountHasCaseRole } = useCase();

  return (
    <Box sx={{ ...sx }}>
      <Typography sx={{ fontWeight: 'bold' }}>{t('text-verdict')}</Typography>
      <Typography sx={{ mt: 1 }}>{t('text-verdict-is-awaited')}</Typography>
      {isAccountHasCaseRole(caseObject, account, CASE_ROLE.judge.id) && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() =>
              showDialog(
                <CaseVerdictMakeDialog
                  caseObject={caseObject}
                  caseLaws={caseLaws}
                  onClose={closeDialog}
                />,
              )
            }
          >
            {t('button-case-make-verdict')}
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              showDialog(
                <CaseCancelDialog
                  caseObject={caseObject}
                  onClose={closeDialog}
                />,
              )
            }
          >
            {t('button-case-cancel')}
          </Button>
        </Stack>
      )}
    </Box>
  );
}

function CaseVerdict({ caseObject, sx }) {
  const { t } = useTranslation('common');

  return (
    <Box sx={{ ...sx }}>
      <Typography sx={{ fontWeight: 'bold' }}>{t('text-verdict')}</Typography>
      <Paper sx={{ mt: 1.5, p: 2 }}>
        {/* Author */}
        <Stack direction="row" spacing={1} alignItems="center">
          <ProfileCompactCard account={caseObject?.verdictAuthor} />
          <Typography variant="body2">({t('case-role-judge')})</Typography>
        </Stack>
        {/* Content */}
        <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 'bold', color: 'success.main', mr: 0.5 }}
            >
              {t('text-verdict-is-made')}
            </Typography>
            <Typography variant="body2">
              ({t('text-verdict-confirmed-rules')}:
            </Typography>
            {caseObject?.verdictConfirmedRules?.length > 0 ? (
              <>
                {caseObject?.verdictConfirmedRules?.map(
                  (confirmedRule, index) => (
                    <Chip
                      key={index}
                      label={`ID: ${confirmedRule.ruleId}`}
                      size="small"
                      sx={{ ml: 0.5 }}
                    />
                  ),
                )}
              </>
            ) : (
              <Typography variant="body2">{t('text-none')}</Typography>
            )}
            <Typography variant="body2">)</Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
            {hexStringToJson(caseObject?.verdictUriData)?.verdictMessage ||
              t('text-unknown')}
          </Typography>
        </Paper>
      </Paper>
    </Box>
  );
}

function CaseCancellation({ caseObject, sx }) {
  const { t } = useTranslation('common');

  return (
    <Box sx={{ ...sx }}>
      <Typography sx={{ fontWeight: 'bold' }}>{t('text-verdict')}</Typography>
      <Paper sx={{ mt: 1.5, p: 2 }}>
        {/* Author */}
        <Stack direction="row" spacing={1} alignItems="center">
          <ProfileCompactCard account={caseObject?.cancellationAuthor} />
          <Typography variant="body2">({t('case-role-judge')})</Typography>
        </Stack>
        {/* Content */}
        <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', color: 'danger.main', mr: 0.5 }}
          >
            {t('text-cancellation-is-made')}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
            {hexStringToJson(caseObject?.cancellationUriData)
              ?.cancellationMessage || t('text-unknown')}
          </Typography>
        </Paper>
      </Paper>
    </Box>
  );
}
