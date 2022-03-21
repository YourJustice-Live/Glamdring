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

NEXT_PUBLIC_AVATAR_NFT_CONTRACT_ADDRESS=

NEXT_PUBLIC_SUBGRAPH_API=
```

## FAQ

**Q: Why, after updating the data in the blockchain, they are not immediately displayed in the interface?**

**A:** Most likely The Graph has not updated its data yet.
