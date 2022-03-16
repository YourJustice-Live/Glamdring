import { useContext } from 'react';
import { Web3Context } from "contexts/web3";

export default function useProvider() {

  const web3contextValue = useContext(Web3Context);
  const provider = web3contextValue.state.provider;

  return { provider };
}