import contractJson from "contracts/Jurisdiction.json";
import { Contract } from 'ethers';
import useProvider from "hooks/useProvider";

/**
 * Hook for Juridiction Contract.
 */
export default function useJuridictionContract() {

  const { provider, defaultProvider } = useProvider();

  const contract = new Contract(
    process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
    contractJson.abi,
    provider?.getSigner() || defaultProvider
  );

  async function getName() {
    return await contract.name();
  }

  async function getOwner() {
    return await contract.owner();
  }

  async function isHasRole(account, role) {
    return await contract.roleHas(account, role);
  }

  async function join() {
    return await contract.join();
  }

  async function leave() {
    return await contract.leave();
  }

  return { getName, getOwner, isHasRole, join, leave }

}