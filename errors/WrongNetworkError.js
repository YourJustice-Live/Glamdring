export default class WrongNetworkError extends Error {
  constructor() {
    super(`dApp only supports "${process.env.NEXT_PUBLIC_NETWORK_NAME}"`);
    this.name = 'WrongNetworkError';
  }
}
