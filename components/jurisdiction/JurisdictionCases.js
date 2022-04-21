import { Box, Pagination } from '@mui/material';
import CaseList from 'components/case/CaseList';
import useCase from 'hooks/useCase';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A component with jurisdiction cases.
 */
export default function JurisdictionCases() {
  const { showToastError } = useToasts();
  const { getCases } = useCase();
  const [cases, setCases] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const pageSize = 5;

  async function loadData() {
    try {
      // Load cases for current page
      setCases(null);
      const cases = await getCases(
        process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
        pageSize,
        (currentPage - 1) * pageSize,
      );
      setCases(cases);
      // Add next page to pagination if possible
      if (currentPage == pageCount && cases.length === pageSize) {
        setPageCount(pageCount + 1);
      }
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <Box>
      <Pagination
        color="primary"
        count={pageCount}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
      />
      <CaseList cases={cases} sx={{ mt: 4 }} />
    </Box>
  );
}
