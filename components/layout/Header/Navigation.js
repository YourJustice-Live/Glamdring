import { AppBar, Avatar, Box, Button, Divider, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import useWeb3Context from 'hooks/useWeb3Context';
import { IconHome, IconProfile, IconWallet, Logo } from 'icons';
import Link from 'next/link';
import React from 'react';
import { formatAccount } from 'utils/formatters';

const DEFAULT_JURISDICTION_NAME = 'Crypto Valley';
const DEFAULT_JURISDICTION_IMG_PATH = '/images/defaultJurisdictionAvatar.png';

const headerButtonSX = {
  ml: 1.5,
  borderRadius: '12px',
  border: 'none',
  height: 36,
  textTransform: 'none',
  backgroundColor: 'rgba(173, 155, 245, 0.08)',
  '&:hover': {
    border: 'none',
  },
};

/**
 * A component with a header navigation.
 */
export default function Navigation() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { account, connectWallet, disconnectWallet } = useWeb3Context();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const pages = [
    { display: !!account, name: null, url: `/profile/`, icon: <IconHome /> },
    { display: !!account, name: 'Create own profile', url: '/profile/manage', icon: <IconProfile hexColor="#5E42CC" /> },
  ];
  const settings = [
    { name: 'Profile', url: '/profile', icon: <IconProfile hexColor="#5E42CC" /> },
  ];

  return (
    <AppBar color="inherit" position="fixed" elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0px 2px 6px rgba(118, 139, 160, 0.1)',
      }}>
      <Toolbar>

        {/* Desktop logo and jurisdiction */}
        <Typography display="flex" alignItems="center" variant="h3" noWrap component="div"
          sx={{ mr: 6, display: { xs: 'none', md: 'flex', fontSize: '3rem' } }}
        >
          <Link href="/">
            <a style={{ display: 'flex' }}>
              <Logo />
            </a>
          </Link>
          <Typography variant="h5" sx={{ color: 'text.secondary', opacity: 0.6, pl: 1.875, lineHeight: "2.3em" }}>
            v.0.1
          </Typography>
          <Divider orientation="horizontal" sx={{ height: 22, width: '1px', backgroundColor: 'grey.200', opacity: 0.5, border: 'none', ml: 1.5, }} />
          <Avatar sx={{ width: 22, height: 22, ml: 1.5, mr: 0.75 }} src={DEFAULT_JURISDICTION_IMG_PATH} />
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {DEFAULT_JURISDICTION_NAME}
          </Typography>
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

        {/* Pages */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'row-reverse' }}>
          {pages.map((page) => (page.display !== false ? (
            <Link key={page.name} href={page.url} underline="none">
              <Button key={page.name} variant="outlined" sx={headerButtonSX} startIcon={page.icon}>
                {page.name}
              </Button>
            </Link>
          ) : null
          ))}
        </Box>

        {/* Settings menu */}
        <Box sx={{ flexGrow: 0 }}>
          {!account ? (
            <Button variant="outlined" sx={headerButtonSX} onClick={connectWallet} startIcon={<IconWallet />}>
              Connect Wallet
            </Button>
          ) : (
            <>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ ml: 2, p: 0 }}>
                  <IconProfile hexColor="#5E42CC" />
                </IconButton>
              </Tooltip>
              <Menu id="menu-appbar"
                sx={{
                  mt: '45px',
                  padding: '15px',
                  [`& .MuiPaper-root`]: {
                    padding: 0, borderRadius: '15px', overflow: 'hidden'
                  }
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
                <Box sx={{ mx: '15px', my: '10px', pb: '10px', borderBottom: "1px solid gray", borderColor: 'grey.200' }}>
                  <span>{formatAccount(account)}</span>
                </Box>
                {settings.map((setting) => (
                  <MenuItem key={setting.name} onClick={() => { handleCloseUserMenu(); }}>
                    <Link key={setting.name} href={setting.url} underline="none">
                      <Typography key={setting.name}>
                        {setting.name}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
                <MenuItem onClick={disconnectWallet}>
                  <Typography textAlign="center">Disconnect Wallet</Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar >
  );
};