import { Box, Divider, Typography } from '@mui/material';
import LawList from 'components/law/LawList';
import useLaw from 'hooks/useLaw';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A component with jurisdiction laws.
 */
export default function JurisdictionLaws() {
  const { showToastError } = useToasts();
  const { getJurisdictionLaws } = useLaw();
  const [laws, setLaws] = useState(null);

  async function loadData() {
    try {
      setLaws(await getJurisdictionLaws());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box>
        <Typography variant="h1" gutterBottom>
          Laws
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ mt: 3 }}>
        <LawList laws={laws} />
      </Box>
    </>
  );
}
