import { Box, Button, Pagination, Typography } from '@mui/material';
import JurisdictionList from 'components/jurisdiction/JurisdictionList';
import JurisdictionManageDialog from 'components/jurisdiction/JurisdictionManageDialog';
import Layout from 'components/layout/Layout';
import useDialogContext from 'hooks/useDialogContext';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { IconPassport } from 'icons';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';

/**
 * Page with list of all jurisdictions.
 */
export default function Jurisdictions() {
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const { showToastError } = useToasts();
  const { getJurisdictions } = useJurisdiction();
  const [jurisdictions, setJurisdictions] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCount, setCurrentPageCount] = useState(1);
  const pageSize = 12;

  async function loadData(page = currentPage, pageCount = currentPageCount) {
    try {
      // Update states
      setCurrentPage(page);
      setCurrentPageCount(pageCount);
      setJurisdictions(null);
      // Load jurisdictions
      const jurisdictions = await getJurisdictions(
        null,
        pageSize,
        (page - 1) * pageSize,
      );
      setJurisdictions(jurisdictions);
      // Add next page to pagination if possible
      if (page == pageCount && jurisdictions.length === pageSize) {
        setCurrentPageCount(pageCount + 1);
      }
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData(1, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title={'YourJustice / Jurisdictions'} enableSidebar={!!account}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconPassport size={24} hexColor={palette.text.primary} />
          <Typography variant="h3" sx={{ ml: 1 }}>
            Jurisdictions
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            showDialog(<JurisdictionManageDialog onClose={closeDialog} />)
          }
        >
          Create
        </Button>
      </Box>
      <JurisdictionList jurisdictions={jurisdictions} sx={{ mt: 0 }} />
      <Pagination
        color="primary"
        sx={{ mt: 4 }}
        count={currentPageCount}
        page={currentPage}
        onChange={(_, page) => loadData(page)}
      />
    </Layout>
  );
}
