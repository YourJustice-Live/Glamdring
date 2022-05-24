import WalletConnect from '@walletconnect/web3-provider';
import { IS_DEFAULT_PROVIDER_DISABLED } from 'constants/features';
import { ethers } from 'ethers';
import { createContext, useEffect, useRef, useState } from 'react';
import Web3Modal from 'web3modal';

export const Web3Context = createContext();

export function Web3Provider({ children }) {
  const web3ModalRef = useRef();
  const [isReady, setIsReady] = useState(false);
  const [instance, setInstance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [defaultProvider, setDefaultProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [networkChainId, setNetworkChainId] = useState(null);
  const [isNetworkChainIdCorrect, setIsNetworkChainCorrect] = useState(null);

  async function initContext() {
    try {
      // Show web3 modal or autoconnects
      const instance = await web3ModalRef.current.connect();
      // Define data
      setIsReady(false);
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
      setIsReady(true);
    }
  }

  async function clearContext() {
    try {
      setIsReady(false);
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
      setNetworkChainId(null);
      setIsNetworkChainCorrect(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsReady(true);
    }
  }

  async function connectWallet() {
    initContext();
  }

  async function disconnectWallet() {
    clearContext();
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
    // Init default provider
    if (!defaultProvider && !IS_DEFAULT_PROVIDER_DISABLED) {
      const infuraProvider = new ethers.providers.InfuraWebSocketProvider(
        process.env.NEXT_PUBLIC_INFURA_NETWORK,
        process.env.NEXT_PUBLIC_INFURA_KEY,
      );
      setDefaultProvider(infuraProvider);
    }
    // Config web3 modal and try autoconnect
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
        initContext();
      } else {
        setIsReady(true);
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

  const value = {
    state: {
      isReady: isReady,
      defaultProvider: defaultProvider,
      provider: provider,
      account: account,
      networkChainId: networkChainId,
      isNetworkChainIdCorrect: isNetworkChainIdCorrect,
    },
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}
