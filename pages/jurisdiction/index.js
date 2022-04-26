import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Page that redirects the user to the page with main jurisdiction.
 */
export default function Jurisdiction() {
  const router = useRouter();

  useEffect(() => {
    router.push(
      `/jurisdiction/${process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
