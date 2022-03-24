import contractJson from "contracts/Jurisdiction.json";
import WrongNetworkError from "errors/WrongNetworkError";
import { Contract } from 'ethers';
import useProvider from "hooks/useProvider";

/**
 * Hook for Juridiction Contract.
 */
export default function useJuridictionContract() {

  const { provider, defaultProvider } = useProvider();

  function getContract(signerOrProvider) {
    return new Contract(
      process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
      contractJson.abi,
      signerOrProvider
    );
  }

  async function getName() {
    return await getContract(defaultProvider).name();
  }

  async function getOwner() {
    return await getContract(defaultProvider).owner();
  }

  async function isHasRole(account, role) {
    return await getContract(defaultProvider).roleHas(account, role);
  }

  async function join() {
    if ((await provider?.getNetwork())?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).join();
  }

  async function leave() {
    if ((await provider?.getNetwork())?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).leave();
  }

  return { getName, getOwner, isHasRole, join, leave }

}