import { Web3Context } from "contexts/web3";
import { ethers } from 'ethers';
import { useContext } from 'react';

export default function useProvider() {

  const web3contextValue = useContext(Web3Context);
  const provider = web3contextValue.state.provider;
  const defaultProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_CONNECTION_URL);

  return { provider, defaultProvider };
}