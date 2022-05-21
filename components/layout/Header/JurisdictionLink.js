import { Avatar, Skeleton, Stack, Typography } from '@mui/material';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import { IconJurisdiction } from 'icons';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * A component with a jurisdiction link for navigation.
 */
export default function JurisdictionLink() {
  const router = useRouter();
  const { showToastError } = useToasts();
  const { getJurisdiction } = useJurisdiction();
  const [jurisdiction, setJurisdiction] = useState(null);

  useEffect(() => {
    getJurisdiction(process.env.NEXT_PUBLIC_MAIN_JURISDICTION_CONTRACT_ADDRESS)
      .then((jurisdiction) => setJurisdiction(jurisdiction))
      .catch((error) => showToastError(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ ml: 1.5, cursor: jurisdiction ? 'pointer' : null }}
      onClick={() => {
        router.push(`/jurisdiction/${jurisdiction?.id || ''}`);
      }}
    >
      {jurisdiction ? (
        <>
          <Avatar
            sx={{
              width: 22,
              height: 22,
              fontSize: 14,
            }}
            src={jurisdiction.image}
          >
            <IconJurisdiction width="22" height="22" />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {jurisdiction.name}
          </Typography>
        </>
      ) : (
        <Skeleton variant="rectangular" height={22} width={164} />
      )}
    </Stack>
  );
}
