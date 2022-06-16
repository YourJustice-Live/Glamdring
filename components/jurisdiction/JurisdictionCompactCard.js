import { Avatar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { IconJurisdiction } from 'icons/entities';
import { useTranslation } from 'next-i18next';
import { formatAddress } from 'utils/formatters';

/**
 * A component with a compact card with jurisdiction.
 */
export default function JurisdctionCompactCard({ jurisdiction, sx }) {
  const { t } = useTranslation('common');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...sx,
      }}
    >
      {jurisdiction ? (
        <>
          <Avatar
            src={jurisdiction.uriData?.image}
            sx={{ width: 24, height: 24 }}
          >
            <IconJurisdiction width="24" heigth="24" />
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 1 }}>
            {jurisdiction.name}
          </Typography>
          <Typography sx={{ color: 'text.secondary', ml: 1 }}>
            ({formatAddress(jurisdiction.id)})
          </Typography>
        </>
      ) : (
        <Typography variant="body2">{t('text-unknown')}</Typography>
      )}
    </Box>
  );
}
