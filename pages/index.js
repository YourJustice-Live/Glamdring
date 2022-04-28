import { Box, Tab, Tabs, Typography } from '@mui/material';
import Layout from 'components/layout/Layout';
import ProfileList from 'components/profile/ProfileList';
import { PROFILE_ORDER } from 'constants/subgraph';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { useEffect, useState } from 'react';

export default function Index() {
  const { showToastError } = useToasts();
  const { account } = useWeb3Context();
  const [tabValue, setTabValue] = useState(PROFILE_ORDER.byPositiveRating);
  const { getProfiles } = useProfile();
  const [profiles, setProfiles] = useState(null);

  const handleTabChange = (_, newTabValue) => {
    setTabValue(newTabValue);
  };

  async function loadData() {
    try {
      setProfiles(null);
      setProfiles(await getProfiles(null, null, 12, 0, tabValue));
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  return (
    <Layout enableSidebar={!!account}>
      <Box sx={{ px: 4, mt: 8, textAlign: 'center' }}>
        <Typography variant="h1" gutterBottom>
          Check or impact reputation of crypto people!
        </Typography>
        <Typography>
          Who was involved in the activities that made you uncomfortable?
        </Typography>
      </Box>
      <Box sx={{ mt: 12 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab value={PROFILE_ORDER.byPositiveRating} label="Light Side" />
          <Tab value={PROFILE_ORDER.byNegativeRating} label="Dark Side" />
        </Tabs>
        <ProfileList profiles={profiles} sx={{ mt: 2 }} />
      </Box>
    </Layout>
  );
}
