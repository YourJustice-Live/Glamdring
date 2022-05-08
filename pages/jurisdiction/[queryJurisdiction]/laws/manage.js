import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import ActionManageDialog from 'components/law/ActionManageDialog';
import ActionRuleTable from 'components/law/ActionRuleTable';
import RuleManageDialog from 'components/law/RuleManageDialog';
import Layout from 'components/layout/Layout';
import useDialogContext from 'hooks/useDialogContext';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Page for manage jurisdiction laws.
 */
export default function JurisdictionLawsManage() {
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <Layout
      title={'YourJustice / Jurisdiction Laws Manage'}
      enableSidebar={!!account}
    >
      <Box>
        <Typography variant="h2" gutterBottom>
          Jurisdiction Laws Manager
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
    </Layout>
  );
}
