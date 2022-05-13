import {
  Avatar,
  Card,
  CardContent,
  Link,
  Skeleton,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import NextLink from 'next/link';

/**
 * A component with a card with jurisdiction.
 */
export default function JurisdictionCard({ jurisdiction }) {
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
                    bgcolor: 'primary.main',
                    width: 82,
                    height: 82,
                    borderRadius: '16px',
                  }}
                  src={jurisdiction.image}
                >
                  J
                </Avatar>
              </NextLink>
            </Box>
            {/* Details */}
            <Box>
              <NextLink href={`/jurisdiction/${jurisdiction.id}`} passHref>
                <Link variant="h4" underline="none">
                  {jurisdiction.name || 'Unnamed Jurisdiction'}
                </Link>
              </NextLink>
              <Typography variant="body2">
                {jurisdiction.description}
              </Typography>
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
