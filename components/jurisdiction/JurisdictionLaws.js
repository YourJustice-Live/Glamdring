import LawList from 'components/law/LawList';
import useErrors from 'hooks/useErrors';
import useLaw from 'hooks/useLaw';
import { useEffect, useState } from 'react';

/**
 * A component with jurisdiction laws.
 */
export default function JurisdictionLaws({ jurisdiction }) {
  const { handleError } = useErrors();
  const { getLawsByJurisdiction } = useLaw();
  const [laws, setLaws] = useState(null);

  async function loadData() {
    try {
      setLaws(await getLawsByJurisdiction(jurisdiction.id));
    } catch (error) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    if (jurisdiction) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jurisdiction]);

  return (
    <LawList laws={laws} isCollapseEnabled={true} isCommentsEnabled={true} />
  );
}
