import { useContext } from 'react';
import { Web3Context } from "contexts/web3";

export default function useNetwork() {

  const web3contextValue = useContext(Web3Context);
  const network = web3contextValue.state.network;

  return [network];
}