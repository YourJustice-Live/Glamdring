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
  IconNotification,
  IconProfile,
  IconWallet,
} from 'icons/core';
import { IconMember } from 'icons/entities';
import { Logo } from 'icons/logo';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';
import { palette } from 'theme/palette';
import { formatAddress, formatProfileFirstLastName } from 'utils/formatters';

/**
 * A component with a header navigation.
 */
export default function Navigation() {
  const { t } = useTranslation('common');
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
          {account && !accountProfile && (
            <Link href="/profile/create" passHref>
              <Button
                variant="secondary"
                sx={{ display: { xs: 'none', md: 'flex' } }}
                startIcon={<IconProfile />}
              >
                {t('button-profile-create-own')}
              </Button>
            </Link>
          )}
          {!account && (
            <Button
              variant="secondary"
              onClick={connectWallet}
              startIcon={<IconWallet />}
            >
              {t('button-wallet-connect')}
            </Button>
          )}
        </Box>

        {/* Home button */}
        {account && (
          <Box sx={{ flexGrow: 0 }}>
            <Link href="/" passHref>
              <IconButton sx={{ ml: 2 }}>
                <IconHome color={palette.text.secondary} />
              </IconButton>
            </Link>
          </Box>
        )}

        {/* Notification button */}
        {account && (
          <Box sx={{ flexGrow: 0 }}>
            <Link href="/events" passHref>
              <IconButton sx={{ ml: 0.4 }}>
                <IconNotification color={palette.text.secondary} />
              </IconButton>
            </Link>
          </Box>
        )}

        {/* Menu button and menu component */}
        <Tooltip title="Open Menu">
          <IconButton onClick={handleOpenUserMenu} sx={{ ml: 1, p: '6px' }}>
            <Avatar
              src={accountProfile?.uriImage}
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
            [`& .MuiBackdrop-root`]: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
          {/* Connect wallet button */}
          {!account && (
            <Box
              sx={{
                pt: '12px',
                pb: '6px',
                px: '16px',
                display: 'flex',
              }}
            >
              <Button
                sx={{ flex: 1 }}
                variant="outlined"
                size="small"
                onClick={() => {
                  handleCloseUserMenu();
                  connectWallet();
                }}
              >
                {t('button-wallet-connect')}
              </Button>
            </Box>
          )}
          {/* Account info */}
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
                <Link href={`/profile/${accountProfile.id}`} passHref>
                  <MuiLink underline="none">
                    {formatProfileFirstLastName(accountProfile)}
                  </MuiLink>
                </Link>
              )}
              <Typography variant="body2">{formatAddress(account)}</Typography>
            </Box>
          )}
          {/* Create case button */}
          {account && accountProfile && (
            <Box
              sx={{
                pt: '6px',
                pb: '12px',
                px: '16px',
                display: 'flex',
              }}
            >
              <Button
                sx={{ flex: 1 }}
                variant="outlined"
                size="small"
                onClick={() => {
                  handleCloseUserMenu();
                  showDialog(<CaseCreateDialog onClose={closeDialog} />);
                }}
              >
                {t('button-case-create')}
              </Button>
            </Box>
          )}
          {/* Create own profile link */}
          {account && !accountProfile && (
            <Link href="/profile/create" passHref>
              <Box
                sx={{
                  pt: '6px',
                  pb: '12px',
                  px: '16px',
                  display: 'flex',
                }}
              >
                <Button
                  sx={{ flex: 1 }}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    handleCloseUserMenu();
                  }}
                >
                  {t('button-profile-create-own')}
                </Button>
              </Box>
            </Link>
          )}
          {/* Profiles link */}
          <Link href="/profiles" passHref>
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography>{t('text-profiles')}</Typography>
            </MenuItem>
          </Link>
          {/* Jurisdictions link */}
          <Link href="/jurisdictions" passHref>
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography>{t('text-jurisdictions')}</Typography>
            </MenuItem>
          </Link>
          {/* Cases link */}
          <Link href="/cases" passHref>
            <MenuItem onClick={handleCloseUserMenu}>
              <Badge
                color="danger"
                badgeContent={isAccountProfileHasAwaitingCases ? 1 : 0}
                variant="dot"
                sx={{ '& .MuiBadge-badge': { top: '4px', right: '-10px' } }}
              >
                <Typography>{t('text-cases')}</Typography>
              </Badge>
            </MenuItem>
          </Link>
          {/* Faq link */}
          <Link href="/faq" passHref>
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography>{t('text-faq')}</Typography>
            </MenuItem>
          </Link>
          {/* Contacts link */}
          <Link href="/contacts" passHref>
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography>{t('text-contacts')}</Typography>
            </MenuItem>
          </Link>
          {/* Disconnect wallet button */}
          {account && (
            <Box
              sx={{
                pt: '12px',
                pb: '6px',
                px: '16px',
                display: 'flex',
              }}
            >
              <Button
                sx={{ flex: 1 }}
                variant="outlined"
                size="small"
                onClick={disconnectWallet}
              >
                {t('button-wallet-disconnect')}
              </Button>
            </Box>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
