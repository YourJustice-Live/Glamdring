import { ExpandMoreOutlined } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { CASE_STAGE } from 'constants/contracts';
import useDialogContext from 'hooks/useDialogContext';
import NextLink from 'next/link';
import { formatAddress } from 'utils/formatters';
import CasePostAddDialog from './CasePostAddDialog';
import CaseStageChangeDialog from './CaseStageChangeDialog';

/**
 * A component with a card with case.
 */
export default function CaseCard({ caseObject }) {
  return (
    <Card elevation={1}>
      <CardContent sx={{ p: 4 }}>
        <Box>
          <CaseAddress caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 0.5 }}>
          <CaseAdmin />
        </Box>
        <Box sx={{ mt: 0.5 }}>
          <CaseStage caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 2 }}>
          <CaseJson caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 4 }}>
          <CaseActions caseObject={caseObject} />
        </Box>
      </CardContent>
    </Card>
  );
}

function CaseAddress({ caseObject }) {
  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="body2">Address: </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        <NextLink
          href={`${process.env.NEXT_PUBLIC_NETWORK_BLOCK_EXPLORER_URL}address/${caseObject.id}`}
          passHref
        >
          <Link underline="none" target="_blank">
            {formatAddress(caseObject.id)}
          </Link>
        </NextLink>
      </Typography>
    </Stack>
  );
}

function CaseAdmin() {
  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="body2">Admin: </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        Unknown
      </Typography>
    </Stack>
  );
}

function CaseStage({ caseObject }) {
  function getStageString(caseObject) {
    if (!caseObject?.stage || caseObject.stage === CASE_STAGE.draft) {
      return 'Draft';
    }
    if (caseObject.stage === CASE_STAGE.verdict) {
      return 'Verdict';
    }
    if (caseObject.stage === CASE_STAGE.closed) {
      return 'Closed';
    }
    return 'Unknown';
  }
  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="body2">Stage: </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {getStageString(caseObject)}
      </Typography>
    </Stack>
  );
}

function CaseActions({ caseObject }) {
  const { showDialog, closeDialog } = useDialogContext();
  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="outlined"
        onClick={() =>
          showDialog(
            <CasePostAddDialog caseObject={caseObject} onClose={closeDialog} />,
          )
        }
      >
        Add Post
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          showDialog(
            <CaseStageChangeDialog
              caseObject={caseObject}
              onClose={closeDialog}
            />,
          )
        }
      >
        Change Stage
      </Button>
    </Stack>
  );
}

function CaseJson({ caseObject }) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
        <Typography>JSON</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ overflowX: 'scroll' }}>
          <pre style={{ maxWidth: '240px' }}>
            {JSON.stringify(caseObject, null, 2)}
          </pre>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
