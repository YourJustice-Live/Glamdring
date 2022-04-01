## dApp

https://yj.life/

## Commands

- Install depencies - `npm install`
- Start development server - `npm run dev`
- Deploy to Vercel (dev) - `vercel`
- Deploy to Vercel (production) - `vercel --prod`

## Naming Convention

- Branch: '{Notion ID}-{task-name}' example: `1a41b-integrate-new-contracts`
- Commit Message: '[{Notion ID}]-{Task name}' example: `[1a41b] Add new hooks for the jurisdiction contract`

## Environment variables for Polygon Mainnet

```
NEXT_PUBLIC_NETWORK_NAME=Polygon Mainnet
NEXT_PUBLIC_NETWORK_CHAIN_ID=137
NEXT_PUBLIC_NETWORK_CHAIN_ID_HEX=0x89
NEXT_PUBLIC_NETWORK_RPC_URL=https://rpc-mainnet.matic.network/
NEXT_PUBLIC_NETWORK_BLOCK_EXPLORER_URL=https://polygonscan.com/
NEXT_PUBLIC_NETWORK_CURRENCY_NAME=MATIC
NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL=MATIC
NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS=18
```

## FAQ

**Q: Why, after updating the data in the blockchain, they are not immediately displayed in the interface?**

**A:** Most likely The Graph has not updated its data yet.

**Q: Can I see my token in a marketplace?**

**A:** Yes, use this [link](https://testnets.opensea.io/assets/0xab4b21d7651b1484986e1d2790b125be8b6c460b/1) for OpenSea or this [link](https://rinkeby.rarible.com/token/0xab4b21d7651b1484986e1d2790b125be8b6c460b:1) for Rarible. Don't forget to change token ID.
