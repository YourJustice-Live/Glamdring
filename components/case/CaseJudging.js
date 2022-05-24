import { Construction } from '@mui/icons-material';
import { Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_ROLE, CASE_STAGE } from 'constants/contracts';
import { IS_NOT_MAIN_JURISDICTION_CASE_JUDGING_DISABLED } from 'constants/features';
import useCaseContract from 'hooks/contracts/useCaseContract';
import useCase from 'hooks/useCase';
import useDialogContext from 'hooks/context/useDialogContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { hexStringToJson } from 'utils/converters';
import CaseCancelDialog from './CaseCancelDialog';
import CaseVerdictMakeDialog from './CaseVerdictMakeDialog';

/**
 * A component with a case judges, verdict or cancellation.
 */
export default function CaseJudging({ caseObject, caseLaws, sx }) {
  const isMainJurisdiction =
    caseObject.jurisdiction?.id?.toLowerCase() ===
    process.env.NEXT_PUBLIC_MAIN_JURISDICTION_CONTRACT_ADDRESS?.toLowerCase();

  if (!isMainJurisdiction && IS_NOT_MAIN_JURISDICTION_CASE_JUDGING_DISABLED) {
    return (
      <Box sx={{ ...sx }}>
        <CaseJudges caseObject={caseObject} sx={{ mb: 4 }} />
        <Typography sx={{ fontWeight: 'bold' }}>Verdict</Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <Construction fontSize="small" />
          <Typography>
            Judging feature for this case is under development.
          </Typography>
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
  return (
    <Box sx={{ ...sx }}>
      <Typography sx={{ fontWeight: 'bold' }}>Judges</Typography>
      {caseObject?.judgeAccounts?.length > 0 ? (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          {caseObject?.judgeAccounts?.map((account, accountIndex) => (
            <ProfileCompactCard key={accountIndex} account={account} />
          ))}
        </Stack>
      ) : (
        <Typography sx={{ mt: 1 }}>No judges</Typography>
      )}
    </Box>
  );
}

function CaseRequireVerdictStage({ caseObject, sx }) {
  const { setStageVerdict } = useCaseContract();

  return (
    <Box sx={{ ...sx }}>
      <Typography sx={{ fontWeight: 'bold' }}>Verdict</Typography>
      <Typography sx={{ mt: 1 }}>
        The verdict can be made by the judge when the case has a
        &quot;Verdict&quot; stage.
      </Typography>
      <Button
        variant="outlined"
        onClick={() => {
          setStageVerdict(caseObject?.id);
        }}
        sx={{ mt: 2 }}
      >
        Set Verdict Stage
      </Button>
    </Box>
  );
}

function CaseAwaitingJudge({ caseObject, caseLaws, sx }) {
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const { isAccountHasCaseRole } = useCase();

  return (
    <Box sx={{ ...sx }}>
      <Typography sx={{ fontWeight: 'bold' }}>Verdict</Typography>
      <Typography sx={{ mt: 1 }}>
        The judge&apos;s verdict is awaited.
      </Typography>
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
            Make Verdict
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
            Cancel Case
          </Button>
        </Stack>
      )}
    </Box>
  );
}

function CaseVerdict({ caseObject, sx }) {
  return (
    <Box sx={{ ...sx }}>
      <Typography sx={{ fontWeight: 'bold' }}>Verdict</Typography>
      <Paper sx={{ mt: 1.5, p: 2 }}>
        {/* Author */}
        <Stack direction="row" spacing={1} alignItems="center">
          <ProfileCompactCard account={caseObject?.verdictAuthor} />
          <Typography variant="body2">(Judge)</Typography>
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
              Judge made verdict
            </Typography>
            <Typography variant="body2">(Confirmed Rules:</Typography>
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
              <Typography variant="body2">None</Typography>
            )}
            <Typography variant="body2">)</Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
            {hexStringToJson(caseObject?.verdictUriData)?.verdictMessage ||
              'Unknown'}
          </Typography>
        </Paper>
      </Paper>
    </Box>
  );
}

function CaseCancellation({ caseObject, sx }) {
  return (
    <Box sx={{ ...sx }}>
      <Typography sx={{ fontWeight: 'bold' }}>Verdict</Typography>
      <Paper sx={{ mt: 1.5, p: 2 }}>
        {/* Author */}
        <Stack direction="row" spacing={1} alignItems="center">
          <ProfileCompactCard account={caseObject?.cancellationAuthor} />
          <Typography variant="body2">(Judge)</Typography>
        </Stack>
        {/* Content */}
        <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', color: 'danger.main', mr: 0.5 }}
          >
            Judge cancelled case
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
            {hexStringToJson(caseObject?.cancellationUriData)
              ?.cancellationMessage || 'Unknown'}
          </Typography>
        </Paper>
      </Paper>
    </Box>
  );
}
