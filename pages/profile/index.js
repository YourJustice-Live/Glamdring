import useWeb3Context from "hooks/useWeb3Context";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Page that redirects the user to the page for their account
 */
export default function Profile() {

  const router = useRouter();
  const { account } = useWeb3Context();

  useEffect(() => {
    if (account) {
      router.push(`/profile/${account}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return <></>;

}