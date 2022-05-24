import LoadingBackdrop from 'components/backdrop/LoadingBackdrop';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useProfile from 'hooks/useProfile';
import useCase from 'hooks/useCase';
import { createContext, useEffect, useRef, useState } from 'react';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const { isReady: isWebContextReady, account } = useWeb3Context();
  const { getProfile } = useProfile();
  const {
    isAccountHasAwaitingConfirmationCases,
    isAccountHasAwaitingJudgingCases,
  } = useCase();
  const profileWorkerRef = useRef();
  const [isReady, setIsReady] = useState(false);
  const [accountProfile, setAccountProfile] = useState(null);
  const [
    isAccountProfileHasAwaitingConfirmationCases,
    setIsAccountProfileHasAwaitingConfirmationCases,
  ] = useState(false);
  const [
    isAccountProfileHasAwaitingJudgingCases,
    setIsAccountProfileHasAwaitingJudgingCases,
  ] = useState(false);
  const [
    isAccountProfileHasAwaitingCases,
    setIsAccountProfileHasAwaitingCases,
  ] = useState(false);

  async function updateContext() {
    // If account not connected
    if (!account) {
      setAccountProfile(null);
      setIsAccountProfileHasAwaitingConfirmationCases(false);
      setIsAccountProfileHasAwaitingJudgingCases(false);
      setIsAccountProfileHasAwaitingCases(false);
    }
    // Load data if account connected
    else {
      try {
        // Define data
        const accountProfile = await getProfile(account);
        const isAccountProfileHasAwaitingConfirmationCases =
          await isAccountHasAwaitingConfirmationCases(account);
        const isAccountProfileHasAwaitingJudgingCases =
          await isAccountHasAwaitingJudgingCases(account);
        const isAccountProfileHasAwaitingCases =
          isAccountProfileHasAwaitingConfirmationCases ||
          isAccountProfileHasAwaitingJudgingCases;
        // Update states
        setAccountProfile(accountProfile);
        setIsAccountProfileHasAwaitingConfirmationCases(
          isAccountProfileHasAwaitingConfirmationCases,
        );
        setIsAccountProfileHasAwaitingJudgingCases(
          isAccountProfileHasAwaitingJudgingCases,
        );
        setIsAccountProfileHasAwaitingCases(isAccountProfileHasAwaitingCases);
      } catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * Run web worker to check if the account profile in the blockchain has been changed.
   */
  async function runProfileUpdater() {
    profileWorkerRef.current = new Worker(
      new URL('../workers/profileUpdater.js', import.meta.url),
    );
    profileWorkerRef.current.onmessage = (event) => {
      setAccountProfile(event.data);
      profileWorkerRef.current.terminate();
    };
    profileWorkerRef.current.postMessage({
      account: account,
      accountProfile: accountProfile,
    });
  }

  /**
   * Update context if web3 context is ready.
   */
  useEffect(() => {
    setIsReady(false);
    if (isWebContextReady) {
      updateContext().then(() => setIsReady(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWebContextReady]);

  /**
   * Update context if context is ready and account is changed.
   */
  useEffect(() => {
    if (isReady) {
      updateContext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const value = {
    state: {
      accountProfile: accountProfile,
      isAccountProfileHasAwaitingConfirmationCases:
        isAccountProfileHasAwaitingConfirmationCases,
      isAccountProfileHasAwaitingJudgingCases:
        isAccountProfileHasAwaitingJudgingCases,
      isAccountProfileHasAwaitingCases: isAccountProfileHasAwaitingCases,
    },
    runProfileUpdater,
  };

  return (
    <DataContext.Provider value={value}>
      {isReady ? <>{children}</> : <LoadingBackdrop />}
    </DataContext.Provider>
  );
}
