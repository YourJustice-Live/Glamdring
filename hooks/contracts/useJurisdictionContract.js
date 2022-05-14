// eslint-disable-next-line import/extensions
import contractAbi from 'contracts/abi/Jurisdiction.json';
import WrongNetworkError from 'errors/WrongNetworkError';
import { Contract } from 'ethers';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Hook for juridiction contract.
 */
export default function useJuridictionContract() {
  const { defaultProvider, provider, network } = useWeb3Context();

  function getContract(address, signerOrProvider) {
    return new Contract(address, contractAbi, signerOrProvider);
  }

  /**
   * Get jurisdiction contract uri with metadata.
   *
   * @param {string} contractAddress Jurisdiction contract address.
   * @returns Transaction,
   */
  async function getUri(contractAddress) {
    return await getContract(
      contractAddress,
      provider?.getSigner() || defaultProvider,
    ).contractURI();
  }

  async function join(contractAddress) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).join();
  }

  async function leave(contractAddress) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).leave();
  }

  async function assignRole(contractAddress, account, role) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).roleAssign(
      account,
      role,
    );
  }

  async function removeRole(contractAddress, account, role) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).roleRemove(
      account,
      role,
    );
  }

  async function addRule(contractAddress, rule, confirmation, effects) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).ruleAdd(
      rule,
      confirmation,
      effects,
    );
  }

  async function updateRule(contractAddress, id, rule, effects) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).ruleUpdate(
      id,
      rule,
      effects,
    );
  }

  /**
   * Make a case in the jurisdiction.
   *
   * @param {string} contractAddress Jurisdiction contract address.
   * @param {string} name Case name.
   * @param {Array.<{jurisdiction : string, ruleId: number}>} rules Case rules.
   * @param {Array.<{account : string, role: string}>} roles Case roles.
   * @param {Array.<{entRole : string, uri: string}>} posts Case posts.
   * @returns Transaction.
   */
  async function makeCase(contractAddress, name, rules, roles, posts) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(
      contractAddress,
      provider?.getSigner(),
    ).caseMakeOpen(name, rules, roles, posts);
  }

  return {
    getUri,
    join,
    leave,
    assignRole,
    removeRole,
    addRule,
    updateRule,
    makeCase,
  };
}
