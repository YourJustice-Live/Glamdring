import { Button, Card, CardContent, Grid, Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import useDialogContext from 'hooks/useDialogContext';
import CasePostAddDialog from './CasePostAddDialog';

/**
 * A component with a list of cases.
 */
export default function CaseList({ cases }) {
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <>
      {cases ? (
        <Grid container spacing={3}>
          {cases.map((caseObject, index) => (
            <Grid key={index} item xs={12}>
              <Card elevation={3} sx={{ p: 1 }}>
                <CardContent>
                  <Box sx={{ overflowX: 'scroll', mb: 2 }}>
                    <pre style={{ maxWidth: '240px' }}>
                      {JSON.stringify(caseObject, null, 2)}
                    </pre>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      showDialog(
                        <CasePostAddDialog
                          caseObject={caseObject}
                          onClose={closeDialog}
                        />,
                      )
                    }
                  >
                    Add Post
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
