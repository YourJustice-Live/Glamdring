import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Page that redirects the user to the page with all profiles
 */
export default function Profile() {
  const router = useRouter();

  useEffect(() => {
    router.push('/profiles');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
