import { Skeleton, Stack, Typography } from '@mui/material';
import LawCard from './LawCard';

/**
 * A component with a list of laws.
 */
export default function LawList({ laws, isCommentsEnabled, sx }) {
  return (
    <Stack spacing={2} sx={{ ...sx }}>
      {!laws && (
        <>
          <Skeleton
            variant="rectangular"
            sx={{ mb: 1 }}
            width={196}
            height={24}
          />
          <Skeleton variant="rectangular" width={82} height={24} />
        </>
      )}
      {laws && laws.size === 0 && <Typography>No laws</Typography>}
      {laws && laws.size > 0 && (
        <>
          {[...laws.keys()].map((key) => (
            <LawCard
              key={key}
              law={laws.get(key)}
              isCommentsEnabled={isCommentsEnabled}
            />
          ))}
        </>
      )}
    </Stack>
  );
}
