import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import useDialogContext from 'hooks/useDialogContext';
import useWeb3Context from 'hooks/useWeb3Context';
import {
  IconHome,
  IconNotification,
  IconPlus,
  IconProfile,
  IconWallet,
  Logo,
} from 'icons';
import Link from 'next/link';
import React from 'react';
import { palette } from 'theme/palette';
import { formatAddress } from 'utils/formatters';
import JurisdictionLink from './JurisdictionLink';

/**
 * A component with a header navigation.
 */
export default function Navigation() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { account, accountProfile, connectWallet, disconnectWallet } =
    useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      color="inherit"
      position="fixed"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0px 2px 6px rgba(118, 139, 160, 0.1)',
      }}
    >
      <Toolbar>
        {/* Desktop logo and jurisdiction */}
        <Typography
          display="flex"
          alignItems="center"
          variant="h3"
          noWrap
          component="div"
          sx={{ mr: 6, display: { xs: 'none', md: 'flex', fontSize: '3rem' } }}
        >
          <Link href="/">
            <a style={{ display: 'flex' }}>
              <Logo />
            </a>
          </Link>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              opacity: 0.6,
              pl: 1.875,
              lineHeight: '2.3em',
            }}
          >
            v.0.1
          </Typography>
          <Divider
            orientation="horizontal"
            sx={{
              height: 22,
              width: '1px',
              backgroundColor: 'grey.200',
              opacity: 0.5,
              border: 'none',
              ml: 1.5,
            }}
          />
          <JurisdictionLink />
        </Typography>

        {/* Mobile logo */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
        >
          <Logo />
        </Typography>

        {/* Key button */}
        <Box
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row-reverse' }}
        >
          {account && accountProfile && (
            <Button
              variant="secondary"
              sx={{ display: { xs: 'none', md: 'flex' } }}
              startIcon={<IconPlus />}
              onClick={() =>
                showDialog(<CaseCreateDialog onClose={closeDialog} />)
              }
            >
              Create Case
            </Button>
          )}
          {account && !accountProfile && (
            <Link href="/profile/manage" passHref>
              <Button
                variant="secondary"
                sx={{ display: { xs: 'none', md: 'flex' } }}
                startIcon={<IconProfile />}
              >
                Create Own Profile
              </Button>
            </Link>
          )}
          {!account && (
            <Button
              variant="secondary"
              onClick={connectWallet}
              startIcon={<IconWallet />}
            >
              Connect Wallet
            </Button>
          )}
        </Box>

        {/* Home button */}
        {account && (
          <Box sx={{ flexGrow: 0 }}>
            <Link href="/" passHref>
              <IconButton sx={{ ml: 2 }}>
                <IconHome />
              </IconButton>
            </Link>
          </Box>
        )}

        {/* Notification button */}
        {account && (
          <Box sx={{ flexGrow: 0 }}>
            <Link href="/events" passHref>
              <IconButton sx={{ ml: 0.4 }}>
                <IconNotification />
              </IconButton>
            </Link>
          </Box>
        )}

        {/* Menu button and menu */}
        {account && (
          <>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ ml: 1, p: '6px' }}>
                <Avatar
                  src={accountProfile?.avatarNftUriImage}
                  sx={{ bgcolor: 'grey.50', width: 36, height: 36 }}
                >
                  <IconProfile hexColor={palette.grey[600]} />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              sx={{
                mt: '45px',
                padding: '15px',
                [`& .MuiPaper-root`]: {
                  padding: 0,
                  borderRadius: '15px',
                  overflow: 'hidden',
                },
              }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Box
                sx={{
                  mx: '15px',
                  my: '10px',
                  pb: '10px',
                  borderBottom: '1px solid gray',
                  borderColor: 'grey.200',
                }}
              >
                <span>{formatAddress(account)}</span>
              </Box>
              {accountProfile && (
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                  }}
                >
                  <Link href="/profile" passHref>
                    <Typography>Profile</Typography>
                  </Link>
                </MenuItem>
              )}
              <MenuItem onClick={disconnectWallet}>
                <Typography textAlign="center">Disconnect Wallet</Typography>
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
