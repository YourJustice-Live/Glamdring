import { Box, Pagination } from '@mui/material';
import ProfileOrderSelect from 'components/form/widget/ProfileOrderSelect';
import ProfileList from 'components/profile/ProfileList';
import { JURISDICTION_ROLE } from 'constants/contracts';
import { PROFILE_ORDER } from 'constants/subgraph';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import useProfile from 'hooks/useProfile';
import { useEffect, useState } from 'react';

/**
 * A component with jurisdiction members.
 */
export default function JurisdictionMembers({ jurisdiction }) {
  const { handleError } = useErrors();
  const { getJurisdictionRoleParticipants } = useJurisdiction();
  const { getProfiles } = useProfile();
  const [memberProfiles, setMemberProfiles] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCount, setCurrentPageCount] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(
    PROFILE_ORDER.byPositiveRating,
  );
  const pageSize = 10;

  async function loadData(page = currentPage, pageCount = currentPageCount) {
    try {
      // Update states
      setCurrentPage(page);
      setCurrentPageCount(pageCount);
      setMemberProfiles(null);
      // Load member profiles for page
      const members = getJurisdictionRoleParticipants(
        jurisdiction,
        JURISDICTION_ROLE.member.id,
      );
      const memberProfiles = await getProfiles({
        ids: members,
        first: pageSize,
        skip: (page - 1) * pageSize,
        order: selectedOrder,
      });
      setMemberProfiles(memberProfiles);
      // Add next page to pagination if possible
      if (page == pageCount && memberProfiles.length === pageSize) {
        setCurrentPageCount(pageCount + 1);
      }
    } catch (error) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    if (jurisdiction) {
      loadData(1, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jurisdiction, selectedOrder]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: { md: 'space-between' },
          alignItems: { md: 'center' },
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
      <ProfileList
        profiles={memberProfiles}
        jurisdiction={jurisdiction}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
