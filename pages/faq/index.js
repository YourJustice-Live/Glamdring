import { InfoOutlined } from '@mui/icons-material';
import { Alert, Button, Divider, Link, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import FeedbackPostDialog from 'components/feedback/FeedbackPostDialog';
import Layout from 'components/layout/Layout';
import { QUESTION } from 'constants/faq';
import { FORM } from 'constants/feedbacks';
import useDialogContext from 'hooks/context/useDialogContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NextLink from 'next/link';
import { palette } from 'theme/palette';

/**
 * A page with a frequently asked questions list.
 */
export default function Faq() {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <Layout title={t('page-title-faq')} enableSidebar={!!account}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1" gutterBottom>
          {t('faq-page-headline')}
        </Typography>
        <Typography gutterBottom>
          {t('faq-page-supporting-headline')}
        </Typography>
        <Divider />
      </Box>
      <Stack spacing={1}>
        {QUESTION.map((question, index) => (
          <Stack key={index} direction="row" spacing={1}>
            <Typography>{index + 1}.</Typography>
            <NextLink href={`/faq/${question.path}`} passHref>
              <Link sx={{ mb: 2 }} underline="none">
                {question.title}
              </Link>
            </NextLink>
          </Stack>
        ))}
      </Stack>
      <Alert
        severity="info"
        icon={<InfoOutlined color="primary" />}
        sx={{ mt: 6, p: 3, background: palette.grey[50], boxShadow: 'none' }}
      >
        <Typography variant="h4" gutterBottom>
          {t('faq-page-alert-headline')}
        </Typography>
        <Typography gutterBottom>
          {t('faq-page-alert-supporting-headline')}
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() =>
            showDialog(
              <FeedbackPostDialog
                form={FORM.askQuestion}
                onClose={closeDialog}
              />,
            )
          }
        >
          {t('button-ask-question')}
        </Button>
      </Alert>
    </Layout>
  );
}

/**
 * Define localized texts at build time.
 */
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
