import { Breadcrumbs, Divider, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import { QUESTION } from 'constants/faq';
import useWeb3Context from 'hooks/context/useWeb3Context';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * A page with an answer for specified question.
 *
 * TODO: Use json data instead of component for every question.
 */
export default function Question() {
  const router = useRouter();
  const { queryQuestion } = router.query;
  const { account } = useWeb3Context();
  const [title, setTitle] = useState(null);
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    // Define question title and answer
    let questionTitle;
    let questionAnswer;
    QUESTION.map((question) => {
      if (question.path === queryQuestion) {
        questionTitle = question.title;
        questionAnswer = question.answer;
      }
    });
    if (questionTitle && questionAnswer) {
      setTitle(questionTitle);
      setAnswer(questionAnswer);
    } else {
      // Redirect to faq page if question is not found
      router.push(`/faq`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title={`YourJustice / ${title}`} enableSidebar={!!account}>
      {title && answer && (
        <>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 6 }}>
            <NextLink href={`/faq`} passHref>
              <Link underline="none" color="inherit">
                FAQ
              </Link>
            </NextLink>
            <Typography color="text.primary">{title}</Typography>
          </Breadcrumbs>
          <Typography variant="h1" gutterBottom>
            {title}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box>{answer}</Box>
        </>
      )}
    </Layout>
  );
}
