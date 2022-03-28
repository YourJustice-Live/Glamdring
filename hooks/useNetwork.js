import { Web3Context } from "contexts/web3";
import { useContext } from 'react';

export default function useNetwork() {

  const web3contextValue = useContext(Web3Context);
  const network = web3contextValue.state.network;
  const switchNetwork = web3contextValue.switchNetwork;

  return { network, switchNetwork };
}