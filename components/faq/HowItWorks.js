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
        <Typography gutterBottom>
          Hello, and thank you for joining us!
        </Typography>
        <Typography>
          In the following sections, you will learn how to use the platform.
        </Typography>
      </Box>
      {/* Step 0 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Prerequisits: Get a crypto-wallet
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            As you might already know, the easiest and most common crypto-wallet
            is, of course, Metamask.
          </Typography>
          <Typography gutterBottom>
            It is an easy to use browser extension for Chrome (and Brave) that
            allows you to interact with all Ethereum compatible blockchains.
          </Typography>
          <Typography gutterBottom>
            To install Metamask go to{' '}
            <Link
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
              underline="none"
              target="_blank"
            >
              chrome.google.com/webstore
            </Link>
            &nbsp; and follow the instructions.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370346/FAQ/how-it-works/animation-small-1_mduhsz.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Once you have installed Metamask, you should see a little fox icon
            on the top right corner of your browser.
          </Typography>
          <Typography gutterBottom>
            We currently run on Mumbai – a Polygon Testnet.
          </Typography>
          <Typography gutterBottom>
            To add this testnet to Metamask go to{' '}
            <Link
              href="https://chainlist.org/chain/80001"
              underline="none"
              target="_blank"
            >
              chainlist.org/chain/80001
            </Link>{' '}
            and follow the instructions.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1657013173/FAQ/how-it-works/animation-small-2-v2_bgfxi7.gif"
            sx={{ maxWidth: 1, mt: 2 }}
            width={1920}
            height={1020}
          />
        </Box>
      </Box>
      {/* Step 1 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Step 1 – Connecting Your Wallet
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            dApps need a wallet in order to interact with the blockchain. So,
            every time you connect to a dApp, you&apos;d need to allow that dApp
            to use your wallet.
          </Typography>
          <Typography gutterBottom>
            To connect your shiny new Metamask wallet with our dApp, click the
            &apos;Connect Wallet&apos; button on the top right corner and select
            the cute Metamask fox-head.
          </Typography>
          <Typography gutterBottom>
            Once you&apos;ve done that, you get a small, or large window showing
            your available accounts. Select one of them and click the
            &apos;Next&apos; and &apos;Connect&apos; buttons.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370346/FAQ/how-it-works/animation-small-3_ilpkpy.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>Great Job!</Typography>
          <Typography gutterBottom>
            When using a crypto chain you&apos;d need to pay for
            &apos;Gas&apos;. Gas is the cost of running a transaction on the
            blockchain.
          </Typography>
          <Typography gutterBottom>
            So next, let&apos;s set you up with some free Tokens, so you can pay
            for your gas fees.
          </Typography>
          <Typography gutterBottom>
            You can get some of those free tokens from the{' '}
            <Link
              href="https://faucet.polygon.technology/"
              underline="none"
              target="_blank"
            >
              faucet.polygon.technology
            </Link>{' '}
            .
          </Typography>
          <Typography gutterBottom>
            To do that, you&apos;ll need your wallet address.
          </Typography>
          <Typography gutterBottom>
            You can your wallet address just click the little fox-head and then
            click your address on the top. It&apos;ll be stored in your
            clipboard automagically.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1657013542/FAQ/how-it-works/animation-small-5-v2_hcpl2e.gif"
            sx={{ maxWidth: 1, mt: 2 }}
            width={1920}
            height={1020}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Then paste your wallet address and wait for the free tokens to show
            up.
          </Typography>
          <Typography gutterBottom>It may take a minute or two...</Typography>
        </Box>
      </Box>
      {/* Step 2 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Step 2 – Creating profile
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Now we need to fill in the account information. Click on the button
            &quot;Claim Your Soul&quot;.
          </Typography>
          <Typography gutterBottom>
            Upload your avatar and fill in information about yourself.
          </Typography>
          <Typography gutterBottom>
            Once you&apos;re done, click &quot;Create Profile&quot; and sign a
            test contract on the Mumbai network.
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
      {/* Step 3 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Step 3 – Joining a jurisdiction
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
      {/* Step 4 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Step 4. Creating Case
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
