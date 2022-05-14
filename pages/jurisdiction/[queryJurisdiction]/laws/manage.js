import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import ActionManageDialog from 'components/law/ActionManageDialog';
import ActionRuleTable from 'components/law/ActionRuleTable';
import RuleManageDialog from 'components/law/RuleManageDialog';
import Layout from 'components/layout/Layout';
import useDialogContext from 'hooks/useDialogContext';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * Page for manage jurisdiction laws.
 */
export default function JurisdictionLawsManage() {
  const router = useRouter();
  const { queryJurisdiction } = router.query;
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const { showToastError } = useToasts();
  const { getJurisdiction } = useJurisdiction();
  const [jurisdiction, setJurisdiction] = useState(null);

  async function loadData() {
    try {
      setJurisdiction(await getJurisdiction(queryJurisdiction));
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    if (queryJurisdiction) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryJurisdiction]);

  return (
    <Layout
      title={'YourJustice / Jurisdiction Laws Manage'}
      enableSidebar={!!account}
    >
      <Box>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 6 }}>
          <NextLink href={`/jurisdiction/${queryJurisdiction}`} passHref>
            <Link underline="none" color="inherit">
              {jurisdiction?.name || 'Jurisdiction'}
            </Link>
          </NextLink>
          <Typography color="text.primary">Laws Manager</Typography>
        </Breadcrumbs>
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
      <ActionRuleTable jurisdiction={jurisdiction} sx={{ mt: 2.5 }} />
    </Layout>
  );
}
