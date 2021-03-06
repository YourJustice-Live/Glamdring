import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Box } from '@mui/system';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import { FORM } from 'constants/feedbacks';
import useFormSubmit from 'hooks/useFormSubmit';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { createRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { theme } from 'theme';
import useErrors from 'hooks/useErrors';
import { useTranslation } from 'next-i18next';

/**
 * A dialog for post feedback.
 */
export default function FeedbackPostDialog({
  form = FORM.postFeedback,
  additionalData,
  isClose,
  onClose,
}) {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { submitForm } = useFormSubmit();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);
  const recaptchaRef = createRef();
  const isMediumDevice = useMediaQuery(theme.breakpoints.up('md'));

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
    onClose();
  }

  async function submit({ formData }) {
    try {
      if (!recaptchaRef.current.getValue()) {
        throw new Error(t('text-error-invalid-captcha'));
      }
      setFormData(formData);
      setIsLoading(true);
      submitForm(form.recepients, form.type, account, formData, additionalData);
      showToastSuccess(t('notification-thanks-for-feedback'));
      close();
    } catch (error) {
      handleError(error, true);
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
              size={isMediumDevice ? 'normal' : 'compact'}
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
                {t('text-processing')}
              </LoadingButton>
            ) : (
              <>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ minWidth: 100 }}
                >
                  {t('button-post')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={onClose}
                  sx={{ minWidth: 100 }}
                >
                  {t('button-cancel')}
                </Button>
              </>
            )}
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
