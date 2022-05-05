import { Button, Divider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useDialogContext from 'hooks/useDialogContext';
import ActionManageDialog from './ActionManageDialog';
import ActionRuleTable from './ActionRuleTable';
import RuleManageDialog from './RuleManageDialog';

/**
 * A component with a backend for actions and rules.
 */
export default function ActionRuleBackend({ sx }) {
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <Box sx={{ ...sx }}>
      <Box>
        <Typography variant="h2" gutterBottom>
          Backend for Actions and Rules
        </Typography>
        <Typography gutterBottom>
          A place where users with the appropriate roles can manage action and
          jurisdiction rules.
        </Typography>
        <Divider />
      </Box>
      <Stack direction="row" spacing={2} sx={{ mt: 2.5 }}>
        <Button
          variant="outlined"
          onClick={() =>
            showDialog(<ActionManageDialog onClose={closeDialog} />)
          }
        >
          Add Action
        </Button>
        <Button
          variant="outlined"
          onClick={() => showDialog(<RuleManageDialog onClose={closeDialog} />)}
        >
          Add Rule
        </Button>
      </Stack>
      <ActionRuleTable sx={{ mt: 2.5 }} />
    </Box>
  );
}
