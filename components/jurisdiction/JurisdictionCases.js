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

  async function loadCases() {
    try {
      const cases = await getCases(
        process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
      );
      cases.sort((case1, case2) =>
        case2.createdDate.localeCompare(case1.createdDate),
      );
      setCases(cases);
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <CaseList cases={cases} />;
}
