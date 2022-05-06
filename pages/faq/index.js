import { Button, Divider, Link, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import FeedbackPostDialog from 'components/feedback/FeedbackPostDialog';
import Layout from 'components/layout/Layout';
import { QUESTION } from 'constants/faq';
import { FORM } from 'constants/feedbacks';
import useDialogContext from 'hooks/useDialogContext';
import useWeb3Context from 'hooks/useWeb3Context';
import NextLink from 'next/link';

/**
 * A page with a frequently asked questions list.
 */
export default function Faq() {
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <Layout title={'YourJustice / FAQ'} enableSidebar={!!account}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1" gutterBottom>
          FAQ
        </Typography>
        <Typography gutterBottom>
          Learn answers to frequently asked questions on YourJustice
        </Typography>
        <Divider />
      </Box>
      <Stack spacing={1} sx={{ mb: 16 }}>
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
      <Box>
        <Typography variant="h4" gutterBottom>
          Got another question?
        </Typography>
        <Typography gutterBottom>
          Please write to us, we will help you
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
          Ask Question
        </Button>
      </Box>
    </Layout>
  );
}
