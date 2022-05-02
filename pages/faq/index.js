import { Divider, Link, Stack, Typography } from '@mui/material';
import Layout from 'components/layout/Layout';
import { QUESTION } from 'constants/faq';
import useWeb3Context from 'hooks/useWeb3Context';
import NextLink from 'next/link';

/**
 * A page with a frequently asked questions list.
 */
export default function Faq() {
  const { account } = useWeb3Context();
  return (
    <Layout title={'YourJustice / FAQ'} enableSidebar={!!account}>
      <Typography variant="h1" gutterBottom>
        FAQ
      </Typography>
      <Typography gutterBottom>
        Learn answers to frequently asked questions on YourJustice
      </Typography>
      <Divider sx={{ mb: 3 }} />
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
    </Layout>
  );
}
