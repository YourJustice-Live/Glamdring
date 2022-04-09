import { Box, Button, Card, CardContent, Grid, Skeleton } from '@mui/material';
import useDialogContext from 'hooks/useDialogContext';
import useRule from 'hooks/useRule';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';
import RuleManageDialog from './RuleManageDialog';

/**
 * A component with a list of rules.
 */
export default function RuleList() {
  const { showDialog, closeDialog } = useDialogContext();
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
    <>
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
                  <Button
                    variant="outlined"
                    onClick={() =>
                      showDialog(
                        <RuleManageDialog rule={rule} onClose={closeDialog} />,
                      )
                    }
                  >
                    Update Rule
                  </Button>
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
    </>
  );
}
