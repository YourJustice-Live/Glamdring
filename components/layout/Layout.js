import { Box, Container, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Footer from "components/layout/Footer";
import Header from "components/layout/Header";
import Head from 'next/head';
import AccountNavigation from './AccountNavigation';

/**
 * Component: Layout
 */
export default function Layout({ children, title, showAccountNavigation }) {

  const theme = useTheme();
  const isGreaterMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      <Head>
        <title>{title ? title : "YourJustice"}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Header>
      </Header>
      <Container>
        {/* Container for screen greater then medium */}
        {isGreaterMediumScreen && (
          <Box sx={{ display: 'flex', py: 4 }}>
            {showAccountNavigation && <AccountNavigation variant='drawer' />}
            <Box sx={{ flexGrow: 1 }}>
              <Toolbar />
              {children}
            </Box>
          </Box>
        )}
        {/* Container for screen less then medium */}
        {!isGreaterMediumScreen && (
          <Box sx={{ display: 'flex', py: 4 }}>
            <Box sx={{ flexGrow: 1 }}>
              {showAccountNavigation && <AccountNavigation variant='top' />}
              {!showAccountNavigation && <Toolbar />}
              {children}
            </Box>
          </Box>
        )}
      </Container>
      <Footer>
      </Footer>
    </>
  )
}