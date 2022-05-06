import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import { FORM } from 'constants/feedbacks';
import useFormSubmit from 'hooks/useFormSubmit';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { createRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

/**
 * A dialog for post feedback.
 */
export default function FeedbackPostDialog({
  form = FORM.postFeedback,
  isClose,
  onClose,
}) {
  const { account } = useWeb3Context();
  const { showToastSuccess, showToastError } = useToasts();
  const { submitForm } = useFormSubmit();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);
  const recaptchaRef = createRef();

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
    onClose();
  }

  async function submit({ formData }) {
    try {
      if (!recaptchaRef.current.getValue()) {
        throw new Error('Invalid CAPTCHA');
      }
      setFormData(formData);
      setIsLoading(true);
      submitForm(form.recepients, form.type, account, formData);
      showToastSuccess(
        'Thanks! Together we will create fair and open justice!',
      );
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? null : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{form.title}</DialogTitle>
      <DialogContent>
        <Typography>{form.description}</Typography>
        <Form
          schema={form.schema}
          uiSchema={form.uiSchema}
          formData={formData}
          onSubmit={submit}
          disabled={isLoading}
        >
          <Box sx={{ mt: 1 }}>
            <ReCAPTCHA
              size="compact"
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            />
          </Box>
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
                  Post
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
  );
}
