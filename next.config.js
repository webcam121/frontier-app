/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    api: process.env.API_URL || 'http://localhost:3005/api/v0',
    metaMaskRpcURI: 'https://speedy-nodes-nyc.moralis.io/a0dd13b0091772cbf75a91db/eth/mainnet',
  },
}

module.exports = nextConfig
