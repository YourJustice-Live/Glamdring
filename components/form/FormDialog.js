import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';

/**
 * A component with a form dialog (modal) and a button that opens the dialog.
 */
export default function FormDialog({
  buttonTitle,
  formTitle,
  formText,
  formSchema,
  formUiSchema,
  formWidgets,
  formData,
  isLoading,
  isOpen,
  onOpen,
  onClose,
  onSubmit,
}) {
  return (
    <>
      <Button variant="outlined" onClick={onOpen}>
        {buttonTitle}
      </Button>
      <Dialog open={isOpen || false} onClose={isLoading ? null : onClose}>
        <DialogTitle>{formTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{formText}</DialogContentText>
          <Form
            schema={formSchema}
            formData={formData}
            uiSchema={formUiSchema}
            widgets={formWidgets}
            onSubmit={onSubmit}
            disabled={isLoading}
          >
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {isLoading ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  startIcon={<Save />}
                  variant="outlined"
                >
                  Processing
                </LoadingButton>
              ) : (
                <>
                  <Button variant="contained" type="submit">
                    {buttonTitle}
                  </Button>
                  <Button variant="outlined" onClick={onClose}>
                    Cancel
                  </Button>
                </>
              )}
            </Stack>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
