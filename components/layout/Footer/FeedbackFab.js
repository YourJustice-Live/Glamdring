import { Fab } from '@mui/material';
import useDialogContext from 'hooks/useDialogContext';
import FeedbackPostDialog from './FeedbackPostDialog';

/**
 * A component with a footer feedback floating action button.
 */
export default function FeedbackFab() {
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <Fab
      color="primary"
      variant="extended"
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        textTransform: 'initial',
      }}
      onClick={() => showDialog(<FeedbackPostDialog onClose={closeDialog} />)}
    >
      Post Feedback
    </Fab>
  );
}
