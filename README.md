## dApp

https://your-justice-dapp.vercel.app/

## Commands

- Install depencies - `npm install`
- Start development server - `npm run dev`
- Deploy to Vercel (dev) - `vercel`
- Deploy to Vercel (production) - `vercel --prod`

## Template for `.env.local`

```
NEXT_PUBLIC_INFURA_KEY=
NEXT_PUBLIC_INFURA_IPFS_API=
NEXT_PUBLIC_INFURA_CONNECTION_URL=

NEXT_PUBLIC_NETWORK_NAME=
NEXT_PUBLIC_NETWORK_CHAIN_ID=

NEXT_PUBLIC_AVATAR_NFT_CONTRACT_ADDRESS=
NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS=

NEXT_PUBLIC_SUBGRAPH_API=
```

## FAQ

**Q: Why, after updating the data in the blockchain, they are not immediately displayed in the interface?**

**A:** Most likely The Graph has not updated its data yet.

**Q: Can I see my token in a marketplace?**

**A:** Yes, use this [link](https://testnets.opensea.io/assets/0xab4b21d7651b1484986e1d2790b125be8b6c460b/1) for OpenSea or this [link](https://rinkeby.rarible.com/token/0xab4b21d7651b1484986e1d2790b125be8b6c460b:1) for Rarible. Don't forget to change token ID.
