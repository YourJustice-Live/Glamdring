import { Fab } from '@mui/material';
import useDialogContext from 'hooks/context/useDialogContext';
import FeedbackPostDialog from 'components/feedback/FeedbackPostDialog';
import { useTranslation } from 'next-i18next';

/**
 * A component with a footer feedback floating action button.
 */
export default function FeedbackFab() {
  const { t } = useTranslation('common');
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
      {t('button-post-feedback')}
    </Fab>
  );
}
