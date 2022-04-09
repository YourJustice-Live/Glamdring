import { useContext } from 'react';
import { DialogContext } from 'contexts/dialog';

export default function useDialogContext() {
  const dialogContext = useContext(DialogContext);

  const showDialog = dialogContext.showDialog;
  const closeDialog = dialogContext.closeDialog;

  return {
    showDialog,
    closeDialog,
  };
}
