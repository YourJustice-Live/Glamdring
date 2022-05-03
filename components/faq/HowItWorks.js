import { Divider, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import ReactPlayer from 'react-player';

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
          <Box sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}>
            <ReactPlayer
              url="https://drive.google.com/uc?export=download&id=14V350_n6aYFL17P-2b3nQ13sk6lG7Va_"
              controls={true}
              width="100%"
              height="100%"
            />
          </Box>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Great, now let&apos;s switch to the Rinkeby test network.
          </Typography>
          <Box sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}>
            <ReactPlayer
              url="https://drive.google.com/uc?export=download&id=1z6CsMFfp2xUWm9YJ2lMwdgfHuZHrL2lL"
              controls={true}
              width="100%"
              height="100%"
            />
          </Box>
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
          <Box sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}>
            <ReactPlayer
              url="https://drive.google.com/uc?export=download&id=199k0NODkxKFEpGSo7uW5ci-MPWXEmYWb"
              controls={true}
              width="100%"
              height="100%"
            />
          </Box>
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
          <Box sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}>
            <ReactPlayer
              url="https://drive.google.com/uc?export=download&id=1d73hlJoN3-IPRXv7I_YtIAsLMKQpD6Z7"
              controls={true}
              width="100%"
              height="100%"
            />
          </Box>
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
          <Box sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}>
            <ReactPlayer
              url="https://drive.google.com/uc?export=download&id=1ipIpnP-oWEotWkmFzlheFa3_qutfAZvo"
              controls={true}
              width="100%"
              height="100%"
            />
          </Box>
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
          <Box sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}>
            <ReactPlayer
              url="https://drive.google.com/uc?export=download&id=1Lqasuib1GU4t-K1tgwAPv5CnYkjSQ_if"
              controls={true}
              width="100%"
              height="100%"
            />
          </Box>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Next, we need to select the person who broke the rule. Add a witness
            and evidence, if any.
          </Typography>
          <Box sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}>
            <ReactPlayer
              url="https://drive.google.com/uc?export=download&id=18I6g9x_rivhPc2b4QVNPkNiwIoEpgXWZ"
              controls={true}
              width="100%"
              height="100%"
            />
          </Box>
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
          <Box sx={{ maxWidth: { xs: 1, md: 3 / 4 }, mt: 2 }}>
            <Image
              src="https://drive.google.com/uc?export=download&id=1RKPV9clK8mKjSME3vrMLaoY8HfhgZzeF"
              layout="responsive"
              loading="lazy"
              width={600}
              height={360}
              alt="Animation"
            />
          </Box>
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
