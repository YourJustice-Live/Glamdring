import LoadingBackdrop from 'components/backdrop/LoadingBackdrop';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useCase from 'hooks/useCase';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import useProfile from 'hooks/useProfile';
import { createContext, useEffect, useRef, useState } from 'react';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const { isReady: isWebContextReady, account } = useWeb3Context();
  const { handleError } = useErrors();
  const { getProfile } = useProfile();
  const { getJurisdictions } = useJurisdiction();
  const {
    isProfileHasAwaitingConfirmationCases,
    isProfileHasAwaitingJudgingCases,
  } = useCase();
  const profileWorkerRef = useRef();
  const [isReady, setIsReady] = useState(false);
  const [accountProfile, setAccountProfile] = useState(null);
  const [
    isAccountProfileHasAwaitingConfirmationCases,
    setIsAccountProfileHasAwaitingConfirmationCases,
  ] = useState(false);
  const [
    accountProfileIsJudgeJurisdictions,
    setAccountProfileIsJudgeJurisdictions,
  ] = useState(null);
  const [
    isAccountProfileHasAwaitingJudgingCases,
    setIsAccountProfileHasAwaitingJudgingCases,
  ] = useState(false);
  const [
    isAccountProfileHasAwaitingCases,
    setIsAccountProfileHasAwaitingCases,
  ] = useState(false);
  const jurisdictionsLoadingLimit = 25; // TODO: Find out how to optimally download jurisdictions without limits

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
        const accountProfile = await getProfile({ owner: account });
        const accountProfileIsJudgeJurisdictions = await getJurisdictions({
          judge: accountProfile.id,
          first: jurisdictionsLoadingLimit,
        });
        const isAccountProfileHasAwaitingConfirmationCases =
          await isProfileHasAwaitingConfirmationCases(accountProfile?.id);
        const isAccountProfileHasAwaitingJudgingCases =
          await isProfileHasAwaitingJudgingCases(
            accountProfileIsJudgeJurisdictions.map(
              (jurisdiction) => jurisdiction.id,
            ),
          );
        const isAccountProfileHasAwaitingCases =
          isAccountProfileHasAwaitingConfirmationCases ||
          isAccountProfileHasAwaitingJudgingCases;
        // Update states
        setAccountProfile(accountProfile);
        setAccountProfileIsJudgeJurisdictions(
          accountProfileIsJudgeJurisdictions,
        );
        setIsAccountProfileHasAwaitingConfirmationCases(
          isAccountProfileHasAwaitingConfirmationCases,
        );
        setIsAccountProfileHasAwaitingJudgingCases(
          isAccountProfileHasAwaitingJudgingCases,
        );
        setIsAccountProfileHasAwaitingCases(isAccountProfileHasAwaitingCases);
      } catch (error) {
        handleError(error);
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
      accountProfileIsJudgeJurisdictions: accountProfileIsJudgeJurisdictions,
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
