import { Card, CardContent, Grid, Skeleton } from '@mui/material';
import { Box } from '@mui/system';

/**
 * A component with a list of cases.
 */
export default function CaseList({ cases }) {
  return (
    <>
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
    </>
  );
}
