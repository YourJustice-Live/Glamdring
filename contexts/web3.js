import WalletConnect from "@walletconnect/web3-provider";
import LoadingBackdrop from "components/extra/LoadingBackdrop";
import { ethers } from "ethers";
import { createContext, useEffect, useRef, useState } from 'react';
import Web3Modal from "web3modal";

export const Web3Context = createContext();

export function Web3Provider({ children }) {

  const web3ModalRef = useRef();

  const [isLoading, setIsLoading] = useState(true);
  const [instance, setInstance] = useState();
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [network, setNetwork] = useState();

  async function connectWallet() {
    try {
      // Connect account
      const instance = await web3ModalRef.current.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();
      // Add listeners to reconnect the wallet if the user has changed the chain or account
      if (instance.listenerCount("chainChanged") === 0) {
        instance.addListener("chainChanged", () => connectWallet());
      }
      if (instance.listenerCount("accountsChanged") === 0) {
        instance.addListener("accountsChanged", () => connectWallet());
      }
      // Update states
      setInstance(instance);
      setProvider(provider);
      if (accounts) {
        setAccount(accounts[0])
      };
      setNetwork(network);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function disconnectWallet() {
    try {
      // Remove listeners
      instance.removeAllListeners("chainChanged");
      instance.removeAllListeners("accountsChanged");
      // Clear providers
      web3ModalRef.current.clearCachedProvider();
      localStorage.removeItem("walletconnect");
      // Clear states
      setInstance(null);
      setProvider(null);
      setAccount(null);
      setNetwork(null);
    } catch (error) {
      console.error(error);
    }
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
        method: "wallet_addEthereumChain",
        params: [{
          chainId: process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID_HEX,
          rpcUrls: [process.env.NEXT_PUBLIC_NETWORK_RPC_URL],
          chainName: process.env.NEXT_PUBLIC_NETWORK_NAME,
          nativeCurrency: {
            name: process.env.NEXT_PUBLIC_NETWORK_CURRENCY_NAME,
            symbol: process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL,
            decimals: parseInt(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS),
          },
          blockExplorerUrls: [process.env.NEXT_PUBLIC_NETWORK_BLOCK_EXPLORER_URL]
        }]
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!web3ModalRef.current) {
      // Config Web3Modal
      const providerOptions = {
        walletconnect: {
          package: WalletConnect,
          options: {
            infuraId: process.env.NEXT_PUBLIC_INFURA_KEY
          }
        }
      };
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
      });
      web3ModalRef.current = web3Modal;
      // Connect wallet if cached provider exists
      if (web3ModalRef.current.cachedProvider) {
        connectWallet();
      } else {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = {
    state: {
      provider: provider,
      account: account,
      network: network,
    },
    connectWallet,
    disconnectWallet,
    switchNetwork,
  }

  return (
    <Web3Context.Provider value={value}>
      {!isLoading && children}
      {isLoading && <LoadingBackdrop />}
    </Web3Context.Provider>
  )

}