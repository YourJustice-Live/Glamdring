import { Button } from '@mui/material';
import WrongNetworkError from 'errors/WrongNetworkError';
import useWeb3Context from 'hooks/useWeb3Context';
import { useSnackbar } from 'notistack';

export default function useToasts() {
  const { enqueueSnackbar } = useSnackbar();
  const { switchNetwork } = useWeb3Context();

  let showToast = function (message) {
    enqueueSnackbar(message);
  };

  let showToastSuccess = function (message) {
    enqueueSnackbar(message, { variant: 'success' });
  };

  let showToastSuccessLink = function (message, link) {
    enqueueSnackbar(message, {
      action: (
        <Button
          onClick={() => window.open(link, '_blank').focus()}
          color="inherit"
        >
          Open
        </Button>
      ),
      variant: 'success',
    });
  };

  let showToastError = function (error) {
    console.error(error);
    if (error instanceof WrongNetworkError) {
      enqueueSnackbar(
        `You are connected to the wrong network. Please switch to ${process.env.NEXT_PUBLIC_NETWORK_NAME}.`,
        {
          action: (
            <Button
              onClick={() => {
                switchNetwork();
              }}
              color="inherit"
            >
              Switch
            </Button>
          ),
        },
      );
    } else {
      enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
    }
  };

  return {
    showToast,
    showToastSuccess,
    showToastSuccessLink,
    showToastError,
  };
}
