# Your Justice dApp

YourJustice dApp is an on-chain meta-justice system for tracking and verifying reputation.

## Overview

This dApp allows you to track people's reputation history, good and bad deeds, using a web3 on-chain justice system.

You can file cases for or against other individuals, supply evidence and call for witnesses in order to post reputation events to people who supported or mistreaded you.

## Resources

- [dApp](https://yj.life/)
- [Design (Figma)](https://www.figma.com/file/Q27NdlekpXVilnWzflwgdy/Minimal-Existing-Product?node-id=9559%3A38178)

## Stack

- [NextJS](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Ethers](https://ethers.io/)
- [MUI](https://mui.com/)
- [The Graph](https://thegraph.com/)

## Commands

- Install depencies - `npm install`
- Start development server - `npm run dev`

## How to set up a development environment

1. Go to dev branch.
2. Create a file .env.local with content:

```
NEXT_PUBLIC_SUBGRAPH_API=https://api.thegraph.com/subgraphs/name/kiv1n/yourjustice-dev
```

## How to set up a sandbox environment

1. Go to branch that supports the sandbox subgraph.
2. Create a file .env.local with content:

```
NEXT_PUBLIC_SUBGRAPH_API=https://api.thegraph.com/subgraphs/name/kiv1n/yourjustice-sandbox
```

## Naming Convention

- Branch: `{Notion ID}-{task-name}`
  - Example: `1a41b-integrate-new-contracts`
- Commit Message: `[{Notion ID}]-{Commit message}`
  - Example: `[1a41b] Add new hooks for the jurisdiction contract`

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
