import { Button } from '@mui/material';
import WrongNetworkError from 'errors/WrongNetworkError';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { truncate } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useSnackbar } from 'notistack';

export default function useToasts() {
  const { t } = useTranslation('common');
  const { enqueueSnackbar } = useSnackbar();
  const { switchNetwork } = useWeb3Context();
  const autoHideDuration = 10000;

  let showToast = function (message) {
    enqueueSnackbar(message, { autoHideDuration: autoHideDuration });
  };

  let showToastSuccess = function (message) {
    enqueueSnackbar(message, {
      variant: 'success',
      autoHideDuration: autoHideDuration,
    });
  };

  let showToastSuccessLink = function (message, link) {
    enqueueSnackbar(message, {
      action: (
        <Button
          onClick={() => window.open(link, '_blank').focus()}
          color="inherit"
        >
          {t('button-open')}
        </Button>
      ),
      variant: 'success',
      autoHideDuration: autoHideDuration,
    });
  };

  let showToastError = function (error) {
    if (error instanceof WrongNetworkError) {
      const message =
        t('text-error-wrong-network') +
        ' ' +
        process.env.NEXT_PUBLIC_NETWORK_NAME +
        '.';
      const action = (
        <Button
          onClick={() => {
            switchNetwork();
          }}
          color="inherit"
        >
          Switch
        </Button>
      );
      enqueueSnackbar(message, {
        action: action,
        autoHideDuration: autoHideDuration,
      });
    } else {
      const message = truncate(`${t('text-error')}: ${error.message}`, {
        length: 256,
      });
      enqueueSnackbar(message, {
        variant: 'error',
        autoHideDuration: autoHideDuration,
      });
    }
  };

  return {
    showToast,
    showToastSuccess,
    showToastSuccessLink,
    showToastError,
  };
}
