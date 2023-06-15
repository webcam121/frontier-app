export enum ExtensionType {
  MetaMask,
  Polkadot,
}

export const netInfo = {
  mainnet: {
    chainId: 1,
      network: 'mainnet',
      rpcURI: 'https://speedy-nodes-nyc.moralis.io/a0dd13b0091772cbf75a91db/eth/mainnet'
  },
  rinkeby: {
    chainId: 4,
      network: 'rinkeby',
      rpcURI: 'https://speedy-nodes-nyc.moralis.io/a0dd13b0091772cbf75a91db/eth/rinkeby'
  },
};
