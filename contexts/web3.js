import { Backdrop, CircularProgress } from '@mui/material';
import WalletConnect from '@walletconnect/web3-provider';
import { IS_DEFAULT_PROVIDER_DISABLED } from 'constants/features';
import { ethers } from 'ethers';
import useProfile from 'hooks/useProfile';
import { createContext, useEffect, useRef, useState } from 'react';
import Web3Modal from 'web3modal';

export const Web3Context = createContext();

export function Web3Provider({ children }) {
  const web3ModalRef = useRef();
  const profileWorkerRef = useRef();
  const { getProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [instance, setInstance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [defaultProvider, setDefaultProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [networkChainId, setNetworkChainId] = useState(null);
  const [isNetworkChainIdCorrect, setIsNetworkChainCorrect] = useState(null);
  const [accountProfile, setAccountProfile] = useState(null);

  async function loadContext() {
    try {
      // Connect account
      const instance = await web3ModalRef.current.connect();
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(instance, 'any');
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();
      const networkChainId = network?.chainId;
      // Add listeners if the user has changed the chain or account
      instance.addListener('chainChanged', (chainId) =>
        setNetworkChainId(chainId),
      );
      instance.addListener('accountsChanged', (accounts) => {
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });
      // Update states
      setInstance(instance);
      setProvider(provider);
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
      setNetworkChainId(networkChainId);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function clearContext() {
    try {
      setIsLoading(true);
      // Remove listeners
      instance.removeAllListeners('chainChanged');
      instance.removeAllListeners('accountsChanged');
      // Clear providers
      web3ModalRef.current.clearCachedProvider();
      localStorage.removeItem('walletconnect');
      // Clear states
      setInstance(null);
      setProvider(null);
      setAccount(null);
      setAccountProfile(null);
      setNetworkChainId(null);
      setIsNetworkChainCorrect(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function connectWallet() {
    loadContext();
  }

  async function disconnectWallet() {
    clearContext();
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

  async function switchNetwork() {
    try {
      await instance.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID_HEX }],
      });
    } catch (error) {
      console.error(error);
      if (error?.code === 4902) {
        addNetwork();
      }
    }
  }

  async function addNetwork() {
    try {
      await instance.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID_HEX,
            rpcUrls: [process.env.NEXT_PUBLIC_NETWORK_RPC_URL],
            chainName: process.env.NEXT_PUBLIC_NETWORK_NAME,
            nativeCurrency: {
              name: process.env.NEXT_PUBLIC_NETWORK_CURRENCY_NAME,
              symbol: process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL,
              decimals: parseInt(
                process.env.NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS,
              ),
            },
            blockExplorerUrls: [
              process.env.NEXT_PUBLIC_NETWORK_BLOCK_EXPLORER_URL,
            ],
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!defaultProvider && !IS_DEFAULT_PROVIDER_DISABLED) {
      const infuraProvider = new ethers.providers.InfuraWebSocketProvider(
        process.env.NEXT_PUBLIC_INFURA_NETWORK,
        process.env.NEXT_PUBLIC_INFURA_KEY,
      );
      setDefaultProvider(infuraProvider);
    }
    if (!web3ModalRef.current) {
      // Config Web3Modal
      const providerOptions = {
        walletconnect: {
          package: WalletConnect,
          options: {
            infuraId: process.env.NEXT_PUBLIC_INFURA_KEY,
          },
        },
      };
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
      });
      web3ModalRef.current = web3Modal;
      // Connect wallet if cached provider exists
      if (web3ModalRef.current.cachedProvider) {
        loadContext();
      } else {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isChainIdCorrect =
      networkChainId?.toString() === process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID;
    const isChainIdHexCorrect =
      networkChainId?.toString() ===
      process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID_HEX;
    setIsNetworkChainCorrect(isChainIdCorrect || isChainIdHexCorrect);
  }, [networkChainId]);

  useEffect(() => {
    if (account) {
      getProfile(account).then((accountProfile) =>
        setAccountProfile(accountProfile),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const value = {
    state: {
      defaultProvider: defaultProvider,
      provider: provider,
      account: account,
      networkChainId: networkChainId,
      isNetworkChainIdCorrect: isNetworkChainIdCorrect,
      accountProfile: accountProfile,
    },
    connectWallet,
    disconnectWallet,
    switchNetwork,
    runProfileUpdater,
  };

  return (
    <Web3Context.Provider value={value}>
      {!isLoading && children}
      {isLoading && <LoadingBackdrop />}
    </Web3Context.Provider>
  );
}

function LoadingBackdrop() {
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: '#FFFFFF',
      }}
      open
    >
      <CircularProgress size={64} />
    </Backdrop>
  );
}
