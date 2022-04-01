import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import useSubgraph from 'hooks/useSubgraph';
import useToasts from 'hooks/useToasts';

/**
 * A component with jurisdiction rules.
 */
export default function Rules() {
  const { showToastError } = useToasts();
  const { findJurisdictionRuleEntities } = useSubgraph();

  const [rules, setRules] = useState(null);

  async function loadData() {
    try {
      setRules(await findJurisdictionRuleEntities());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ mb: 12 }}>
      <Typography variant="h1" gutterBottom>
        Rules
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {rules ? (
        <Grid container spacing={3}>
          {rules.map((rule, index) => (
            <Grid key={index} item xs={12}>
              <Card elevation={3} sx={{ p: 2 }}>
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
  );
}
