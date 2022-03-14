import WalletConnect from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { createContext, useEffect, useRef, useState } from 'react';
import Web3Modal from "web3modal";

export const Web3Context = createContext();

export function Web3Provider({ children }) {

  const web3ModalRef = useRef();

  const [instance, setInstance] = useState();
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [network, setNetwork] = useState();

  async function connectWallet() {
    try {

      console.log("connectWallet");

      const instance = await web3ModalRef.current.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();

      setInstance(instance);
      setProvider(provider);
      if (accounts) {
        setAccount(accounts[0])
      };
      setNetwork(network);

    } catch (error) {
      console.error(error);
    }
  }

  async function disconnectWallet() {
    try {

      console.log("disconnectWallet");

      await web3ModalRef.current.clearCachedProvider();

      setAccount(null);
      setNetwork(null);

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {

    if (!web3ModalRef.current) {

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

      if (web3ModalRef.current.cachedProvider) {
        connectWallet();
      }
    }

  }, [])

  const value = {
    state: {
      account: account,
      network: network,
    },
    connectWallet,
    disconnectWallet,
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )

}