import { IconButton, Link, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useToasts from 'hooks/useToasts';
import { IconCopy, IconLink } from 'icons/core';
import { useTranslation } from 'next-i18next';
import { formatAddress } from 'utils/formatters';

/**
 * A component with an address, link and buttons to copy.
 */
export default function InteractiveAddress({
  address,
  link,
  isAddressLinkable = false,
  isCopyAddressButtonEnabled = true,
  isCopyLinkButtonEnabled = true,
  sx,
}) {
  const { t } = useTranslation('common');
  const { showToastSuccess } = useToasts();

  if (address) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          ...sx,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mr: isCopyAddressButtonEnabled || isCopyLinkButtonEnabled ? 0.8 : 0,
          }}
        >
          {/* Make address clickable if required */}
          {isAddressLinkable ? (
            <Link href={link} underline="none">
              {formatAddress(address)}
            </Link>
          ) : (
            <>{formatAddress(address)}</>
          )}
        </Typography>
        {isCopyAddressButtonEnabled && (
          <Tooltip title={t('text-copy-address-to-clipboard')}>
            <IconButton
              color="primary"
              aria-label={t('text-copy-address-to-clipboard')}
              sx={{ p: '3px' }}
              onClick={() => {
                navigator.clipboard.writeText(address);
                showToastSuccess(t('notification-address-is-copied'));
              }}
            >
              <IconCopy width="18" height="18" />
            </IconButton>
          </Tooltip>
        )}
        {isCopyLinkButtonEnabled && (
          <Tooltip title={t('text-copy-link-to-clipboard')}>
            <IconButton
              color="primary"
              aria-label={t('text-copy-link-to-clipboard')}
              sx={{ p: '3px' }}
              onClick={() => {
                navigator.clipboard.writeText(link);
                showToastSuccess(t('notification-link-is-copied'));
              }}
            >
              <IconLink width="18" height="18" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }

  return <></>;
}
