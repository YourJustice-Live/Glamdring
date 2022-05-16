import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Page that redirects the user to the page with all jurisdictions.
 */
export default function Jurisdiction() {
  const router = useRouter();

  useEffect(() => {
    router.push('/jurisdictions');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
