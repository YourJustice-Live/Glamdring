import { Box, Pagination, Tab, Tabs, Typography } from '@mui/material';
import ProfileSelect from 'components/form/widget/ProfileSelect';
import Layout from 'components/layout/Layout';
import ProfileList from 'components/profile/ProfileList';
import { PROFILE_ORDER } from 'constants/subgraph';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useErrors from 'hooks/useErrors';
import useProfile from 'hooks/useProfile';
import { Icon3User } from 'icons/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';

/**
 * Main page with profiles from light side and dark side.
 */
export default function Index() {
  const router = useRouter();
  const { handleError } = useErrors();
  const { account } = useWeb3Context();
  const [tabValue, setTabValue] = useState(PROFILE_ORDER.byPositiveRating);
  const { getProfiles } = useProfile();
  const [profiles, setProfiles] = useState(null);
  const [profilesCount, setProfilesCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCount, setCurrentPageCount] = useState(1);
  const pageSize = 12;

  const handleTabChange = (_, newTabValue) => {
    setTabValue(newTabValue);
  };

  async function loadData(page = currentPage, pageCount = currentPageCount) {
    try {
      // Update states
      setCurrentPage(page);
      setCurrentPageCount(pageCount);
      setProfiles(null);
      // Load profiles
      const profiles = await getProfiles(
        null,
        null,
        pageSize,
        (page - 1) * pageSize,
        tabValue,
      );
      setProfiles(profiles);
      // Add next page to pagination if possible
      if (page == pageCount && profiles.length === pageSize) {
        setCurrentPageCount(pageCount + 1);
      }
      // Define profiles counts
      if (!profilesCount) {
        const lastProfiles = await getProfiles(
          null,
          null,
          1,
          0,
          PROFILE_ORDER.byTokenId,
        );
        setProfilesCount(
          lastProfiles && lastProfiles.length > 0
            ? lastProfiles[0].avatarNftId
            : null,
        );
      }
    } catch (error) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadData(1, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  return (
    <Layout enableSidebar={!!account}>
      <Box sx={{ px: 4, mt: 6, textAlign: 'center' }}>
        <Typography variant="h1" gutterBottom>
          Check or impact reputation of crypto people!
        </Typography>
        <Typography>
          Who was involved in the activities that made you uncomfortable?
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <ProfileSelect
          sx={{ width: { xs: 1, md: 580 } }}
          onChange={(account) => router.push(`/profile/${account}`)}
        />
      </Box>
      <Box sx={{ mt: 8 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab value={PROFILE_ORDER.byPositiveRating} label="Light Side" />
          <Tab value={PROFILE_ORDER.byNegativeRating} label="Dark Side" />
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon3User color={palette.text.primary} width="24" height="24" />
            <Typography variant="h3" sx={{ ml: 1 }}>
              Souls
            </Typography>
          </Box>
          {profilesCount && <Typography>Total: {profilesCount}</Typography>}
        </Box>
        <ProfileList profiles={profiles} sx={{ mt: 0 }} />
        <Pagination
          color="primary"
          sx={{ mt: 4 }}
          count={currentPageCount}
          page={currentPage}
          onChange={(_, page) => loadData(page)}
        />
      </Box>
    </Layout>
  );
}
