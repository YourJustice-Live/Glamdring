import useAccount from "hooks/useAccount";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Page that redirects the user to the page for their account
 */
export default function Profile() {

  const router = useRouter();
  const { account } = useAccount();

  useEffect(() => {
    if (account) {
      router.push(`/profile/${account}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return <></>;

}