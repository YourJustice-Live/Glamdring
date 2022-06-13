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
        <Typography gutterBottom>Hello, and thank you for joining us!</Typography>
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
            As you might already know, the easiest and most common crypto-wallet is, of course, Metamask.
          </Typography>
          <Typography gutterBottom>
            It is an easy to use browser extension for Chrome (and Brave) that allows you to interact with all Ethereum compatible blockchains.
          </Typography>
          <Typography gutterBottom>
            To install Metamask go to {' '}
            <Link
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
              underline="none"
              target="_blank"
            >
              chrome.google.com/webstore
            </Link>
            &nbsp;
            and follow the instructions
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370346/FAQ/how-it-works/animation-small-1_mduhsz.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Once you have installed Metamask, you should see a little fox icon on the top right corner of your browser.
          </Typography>
          <Typography gutterBottom>
            We currently run on Rinkeby – an Ethereum Testnet.
            So, you'd need to click that little fox icon to open your Metamask, go to 'Settings', 'Advanced' and turn on the 'Show Test Netwoks' option.
          </Typography>
          <Typography gutterBottom>
            This will allow your Metamask to connect to test networks, where tokens are free!
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370346/FAQ/how-it-works/animation-small-2_xuyfiv.gif"
            sx={{ maxWidth: 1, mt: 2 }}
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
            dApps need a wallet in order to interact with the blockchain. So, every time you connect to a dApp, you'd need to allow that dApp to use your wallet.
          </Typography>
          <Typography gutterBottom>
            To connect your shiny new Metamask wallet with our dApp, click the 'Connect Wallet' button on the top right corner and select the cute Metamask fox-head.
          </Typography>
          <Typography gutterBottom>
            Once you've done that, you get a small, or large window showing your available accounts. Select one of them and click the 'Next' and 'Connect' buttons.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370346/FAQ/how-it-works/animation-small-3_ilpkpy.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Great, you are now connected!
          </Typography>
          <Typography gutterBottom>
            Now all you need to do is switch to the Rinkeby test network and you're all set.
          </Typography>
          <Typography gutterBottom>
            To switch newtowkrs, click the little fox-head icon again and select the 'Rinkeby Test Network' option.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370347/FAQ/how-it-works/animation-small-4_xilh9k.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Great Job!
          </Typography>
          <Typography gutterBottom>
            When using a crypto chain you'd need to pay for 'Gas'. Gas is the cost of running a transaction on the blockchain.
          </Typography>
          <Typography gutterBottom>
            So next, let's set you up with some free Tokens, so you can pay for your gas fees.
          </Typography>
          <Typography gutterBottom>
            You can get some of those free tokens from the {' '}
            <Link
              href="https://rinkebyfaucet.com/"
              underline="none"
              target="_blank"
            >
              rinkebyfaucet.com
            </Link>{' '}
            or {' '}
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
            To do that, you'll need your wallet address.
          </Typography>
          <Typography gutterBottom>
            You can your wallet address just click the little fox-head and then click your address on the top.
            It'll be stored in your clipboard automagically.
          </Typography>
          <ImageBox
            url="https://res.cloudinary.com/yourjustice/image/upload/v1652370347/FAQ/how-it-works/animation-small-5_np25qd.gif"
            sx={{ maxWidth: 1, mt: 2 }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Then pase your wallet address in one of these faucets and wait for the free tokens to show up.
          </Typography>
          <Typography gutterBottom>
            It may take a minute or two...
          </Typography>
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
