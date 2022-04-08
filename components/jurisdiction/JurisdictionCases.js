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
import useCase from 'hooks/useCase';
import useToasts from 'hooks/useToasts';

/**
 * A component with jurisdiction cases.
 */
export default function JurisdictionCases() {
  const { showToastError } = useToasts();
  const { getCases } = useCase();
  const [cases, setCases] = useState(null);

  async function loadCases() {
    try {
      setCases(
        await getCases(process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS),
      );
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ mb: 12 }}>
      <Typography variant="h1" gutterBottom>
        Cases
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {cases ? (
        <Grid container spacing={3}>
          {cases.map((element, index) => (
            <Grid key={index} item xs={12}>
              <Card elevation={3} sx={{ p: 1 }}>
                <CardContent>
                  <Box sx={{ overflowX: 'scroll', mb: 2 }}>
                    <pre style={{ maxWidth: '240px' }}>
                      {JSON.stringify(element, null, 2)}
                    </pre>
                  </Box>
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
