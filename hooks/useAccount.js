import { useContext } from 'react';
import { Web3Context } from "contexts/web3";

export default function useAccount() {

  const web3contextValue = useContext(Web3Context);
  const account = web3contextValue.state.account;
  const connectWallet = web3contextValue.connectWallet;
  const disconnectWallet = web3contextValue.disconnectWallet;

  return { account, connectWallet, disconnectWallet };
}