import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import useAction from 'hooks/useAction';
import useToasts from 'hooks/useToasts';
import JurisdictionBackendActionManager from './JurisdictionBackendActionManager';

/**
 * A component with a list of actions for the jurisdiction backend.
 */
export default function JurisdictionBackendActions() {
  const { showToastError } = useToasts();
  const { getActions } = useAction();
  const [actions, setActions] = useState(null);

  async function loadActions() {
    try {
      setActions(await getActions());
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
        <JurisdictionBackendActionManager />
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
            {actions.map((action, index) => (
              <Grid key={index} item xs={12}>
                <Card elevation={3} sx={{ p: 1 }}>
                  <CardContent>
                    <Box sx={{ overflowX: 'scroll', mb: 2 }}>
                      <pre style={{ maxWidth: '240px' }}>
                        {JSON.stringify(action, null, 2)}
                      </pre>
                    </Box>
                    <JurisdictionBackendActionManager action={action} />
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
