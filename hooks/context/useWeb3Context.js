import { Web3Context } from 'contexts/web3';
import { useContext } from 'react';

export default function useWeb3Context() {
  const web3Context = useContext(Web3Context);

  const isReady = web3Context.state.isReady;
  const defaultProvider = web3Context.state.defaultProvider;
  const provider = web3Context.state.provider;
  const account = web3Context.state.account;
  const networkChainId = web3Context.state.networkChainId;
  const isNetworkChainIdCorrect = web3Context.state.isNetworkChainIdCorrect;

  const connectWallet = web3Context.connectWallet;
  const disconnectWallet = web3Context.disconnectWallet;
  const switchNetwork = web3Context.switchNetwork;

  return {
    isReady,
    defaultProvider,
    provider,
    account,
    networkChainId,
    isNetworkChainIdCorrect,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
}
