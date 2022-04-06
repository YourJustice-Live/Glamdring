import React from 'react';
import useWeb3Context from 'hooks/useWeb3Context'
import Link from 'next/link';;
import AppBar from '@mui/material/AppBar';
import { Box, Toolbar, Menu, MenuItem, Tooltip, Divider, Avatar, Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from '@mui/icons-material';
import Container from '@mui/material/Container';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
import { HeaderButton } from './HeaderButton';
import { Logo, IconRoadMap, IconWallet, IconProfile, IconHome } from 'icons';


//SearchBar
// import { styled, alpha } from '@mui/material/styles';
// import SearchIcon from '@mui/icons-material/Search';


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
  }
};
const settingsButtonSX = {
};

/**
 * Component: Header Naviagtion
 */
const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  // const { loadWeb3Modal, logoutOfWeb3Modal, account } = useWeb3Modal(); //provider,
  const { network, account, connectWallet, disconnectWallet } = useWeb3Context();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  // const pages = ['Products', 'Pricing', 'Blog'];
  const pages = [
    { display: !!account, name: '', url: `/profile/`, icon: <IconHome /> },
    { display: !!account, name: 'Create own profile', url: '/profile/manage', icon: <IconProfile hexColor="#5E42CC" /> },
    // { name: 'Search', url: '/search' },
  ];
  const settings = [
    { name: 'Profile', url: '/profile', icon: <IconProfile hexColor="#5E42CC" /> },
    // { name: 'Log Out', url: '/profile', icon: <IconProfile hexColor="#5E42CC" /> },
  ];

  /* Possible Search Stuff   https://mui.com/components/app-bar/
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
        },
    }));
 
    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));
 
    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
        },
    }));
*/

  return (
    <AppBar color="inherit" position="fixed" elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0px 2px 6px rgba(118, 139, 160, 0.05)',
      }}>

      <Container>
        <Toolbar disableGutters>
          <Typography display="flex" alignItems="center" variant="h3" noWrap component="div"
            sx={{
              mr: 6, display: {
                xs: 'none', md: 'flex',
                fontSize: '3rem'
              },
            }}
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


          {/*
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          */}

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' }, }}
            >
              {/* Tiny Devices Menu */}
              {pages.map((page) => (page.display !== false ? (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link key={page.name} href={page.url} underline="none">
                    <Button key={page.name} variant="outlined" onClick={handleCloseNavMenu} sx={headerButtonSX} startIcon={page.icon}>
                      {page.name}
                    </Button>
                  </Link>
                </MenuItem>
              ) : null
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            <Logo />
          </Typography>
          <Box id="menu-full" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* Fullsize Menu */}
            {pages.map((page) => (page.display !== false ? (
              <Link key={page.name} href={page.url} underline="none">
                <Button key={page.name} variant="outlined" onClick={handleCloseNavMenu} sx={headerButtonSX} startIcon={page.icon}>
                  {page.name}
                </Button>
              </Link>
            ) : null
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {/* User Menu */}
            {!account ? (
              <HeaderButton onClick={connectWallet} startIcon={<IconWallet />}>Connect Wallet</HeaderButton>
            ) : (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {/* <AccountCircle style={{ width: '38px', height: '38px', color: '#111' }} /> */}
                    <IconProfile hexColor="#5E42CC" />
                  </IconButton>
                </Tooltip>
                <Menu id="menu-appbar"
                  sx={{
                    mt: '45px',
                    padding: '15px',
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
                    Polygon
                    <span>0x7f6r...2Fv235</span>
                  </Box>

                  {settings.map((setting) => (
                    <MenuItem key={setting.name} onClick={() => { handleCloseUserMenu(); }}>
                      {/* <Button key={setting.name} sx={settingsButtonSX} startIcon={setting.icon}> */}
                      <Link key={setting.name} href={setting.url} underline="none">
                        <Typography key={setting.name} sx={settingsButtonSX}>
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
      </Container>
    </AppBar >
  );
};
export default ResponsiveAppBar;