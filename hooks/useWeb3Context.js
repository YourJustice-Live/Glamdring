import { Web3Context } from 'contexts/web3';
import { useContext } from 'react';

export default function useWeb3Context() {
  const web3Context = useContext(Web3Context);

  const defaultProvider = web3Context.state.defaultProvider;
  const provider = web3Context.state.provider;
  const account = web3Context.state.account;
  const network = web3Context.state.network;
  const accountProfile = web3Context.state.accountProfile;

  const loadContext = web3Context.connectWallet;
  const connectWallet = web3Context.connectWallet;
  const disconnectWallet = web3Context.disconnectWallet;
  const switchNetwork = web3Context.switchNetwork;
  const runProfileUpdater = web3Context.runProfileUpdater;

  return {
    defaultProvider,
    provider,
    account,
    network,
    accountProfile,
    loadContext,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    runProfileUpdater,
  };
}
