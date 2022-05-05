import { Divider, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ImageBox from './ImageBox';

/**
 * A component with the answer to the question.
 */
export default function HowItWorks() {
  return (
    <>
      {/* Intro */}
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
      {/* Chapter 1 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Chapter 1. Connecting wallet
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            The first thing to start with is connecting your cryptocurrency
            wallet to our site.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1651752654/FAQ/How%20It%20Works/animation-1_tb1acs.gif"
            sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Great, now let&apos;s switch to the Rinkeby test network.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1651752814/FAQ/How%20It%20Works/animation-2_jgxpmv.gif"
            sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Nice! And now let&apos;s get our test ETH from{' '}
            <Link
              href="https://rinkebyfaucet.com/"
              underline="none"
              target="_blank"
            >
              rinkebyfaucet.com
            </Link>
            .
          </Typography>
          <Typography gutterBottom>
            To do this you just need to copy your wallet number and paste it in
            the line.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1651752815/FAQ/How%20It%20Works/animation-3_dknjcj.gif"
            sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Test ETH are credited in two minutes.
          </Typography>
        </Box>
      </Box>
      {/* Chapter 2 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Chapter 2. Creating profile
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Now we need to fill in the account information. Click on the button
            &quot;Create Own Profile&quot;.
          </Typography>
          <Typography gutterBottom>
            Upload your avatar and fill in information about yourself.
          </Typography>
          <Typography gutterBottom>
            Once you&apos;re done with that, click &quot;Mint NFT&quot; and sign
            a test contract on the Rinkeby network.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1651752814/FAQ/How%20It%20Works/animation-4_b9dyl3.gif"
            sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Great and welcome, you are now a new member of the YJ community.
          </Typography>
          <Typography gutterBottom>Now the fun part begins.</Typography>
        </Box>
      </Box>
      {/* Chapter 3 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Chapter 3. Joining a jurisdiction
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Let&apos;s create the first case in which we tell the community
            about an investor who has defaulted on his obligations to us.
          </Typography>
          <Typography gutterBottom>
            To do this, we need to click on the &apos;Create Case&apos; button.
          </Typography>
          <Typography gutterBottom>
            First we need to join the existing jurisdiction. The information
            about joining a jurisdiction - will go on the blockchain. On this we
            need to sign the contract once again.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1651752814/FAQ/How%20It%20Works/animation-5_pev2tn.gif"
            sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            In the future, there will be more jurisdictions and their number
            will grow with the growth of the project!
          </Typography>
        </Box>
      </Box>
      {/* Chapter 4 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Chapter 4. Creating Case
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            We need to decide whether we want to thank the person or tell bad
            things about them?
          </Typography>
          <Typography gutterBottom>
            Next, we need to choose an action. Let&apos;s think back to our
            case. One party to the contract has declassified important
            information. This seems to fit under the &quot;Violation of the
            contract with the contractor&quot; action.
          </Typography>
          <Typography gutterBottom>
            By the way, don&apos;t forget to set the name of this case and
            choose the rule that is broken within our jurisdiction.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1651752817/FAQ/How%20It%20Works/animation-6_sj6lom.gif"
            sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Next, we need to select the person who broke the rule. Add a witness
            and evidence, if any.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1651752814/FAQ/How%20It%20Works/animation-7_y6fqo0.gif"
            sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Click &quot;Create Case&quot; and voila! You have added your first
            case.
          </Typography>
          <Typography gutterBottom>
            In order for your case to be registered online, you also need to
            sign a contract.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1651752815/FAQ/How%20It%20Works/animation-8_ltznzw.gif"
            sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
            We look forward to hearing about your case!
          </Typography>
        </Box>
      </Box>
    </>
  );
}
