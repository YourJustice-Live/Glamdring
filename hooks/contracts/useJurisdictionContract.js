// eslint-disable-next-line import/extensions
import contractAbi from 'contracts/abi/Jurisdiction.json';
import WrongNetworkError from 'errors/WrongNetworkError';
import { Contract } from 'ethers';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Hook for Juridiction Contract.
 */
export default function useJuridictionContract() {
  const { defaultProvider, provider, network } = useWeb3Context();

  function getContract(signerOrProvider) {
    return new Contract(
      process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
      contractAbi,
      signerOrProvider,
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
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).join();
  }

  async function leave() {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).leave();
  }

  async function assignRole(account, role) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).roleAssign(account, role);
  }

  async function removeRole(account, role) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).roleRemove(account, role);
  }

  async function addRule(rule, confirmation) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).ruleAdd(rule, confirmation);
  }

  async function updateRule(id, rule) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).ruleUpdate(id, rule);
  }

  /**
   * Make a case in the jurisdiction.
   *
   * @param {string} name Case name.
   * @param {Array.<{jurisdiction : string, ruleId: number}>} rules Case rules.
   * @param {Array.<{account : string, role: string}>} roles Case roles.
   * @returns Transaction.
   */
  async function makeCase(name, rules, roles) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).caseMake(
      name,
      rules,
      roles,
    );
  }

  return {
    getName,
    getOwner,
    isHasRole,
    join,
    leave,
    assignRole,
    removeRole,
    addRule,
    updateRule,
    makeCase,
  };
}
