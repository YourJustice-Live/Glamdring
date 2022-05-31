import { MenuOutlined } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Link as MuiLink,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import {
  IconHome,
  IconMember,
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

/**
 * A component with a header navigation.
 */
export default function Navigation() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { account, connectWallet, disconnectWallet } = useWeb3Context();
  const { accountProfile } = useDataContext();
  const { isAccountProfileHasAwaitingCases } = useDataContext();
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
          sx={{ mr: 6, display: { xs: 'none', md: 'flex' }, fontSize: '3rem' }}
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
            v.{process.env.NEXT_PUBLIC_VERSION}
          </Typography>
        </Typography>

        {/* Mobile logo */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
        >
          <Link href="/">
            <a style={{ display: 'flex' }}>
              <Logo />
            </a>
          </Link>
        </Typography>

        {/* Desktop key button */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'row-reverse',
          }}
        >
          {/* account && accountProfile && (
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
            )*/}
          {account && !accountProfile && (
            <Link href="/profile/create" passHref>
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

        {/* Menu button and menu component */}
        <Tooltip title="Open Menu">
          <IconButton onClick={handleOpenUserMenu} sx={{ ml: 1, p: '6px' }}>
            <Avatar
              src={accountProfile?.avatarNftUriImage}
              sx={{ width: 36, height: 36 }}
            >
              {account ? (
                <IconMember width="36" height="36" />
              ) : (
                <MenuOutlined sx={{ color: palette.grey[600] }} />
              )}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          id="menu"
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
          {/* Menu items */}
          {!account && (
            <MenuItem onClick={connectWallet}>
              <Typography textAlign="center">Connect Wallet</Typography>
            </MenuItem>
          )}
          {account && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mx: '15px',
                my: '10px',
                pb: '14px',
                borderBottom: '1px solid gray',
                borderColor: 'grey.200',
              }}
            >
              {accountProfile && (
                <Link href={`/profile/${accountProfile.account}`} passHref>
                  <MuiLink underline="none">
                    {accountProfile.avatarNftUriFirstName || 'Anonymous'}{' '}
                    {accountProfile.avatarNftUriLastName}
                  </MuiLink>
                </Link>
              )}
              <Typography variant="body2">{formatAddress(account)}</Typography>
            </Box>
          )}
          {account && accountProfile && (
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                showDialog(<CaseCreateDialog onClose={closeDialog} />);
              }}
            >
              <Typography>Create Case</Typography>
            </MenuItem>
          )}
          {account && !accountProfile && (
            <MenuItem onClick={handleCloseUserMenu}>
              <Link href="/profile/create" passHref>
                <Typography>Create Own Profile</Typography>
              </Link>
            </MenuItem>
          )}
          <MenuItem onClick={handleCloseUserMenu}>
            <Link href="/profiles" passHref>
              <Typography>Souls</Typography>
            </Link>
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <Link href="/cases" passHref>
              <Badge
                color="danger"
                badgeContent={isAccountProfileHasAwaitingCases ? 1 : 0}
                variant="dot"
                sx={{ '& .MuiBadge-badge': { top: '4px', right: '-10px' } }}
              >
                <Typography>Cases</Typography>
              </Badge>
            </Link>
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <Link href="/jurisdictions" passHref>
              <Typography>Jurisdictions</Typography>
            </Link>
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <Link href="/faq" passHref>
              <Typography>FAQ</Typography>
            </Link>
          </MenuItem>
          {account && (
            <MenuItem onClick={disconnectWallet}>
              <Typography textAlign="center">Disconnect Wallet</Typography>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
