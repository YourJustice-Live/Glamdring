import {
  Avatar,
  Card,
  CardContent,
  Link,
  Skeleton,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { JURISDICTION_ROLE } from 'constants/contracts';
import { IconJurisdiction } from 'icons/entities';
import { truncate } from 'lodash';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

/**
 * A component with a card with jurisdiction.
 */
export default function JurisdictionCard({ jurisdiction }) {
  const { t } = useTranslation('common');
  const [citizensCount, setCitizensCount] = useState(null);

  useEffect(() => {
    if (jurisdiction) {
      const memberRole = jurisdiction.roles.find(
        (role) => role.roleId === JURISDICTION_ROLE.member.id,
      );
      setCitizensCount(memberRole?.participantsCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jurisdiction]);

  return (
    <Card elevation={1}>
      {jurisdiction ? (
        <CardContent sx={{ p: '10px !important' }}>
          <Box
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            {/* Image */}
            <Box sx={{ mr: 2 }}>
              <NextLink href={`/jurisdiction/${jurisdiction.id}`} passHref>
                <Avatar
                  sx={{
                    cursor: 'pointer',
                    width: 82,
                    height: 82,
                    borderRadius: '16px',
                  }}
                  src={jurisdiction.uriData?.image}
                >
                  <IconJurisdiction width="82" height="82" />
                </Avatar>
              </NextLink>
            </Box>
            {/* Details */}
            <Box>
              <NextLink href={`/jurisdiction/${jurisdiction.id}`} passHref>
                <Link variant="h4" underline="none">
                  {jurisdiction.name || t('text-unknown')}
                </Link>
              </NextLink>
              <Typography variant="body2">
                {truncate(jurisdiction.uriData?.description, { length: 36 })}
              </Typography>
              {citizensCount > 0 && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {citizensCount} {t('text-citizens').toLowerCase()}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      ) : (
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="rectangular" width={164} height={24} />
          <Skeleton
            variant="rectangular"
            width={82}
            height={16}
            sx={{ mt: 1 }}
          />
        </CardContent>
      )}
    </Card>
  );
}
