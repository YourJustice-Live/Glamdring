import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import RoleManager from 'components/jurisdiction/backend/RoleManager';
import RuleManager from 'components/jurisdiction/backend/RuleManager';
import Layout from 'components/layout/Layout';
import useSubgraph from 'hooks/useSubgraph';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Page with a backend of the jurisdiction.
 */
export default function JurisdictionBackend() {
  const { account } = useWeb3Context();

  return (
    <Layout
      title={'YourJustice / Jurisdiction Backend'}
      showAccountNavigation={!!account}
    >
      <Typography variant="h1" gutterBottom>
        Jurisdiction Backend
      </Typography>
      <Divider sx={{ mb: 8 }} />
      <Roles />
      <Actions />
      <Rules />
    </Layout>
  );
}

function Roles() {
  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Roles
      </Typography>
      <Divider sx={{ mb: 2.5 }} />
      <RoleManager />
    </Box>
  );
}

function Actions() {
  const { showToastError } = useToasts();
  const { findActionEntities } = useSubgraph();

  const [actions, setActions] = useState(null);

  async function loadActions() {
    try {
      setActions(await findActionEntities());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Actions
      </Typography>
      <Divider sx={{ mb: 2.5 }} />
      <Stack direction="row" spacing={2}>
        <RuleManager />
        <Button
          variant="outlined"
          onClick={() => {
            setActions(null);
            loadActions();
          }}
        >
          Reload data
        </Button>
      </Stack>
      <Box sx={{ mt: 2.5 }}>
        {actions ? (
          <Grid container spacing={3}>
            {actions.map((rule, index) => (
              <Grid key={index} item xs={12}>
                <Card elevation={3} sx={{ p: 1 }}>
                  <CardContent>
                    <pre>{JSON.stringify(rule, null, 2)}</pre>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Skeleton
              variant="rectangular"
              sx={{ mb: 1 }}
              width={196}
              height={24}
            />
            <Skeleton variant="rectangular" width={82} height={24} />
          </>
        )}
      </Box>
    </Box>
  );
}

function Rules() {
  const { showToastError } = useToasts();
  const { findJurisdictionRuleEntities } = useSubgraph();
  const [rules, setRules] = useState(null);

  async function loadRules() {
    try {
      setRules(await findJurisdictionRuleEntities());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Rules
      </Typography>
      <Divider sx={{ mb: 2.5 }} />
      <Stack direction="row" spacing={2}>
        <RuleManager />
        <Button
          variant="outlined"
          onClick={() => {
            setRules(null);
            loadRules();
          }}
        >
          Reload data
        </Button>
      </Stack>
      <Box sx={{ mt: 2.5 }}>
        {rules ? (
          <Grid container spacing={3}>
            {rules.map((rule, index) => (
              <Grid key={index} item xs={12}>
                <Card elevation={3} sx={{ p: 1 }}>
                  <CardContent>
                    <pre>{JSON.stringify(rule, null, 2)}</pre>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Skeleton
              variant="rectangular"
              sx={{ mb: 1 }}
              width={196}
              height={24}
            />
            <Skeleton variant="rectangular" width={82} height={24} />
          </>
        )}
      </Box>
    </Box>
  );
}
