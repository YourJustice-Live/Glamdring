import WalletConnect from "@walletconnect/web3-provider";
import LoadingBackdrop from "components/extra/LoadingBackdrop";
import { ethers } from "ethers";
import { createContext, useEffect, useRef, useState } from 'react';
import Web3Modal from "web3modal";

export const Web3Context = createContext();

export function Web3Provider({ children }) {

  const web3ModalRef = useRef();

  const [isLoading, setIsLoading] = useState(true);
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
      // Update states
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
      // Clear providers
      await web3ModalRef.current.clearCachedProvider();
      localStorage.removeItem("walletconnect");
      // Clear states
      setProvider(null);
      setAccount(null);
      setNetwork(null);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!web3ModalRef.current) {
      // Confing Web3Modal
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
  }, [])

  const value = {
    state: {
      provider: provider,
      account: account,
      network: network,
    },
    connectWallet,
    disconnectWallet,
  }

  return (
    <Web3Context.Provider value={value}>
      {!isLoading && children}
      {isLoading && <LoadingBackdrop />}
    </Web3Context.Provider>
  )

}