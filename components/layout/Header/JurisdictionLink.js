import { Avatar, Skeleton, Stack, Typography } from '@mui/material';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useToasts from 'hooks/useToasts';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * A component with a jurisdiction link for navigation.
 */
export default function JurisdictionLink() {
  const router = useRouter();
  const { showToastError } = useToasts();
  const { getName } = useJuridictionContract();
  const [jurisdiction, setJurisdiction] = useState(null);

  async function loadData() {
    try {
      const name = await getName();
      setJurisdiction({
        name: name,
        image: null,
      });
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ ml: 1.5, cursor: jurisdiction ? 'pointer' : null }}
      onClick={() => {
        if (jurisdiction) {
          router.push(`/jurisdiction`);
        }
      }}
    >
      {jurisdiction ? (
        <>
          <Avatar
            sx={{
              width: 22,
              height: 22,
              bgcolor: 'primary.main',
              fontSize: 14,
            }}
            src={jurisdiction.image}
          >
            J
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
