import { Divider, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';

/**
 * A component with the answer to the question.
 */
export default function HowToUseYourJustice() {
  return (
    <>
      <Box sx={{ mb: 6 }}>
        <Typography gutterBottom>Hi! Thank you for being with us.</Typography>
        <Typography>
          Let&apos;s get to grips with the YJ Prototype interface (
          <Link href="https://yj.life/" underline="none" target="_blank">
            yj.life
          </Link>
          ).
        </Typography>
      </Box>
      <Box>
        <Typography variant="h4" gutterBottom>
          Chapter 1
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography gutterBottom>
          The first thing to start with is connecting your cryptocurrency wallet
          to our site.
        </Typography>
        <Typography gutterBottom>...</Typography>
      </Box>
    </>
  );
}
