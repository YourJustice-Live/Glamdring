import { handleCatchErrorEvent } from 'utils/analytics';
import useToasts from './useToasts';

/**
 * Hook for work with errors.
 */
export default function useErrors() {
  const { showToastError } = useToasts();

  /**
   * Handle error and show toast if required.
   *
   * @param {Error} error Error object.
   * @param {boolean} isErrorToastRequired If required to show a toast with error message.
   */
  let handleError = function (error, isErrorToastRequired) {
    console.error(error);
    handleCatchErrorEvent(error);
    if (isErrorToastRequired) {
      showToastError(error);
    }
  };

  return {
    handleError,
  };
}
