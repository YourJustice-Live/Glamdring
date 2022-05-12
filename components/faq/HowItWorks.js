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
      {/* Chapter 0 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Chapter 0. Choose your crypto-wallet
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            We recommend use Metamask. It is easy to use / install.
          </Typography>
          <Typography gutterBottom>
            Metamask is adapted for use with your browser. To install Metamask
            go to{' '}
            <Link
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
              underline="none"
              target="_blank"
            >
              chrome.google.com/webstore
            </Link>
            .
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370346/FAQ/how-it-works/animation-small-1_mduhsz.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            In the Metamask settings, enable the ability to connect to different
            networks.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370346/FAQ/how-it-works/animation-small-2_xuyfiv.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
      </Box>
      {/* Chapter 1 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Chapter 1. Connecting wallet
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Let connect your cryptocurrency wallet to our site.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370346/FAQ/how-it-works/animation-small-3_ilpkpy.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Great, now let&apos;s switch to the Rinkeby test network.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370347/FAQ/how-it-works/animation-small-4_xilh9k.gif"
            sx={{ maxWidth: 1, mt: 2 }}
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
            </Link>{' '}
            or you can also use{' '}
            <Link
              href="https://faucets.chain.link/rinkeby"
              underline="none"
              target="_blank"
            >
              faucets.chain.link
            </Link>
            .
          </Typography>
          <Typography gutterBottom>
            In order to do this, you just need to copy your wallet number and
            paste it into the line.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370347/FAQ/how-it-works/animation-small-5_np25qd.gif"
            sx={{ maxWidth: 1, mt: 2 }}
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
            Once you&apos;re done, click &quot;Create Profile&quot; and sign a
            test contract on the Rinkeby network.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370347/FAQ/how-it-works/animation-small-6_oxvyaj.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Welcome, you are now a new member of the YJ community.
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
            about an investor who has defaulted on his obligations towards us.
          </Typography>
          <Typography gutterBottom>
            To do this, we need to click on the &apos;Create Case&apos; button.
          </Typography>
          <Typography gutterBottom>
            First, we need to join the existing jurisdiction. The information
            about joining a jurisdiction will go on the blockchain. On this
            step, we need to sign the contract once again.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370350/FAQ/how-it-works/animation-small-7_ebyagy.gif"
            sx={{ maxWidth: 1, mt: 2 }}
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
            We need to decide whether we want to appreciate a person’s act or
            report a bad action?
          </Typography>
          <Typography gutterBottom>
            Next, we need to choose an action. Let&apos;s get back to our case.
            A member of your team was not focused enough on my idea. This seems
            to fit under the &quot;Slashed or ignored a good idea&quot; action.
          </Typography>
          <Typography gutterBottom>
            By the way, don&apos;t forget to set the name of this case and
            choose the rule that is broken within our jurisdiction.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370348/FAQ/how-it-works/animation-small-8_wdfy0a.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Next, we need to select the person who broke the rule. Add a witness
            and evidence, if any.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370350/FAQ/how-it-works/animation-small-9_rebst6.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Click &quot;Create Case&quot; and voilà! You have added your first
            case.
          </Typography>
          <Typography gutterBottom>
            In order for your case to be registered online, you also need to
            sign a contract.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370407/FAQ/how-it-works/animation-small-10_thevxh.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
            We look forward to hearing about your case!
          </Typography>
          <Typography gutterBottom>
            Willing to help? Record a Loom or send us Feedback.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
