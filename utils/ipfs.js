// IPFS Gateway Servers
const gateway = {
  cloudflare: 'https://cloudflare-ipfs.com/ipfs/',
  dweb: 'https://dweb.link/ipfs/',
  ipfs: 'https://gateway.ipfs.io/ipfs/',
  // infura: 'https://[PROJECT].infura-ipfs.io/ipfs/',
};

// Resolve IPFS Link
export const resolveLink = (url) => {
  // [FIX] Remove Hardcoded Infura gateway
  if (url) url = url.replace('https://ipfs.infura.io/ipfs/', 'ipfs://');
  return !url || !url.includes('ipfs://')
    ? url
    : url.replace('ipfs://', gateway.cloudflare);
};
