import { ExpandMoreOutlined } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Skeleton,
  Typography,
} from '@mui/material';
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
        <>
          {cases.map((caseObject, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                <Typography>Case #{index + 1}</Typography>
              </AccordionSummary>
              <AccordionDetails>
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
              </AccordionDetails>
            </Accordion>
          ))}
        </>
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
