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
import useFormSubmit from 'hooks/useFormSubmit';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { createRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

/**
 * A dialog for post feedback.
 */
export default function FeedbackPostDialog({ isClose, onClose }) {
  const { account } = useWeb3Context();
  const { showToastSuccess, showToastError } = useToasts();
  const { submitFeedback } = useFormSubmit();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);
  const recaptchaRef = createRef();

  const schema = {
    type: 'object',
    required: ['feedback'],
    properties: {
      feedback: {
        type: 'string',
        title: 'Your Feedback',
      },
      contact: {
        type: 'string',
        title: 'Your Email, Twitter, Telegram, etc',
      },
    },
  };

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
    onClose();
  }

  const uiSchema = {
    feedback: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
      },
    },
  };

  async function submit({ formData }) {
    try {
      if (!recaptchaRef.current.getValue()) {
        throw new Error('Invalid CAPTCHA');
      }
      setFormData(formData);
      setIsLoading(true);
      submitFeedback(account, formData.feedback, formData.contact);
      showToastSuccess('Thanks for your feedback!');
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
      <DialogTitle>Post Feedback</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Do you have ideas how to improve the app? Maybe you are having
          questions or problems? Post feedback.
        </Typography>
        <Typography sx={{ fontWeight: 'bold' }}>
          Together we will create fair and open justice!
        </Typography>
        <Form
          schema={schema}
          formData={formData}
          uiSchema={uiSchema}
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
