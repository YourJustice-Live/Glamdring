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
import useRule from 'hooks/useRule';
import useToasts from 'hooks/useToasts';
import JurisdictionBackendRuleManager from 'components/jurisdiction/backend/JurisdictionBackendRuleManager';

/**
 * A component with a list of rules for the jurisdiction backend.
 */
export default function JurisdictionBackendRules() {
  const { showToastError } = useToasts();
  const { getRules } = useRule();
  const [rules, setRules] = useState(null);

  async function loadRules() {
    try {
      setRules(await getRules());
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
        <JurisdictionBackendRuleManager />
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
                    <Box sx={{ overflowX: 'scroll', mb: 2 }}>
                      <pre style={{ maxWidth: '240px' }}>
                        {JSON.stringify(rule, null, 2)}
                      </pre>
                    </Box>
                    <JurisdictionBackendRuleManager rule={rule} />
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
