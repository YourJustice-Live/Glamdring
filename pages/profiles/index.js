import { Box, Button, Pagination, Typography } from '@mui/material';
import ProfileOrderSelect from 'components/form/widget/ProfileOrderSelect';
import Layout from 'components/layout/Layout';
import ProfileList from 'components/profile/ProfileList';
import { PROFILE_ORDER } from 'constants/subgraph';
import useDataContext from 'hooks/context/useDataContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useErrors from 'hooks/useErrors';
import useProfile from 'hooks/useProfile';
import { Icon3User, IconAddUser } from 'icons/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';

/**
 * Page with list of all profiles.
 */
export default function Profiles() {
  const { account } = useWeb3Context();
  const { accountProfile } = useDataContext();
  const { handleError } = useErrors();
  const { getProfiles } = useProfile();
  const [profiles, setProfiles] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCount, setCurrentPageCount] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(
    PROFILE_ORDER.byPositiveRating,
  );
  const pageSize = 16;

  async function loadData(page = currentPage, pageCount = currentPageCount) {
    try {
      // Update states
      setCurrentPage(page);
      setCurrentPageCount(pageCount);
      setProfiles(null);
      // Load member profiles for page
      const profiles = await getProfiles({
        first: pageSize,
        skip: (page - 1) * pageSize,
        order: selectedOrder,
      });
      setProfiles(profiles);
      // Add next page to pagination if possible
      if (page == pageCount && profiles.length === pageSize) {
        setCurrentPageCount(pageCount + 1);
      }
    } catch (error) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadData(1, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrder]);

  return (
    <Layout title={'YourJustice / Profiles'} enableSidebar={!!account}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Icon3User color={palette.text.primary} width="24" height="24" />
          <Typography variant="h3" sx={{ ml: 1 }}>
            Profiles
          </Typography>
        </Box>
        {accountProfile && (
          <Link href="/profile/invite" passHref>
            <Button
              variant="outlined"
              size="small"
              startIcon={<IconAddUser />}
              sx={{ px: 2 }}
            >
              Invite
            </Button>
          </Link>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: { md: 'space-between' },
          alignItems: { md: 'center' },
          mt: 3,
        }}
      >
        <ProfileOrderSelect
          size="small"
          sx={{ flexGrow: 1, mt: { xs: 1, md: 0 } }}
          value={selectedOrder}
          onChange={(order) => setSelectedOrder(order)}
        />
        <Pagination
          color="primary"
          sx={{ mt: { xs: 2, md: 0 } }}
          count={currentPageCount}
          page={currentPage}
          onChange={(_, page) => loadData(page)}
        />
      </Box>
      <ProfileList profiles={profiles} sx={{ mt: 2 }} />
    </Layout>
  );
}
