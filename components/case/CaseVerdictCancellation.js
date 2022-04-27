import { Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_ROLE, CASE_STAGE } from 'constants/contracts';
import useCase from 'hooks/useCase';
import useDialogContext from 'hooks/useDialogContext';
import useWeb3Context from 'hooks/useWeb3Context';
import { hexStringToJson } from 'utils/converters';
import CaseCancelDialog from './CaseCancelDialog';
import CaseVerdictMakeDialog from './CaseVerdictMakeDialog';

/**
 * A component with a case verdict or cancellation.
 */
export default function CaseVerdictCancellation({ caseObject, caseLaws, sx }) {
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const { isAccountHasCaseRole } = useCase();

  return (
    <Box sx={{ ...sx }}>
      {caseObject && (
        <Stack spacing={2}>
          {/* Case in process */}
          {caseObject.stage < CASE_STAGE.verdict.id && (
            <Typography>
              The verdict can be made by the judge when the case has a
              &quot;Verdict&quot; stage.
            </Typography>
          )}
          {/* Wait verdict */}
          {caseObject.stage === CASE_STAGE.verdict.id && (
            <Typography>The judge&apos;s verdict is awaited.</Typography>
          )}
          {/* Verdict */}
          {caseObject.stage === CASE_STAGE.closed.id && (
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Type:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Verdict
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Judge:</Typography>
                <ProfileCompactCard account={caseObject.verdictAuthor} />
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2">Message:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {hexStringToJson(caseObject.verdictUriData)?.verdictMessage ||
                    'Unknown'}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2">Confirmed Rules:</Typography>
                {caseObject.verdictConfirmedRules.length > 0 ? (
                  <>
                    {caseObject.verdictConfirmedRules.map(
                      (confirmedRule, index) => (
                        <Chip
                          key={index}
                          label={`ID: ${confirmedRule.id}`}
                          size="small"
                        />
                      ),
                    )}
                  </>
                ) : (
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    None
                  </Typography>
                )}
              </Stack>
            </Paper>
          )}
          {/* Cancellation */}
          {caseObject.stage === CASE_STAGE.cancelled.id && (
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Type:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Cancellation
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Judge:</Typography>
                <ProfileCompactCard account={caseObject.cancellationAuthor} />
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2">Message:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {hexStringToJson(caseObject.cancellationUriData)
                    ?.cancellationMessage || 'Unknown'}
                </Typography>
              </Stack>
            </Paper>
          )}
          {/* Forms to add verdict or cancel case */}
          {caseObject.stage === CASE_STAGE.verdict.id &&
            isAccountHasCaseRole(caseObject, account, CASE_ROLE.judge.id) && (
              <Stack direction="row" spacing={1}>
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
        </Stack>
      )}
    </Box>
  );
}
