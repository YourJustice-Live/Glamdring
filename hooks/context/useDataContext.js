import { DataContext } from 'contexts/data';
import { useContext } from 'react';

export default function useDataContext() {
  const dataContext = useContext(DataContext);

  const accountProfile = dataContext.state.accountProfile;
  const accountProfileIsJudgeJurisdictions =
    dataContext.state.accountProfileIsJudgeJurisdictions;
  const isAccountProfileHasAwaitingConfirmationCases =
    dataContext.state.isAccountProfileHasAwaitingConfirmationCases;
  const isAccountProfileHasAwaitingJudgingCases =
    dataContext.state.isAccountProfileHasAwaitingJudgingCases;
  const isAccountProfileHasAwaitingCases =
    dataContext.state.isAccountProfileHasAwaitingCases;

  const runProfileUpdater = dataContext.runProfileUpdater;

  return {
    accountProfile,
    accountProfileIsJudgeJurisdictions,
    isAccountProfileHasAwaitingConfirmationCases,
    isAccountProfileHasAwaitingJudgingCases,
    isAccountProfileHasAwaitingCases,
    runProfileUpdater,
  };
}
