import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Typography,
} from '@mui/material';
import ActionManageDialog from 'components/law/ActionManageDialog';
import ActionTable from 'components/law/ActionTable';
import RuleManageDialog from 'components/law/RuleManageDialog';
import RuleTable from 'components/law/RuleTable';
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
        {/* Rules */}
        <Box>
          <Typography variant="h2" gutterBottom>
            Jurisdiction Rules
          </Typography>
          <Typography gutterBottom>
            Each law of jurisdiction consists of a general action and a rule
            that exists only in that jurisdiction.
          </Typography>
          <Divider />
          <Button
            variant="outlined"
            onClick={() =>
              showDialog(
                <RuleManageDialog
                  jurisdiction={jurisdiction}
                  onClose={closeDialog}
                />,
              )
            }
            sx={{ mt: 2.5 }}
          >
            Add Rule
          </Button>
          <RuleTable jurisdiction={jurisdiction} sx={{ mt: 2.5 }} />
        </Box>
        {/* Actions */}
        <Box sx={{ mt: 12 }}>
          <Typography variant="h2" gutterBottom>
            General Actions
          </Typography>
          <Typography gutterBottom>
            General actions that a jurisdiction admin can use to create their
            laws for their jurisdiction.
          </Typography>
          <Divider />
          <Button
            variant="outlined"
            onClick={() =>
              showDialog(<ActionManageDialog onClose={closeDialog} />)
            }
            sx={{ mt: 2.5 }}
          >
            Add Action
          </Button>
          <ActionTable sx={{ mt: 2.5 }} />
        </Box>
      </Box>
    </Layout>
  );
}
