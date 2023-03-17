<p align="center" width="100%">
    <img width="80%" src="https://github.com/Zerobeings/zerb-nft-marketplace/blob/d8efbd0ef60c217cea009f85d1dc30407ad8dc98/public/images/Zerb_README.png">
</p>

# 🚧 Market gm ☕️ is currently in testing phase 🚧
# 🚧 Plese take appropraite actions to upgrade to production level 🚧
# 🚧 Mainnet contract interactions have not been tested 🚧

# Market gm ☕️ - An NFT marketplace 

## Introduction
Market gm ☕️ is a new NFT marketplace that allows you to buy, directly sell, and auction NFTs inside and outside the marketplace. This flexibility is achieved through the thirdWeb marketplace contract ([contract audit report](https://gateway.ipfscdn.io/ipfs/QmNgNaLwzgMxcx9r6qDvJmTFam6xxUxX7Vp8E99oRt7i74/)). 

> 0.5% platform fee & [EIP-2981](https://eips.ethereum.org/EIPS/eip-2981) royalties honored, filetype flexibility, auto-generated IPFS site, and fully customizable.

To take a deeper dive into market gm ☕️ , check out the [documents](https://learn.zerobeings.xyz)

## News & Community

>
> * Twitter: [https://twitter.com/Zero_beings](https://twitter.com/Zero_beings)
> * Discord: [https://discord.gg/rZMzVCx96W](https://discord.gg/rZMzVCx96W)
> * Medium: [https://zerobeings.medium.com/](https://zerobeings.medium.com/)
>

## Quickstart
Follow the guide below to get started on your own NFT marketplace today! Otherwise you can [mint](mint.zerobeings.xyz) a Zero Being and start using [Market gm ☕️](gm.zerobeings.xyz) today!

### Prerequisites
* [NodeJs](https://nodejs.org/en/download/)
* Alchemy API Key & RPC
* Wallet Connect Project ID
* Infura API Key

### Installation
> 🚨 Wallet Connect recommends only running the modal on https. Tools like [localtunnel](https://theboroer.github.io/localtunnel-www/) can be used to accomplish this.
>
> Recently Wallet Connect began the process of sunsetting the Web3Modal V1.0. However, you can still use this modal by upgrading the WalletConnect ethereum-provider to v2.0. This was done for Market gm.

```
For Web3Modal v1.0 integrations
We recommend that you replace your existing integration with the latest version of Web3Modal, for which you can find more docs here.

If you still want to use Web3Modal v1.0 but just upgrade the WalletConnect ethereum-provider to v2.0 then you can update to the latest version available on NPM which you can find here.
```

1. Fork the project.
2. Clone the project.
3. Navigate to the project directory `cd zerb-nft-marketplace`.
4. Install dependencies with `npm install`.
5. Change `.env.example` to `.env` and add your environment variables.
6. Change mbox.example.json and gbox.example.json to mbox.json and gbox.json
7. Remove mbox.json and gbox.json from .gitignore for private repositories
8. Run `node server` (🚨 not recommended by Wallet Connect) or set up a [localtunnel](https://theboroer.github.io/localtunnel-www/) (recommended).

### Making it your Own
1. Change the NFT gating contract and user name.
2. Deploy your own thirdweb goerli marketplace [contract](https://thirdweb.com/dashboard/contracts). 
3. Deploy your own thirdweb mainnet marketplace [contract](https://thirdweb.com/dashboard/contracts).
4. Update the marketplace contract address.
5. Update the mbox.json and gbox.json files.
6. Update `session.zerb.account` to new user reference throughout repository.
7. Update the walletconnect parameter on the login page:

```javascript
const party = new Privateparty({
    walletconnect: "<infura api key>" //for mobile
    })
```

8. Customize!

#### Change the NFT Gate

> A complete guide can be found at Skograd's [PrivateParty](https://privateparty.dev)

You will first need to update the private party authorization. Below is the current server authorization with a user `'zerb'`, contract name `zerb`, a contract address `'0x8FbA3ebe77D3371406a77EEaf40c89C1Ed55364a'`, and a balance call function

```javascript
let balance = await contracts.zerb.methods.balanceOf(account).call()
```

```javascript
party.add('zerb', {
  contracts: {
    zerb: {
      address: '0x8FbA3ebe77D3371406a77EEaf40c89C1Ed55364a', //for zero beings 
      rpc: process.env.RPC,
      abi: party.abi.erc721,
    },
  },
  authorize: async (req, account, contracts) => {
    let balance = await contracts.zerb.methods.balanceOf(account).call();
    if (balance > 0) return { balance: balance };
    else
      throw new Error(
        "You must own at least one 'Zero Being' mint at https://mint.zerobeings.xyz"
      );
  },
});
```

For example, let say you would like to change the user and the NFT gate, the changes would look something like this:

```javascript
party.add('user', {
  contracts: {
    mycontract: {
      address: '0x0........', //your collection address
      rpc: process.env.RPC,
      abi: party.abi.erc721,
    },
  },
  authorize: async (req, account, contracts) => {
    let balance = await contracts.mycontract.methods.balanceOf(account).call();
    if (balance > 0) return { balance: balance };
    else
      throw new Error(
        "You must own at least one 'Your NFT' mint at https://yourdomain.com"
      );
  },
});
```

#### Using Your Own Marketplace Contracts
There are total seven locations in which the goerli & mainnet contract addresses are explicitly used.

1. server.js
2. mbox.json
3. gbox.json
4. listingsCard.ejs (IPFS Link)
5. goerli-listingsCard.ejs (IPFS Link)

#### Update server.js

```javascript
// Marketplace contracts
// contracts are referenced in three locations in mbox.json for mainnet and gbox.json for goerli,
// the listingsCard and mybids for mainnet and goerli-listingsCard & goerli-mybids in the IPFS site link,
// in the const listed below, and finally the marketfooter files.
const gMarkectContract = '<your goerli contract address>'; //goerli marketplace contract. Deploy from thirdweb dashboard.
const mainnetMarketContract = '<your mainnet contract address>'; //ETH mainnet marketplace contract. Deploy from thirdweb dashboard
```

#### Updating mbox.json and gbox.json files
You will need to add your contract address and [projectId](https://cloud.walletconnect.com/sign-up) to the mbox.json and gbox.json files to establish a wallet connection.

The mbox.json file supports the connection to the mainnet.
```json
{"contract":"<MarketContract>","network":"main","projectId":"<projectID from WalletConnect Cloud>"}
```

The gbox.json file supports the connection to the goerli-network.

```json
{"contract":"<MarketContract>","network":"goerli","projectId":"<projectID from WalletConnect Cloud>"}
```

#### Update the listingCard partials
The listingCard partials contain a copy iframe button. Navigate to your thirdbed dashboard and copy the iframe code and paste it into this section. The default configuration is with written with a listing ID of `0`. This must be updated to `<%=listings.id%>` to autolink the correct IPFS website.

Below is the example for the Market gm configuration.

```html
<iframe src="https://gateway.ipfscdn.io/ipfs/QmbAgC8YwY36n8H2kuvSWsRisxDZ15QZw3xGZyk9aDvcv7/marketplace.html?contract=0x8F6502Aeae32D3B708236F8cB1eB2aa45429cE34&chain=%7B%22name%22%3A%22Ethereum+Mainnet%22%2C%22chain%22%3A%22ETH%22%2C%22rpc%22%3A%5B%22https%3A%2F%2Fethereum.rpc.thirdweb.com%2F5a9bc94b87f7cbbbfbbc234bf1e07f0adf5f3cf3012c9f26f9fc9820d64df93a%22%5D%2C%22nativeCurrency%22%3A%7B%22name%22%3A%22Ether%22%2C%22symbol%22%3A%22ETH%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22eth%22%2C%22chainId%22%3A1%2C%22testnet%22%3Afalse%2C%22slug%22%3A%22ethereum%22%7D&listingId=<%=listings.id%>&theme=dark&primaryColor=blue&secondaryColor=blue"
width="600px"
height="600px"
style="max-width:100%;"
frameborder="0"></iframe>
```

# More Info
If you would like to take a deep dive into the tools used to build this marketplace, review the reference documents. The additional resources section is a list of tools to help you launch and manage your NFT collections. Enjoy!

If this repository has been helpful, please consider buying me coffee 😀.
ETH Address: 0xf65baD529b42f1014A901665353B7538432e4663

## FAQs
* Can any collection be listed on the marketplace?
    Yes, the marketplace contract is setup to allow sale of any NFT collection.

* Can any wallet address list an NFT on the marketplace?
    Yes, any wallet can create a listing on the NFT marketplace

* What is the platform fee for a sale on the marketplace?
    We charge a platform fee of 0.5% for each sale.

## Reference Documents
* Skogard Productions [PrivateParty](https://privateparty.dev)
* Skogard Productions [factoria](https://docs.factoria.app/#/)
* Alchemy NFT [API](https://docs.alchemy.com/reference/nft-api-quickstart) 
* Thirdweb marketplace contract technical [documents](https://portal.thirdweb.com/contracts/design/Marketplace#currency-transfers)
* Thirdweb typescript documentation [typescript](https://portal.thirdweb.com/typescript/sdk.marketplace)
* Rarible [API](https://multichain-api.rarible.org/v0.1/tag/item-controller#operation/getItemRoyaltiesById)

## Additional Resources
* Skogard Productions [Cell](https://cell.computer/#/?id=introduction)
* Skogard Productions [Moneypipe](https://moneypipe.xyz/)

## Data Structures
Below is a summary of the data structures fetched to build market gm.

### Alchemy 
nfts Data Structure

```

nfts:{
  contract: { address: '0x8fba3ebe77d3371406a77eeaf40c89c1ed55364a' },
  id: {
    tokenId: '0x00000000000000000000000000000000000000000000000000000000000000e2',
    tokenMetadata: [Object]
  },
  balance: '1',
  title: 'Zero Beings #226',
  description: '2022 Zero Beings',
  tokenUri: {
    raw: 'ipfs://bafybeidc4mw5k3iyzfz6msc37emanpdocar2dbfwkqmz5xrh7ctcs2htyi/226.json',
    gateway: 'https://ipfs.io/ipfs/bafybeidc4mw5k3iyzfz6msc37emanpdocar2dbfwkqmz5xrh7ctcs2htyi/226.json'
  },
  media: [{
    bytes: 220522,
    format: "png",
    gateway: "https://res.cloudinary.com/alchemyapi/image/upload/mainnet/3e61df4989b790d9957e7095cb643cc1.png",
    raw: "ipfs://bafybeihvhk34lgwoh42qjkvz6obyeyls3236s5gojjukw3sq6ommg2eaye/00103.png",
    thumbnail: "https://res.cloudinary.com/alchemyapi/image/upload/w_256,h_256/mainnet/3e61df4989b790d9957e7095cb643cc1.png",
  }],
  metadata: {
    name: 'Zero Beings #226',
    description: '2022 Zero Beings',
    image: 'ipfs://bafybeidb57yyynti3qad3zcp2h4i4xj7ycabbvn4wnmsxwor7nxmagthna/00226.png',
    attributes: [Array]
  },
  timeLastUpdated: '2022-08-19T17:10:35.128Z',
  contractMetadata: { name: 'Zero Beings', symbol: 'ZERB', tokenType: 'ERC721' }
  },
```

Collection Data Structure

```json
{
  "contract": {
    "address": "0x8fba3ebe77d3371406a77eeaf40c89c1ed55364a"
  },
  "id": {
    "tokenId": "0x0000000000000000000000000000000000000000000000000000000000000003",
    "tokenMetadata": {
      "tokenType": "ERC721"
    }
  },
  "title": "Zero Beings #3",
  "description": "2022 Zero Beings",
  "tokenUri": {
    "raw": "ipfs://bafybeidp7mzzgvcnedwqjw3vw3fljdk3zyjtfwvln3gmzahucytcx4wgme/3.json",
    "gateway": "https://alchemy.mypinata.cloud/ipfs/bafybeidp7mzzgvcnedwqjw3vw3fljdk3zyjtfwvln3gmzahucytcx4wgme/3.json"
  },
  "media": [
    {
      "raw": "ipfs://bafybeihvhk34lgwoh42qjkvz6obyeyls3236s5gojjukw3sq6ommg2eaye/00003.png",
      "gateway": "https://nft-cdn.alchemy.com/eth-mainnet/d4b09a580a837a5332c9cc56c5648a7c",
      "thumbnail": "https://res.cloudinary.com/alchemyapi/image/upload/thumbnail/eth-mainnet/d4b09a580a837a5332c9cc56c5648a7c",
      "format": "png",
      "bytes": 501379
    }
  ],
  "metadata": {
    "name": "Zero Beings #3",
    "description": "2022 Zero Beings",
    "image": "ipfs://bafybeihvhk34lgwoh42qjkvz6obyeyls3236s5gojjukw3sq6ommg2eaye/00003.png",
    "attributes": [
      {
        "value": "Rainbow",
        "trait_type": "The Underground"
      },
      {
        "value": "Black",
        "trait_type": "Background Space"
      },
      {
        "value": "Orange",
        "trait_type": "Zero Being"
      },
      {
        "value": "Purple",
        "trait_type": "Goggles"
      },
      {
        "value": "Kepler-1229b",
        "trait_type": "Home Planet"
      },
      {
        "value": "Atomic",
        "trait_type": "House"
      },
      {
        "value": "Two",
        "trait_type": "Rocket Type"
      },
      {
        "value": "Ludicrous",
        "trait_type": "Mode"
      },
      {
        "value": "Rolly Polly Ace",
        "trait_type": "Catchphrase"
      }
    ]
  },
  "timeLastUpdated": "2022-12-31T19:45:44.361Z",
  "contractMetadata": {
    "name": "Zero Beings",
    "symbol": "ZERB",
    "tokenType": "ERC721",
    "openSea": {
      "floorPrice": 0.009,
      "collectionName": "Zero Beings",
      "safelistRequestStatus": "not_requested",
      "imageUrl": "https://i.seadn.io/gcs/files/e223850b2d8848137a1ac957563d8cf2.gif?w=500&auto=format",
      "description": "Phase 2 :: Series 2 (2022) | cc0 NFT collection | The Zero Beings are coming! Zero Beings work hard at having fun, doing good research, bringing utility, and public good to their community. Which being are you?",
      "externalUrl": "https://www.zerobeings.xyz/",
      "twitterUsername": "Zero_beings",
      "discordUrl": "https://discord.gg/dWm4mw9Wkx",
      "lastIngestedAt": "2022-12-28T11:38:46.000Z"
    }
  }
},

```

Individual nft Data

```
{
  contract: { address: '0x9870da00643aea2be9df89d87efed0a2fdb5479e' },
  id: { tokenId: '12', tokenMetadata: { tokenType: 'ERC721' } },
  title: '',
  description: '',
  tokenUri: {
    raw: 'ipfs://bafkreibdk5xsank2j7lzzds7ga57ncvthbadncmzuayaphievinu6bk3i4',
    gateway: 'https://alchemy.mypinata.cloud/ipfs/bafkreibdk5xsank2j7lzzds7ga57ncvthbadncmzuayaphievinu6bk3i4'
  },
  media: [
    {
      raw: 'ipfs://bafybeifq7rj3ekf3obkocj2n55pjrfoe3i276cycmasfwvsyrvw544kgra',
      gateway: 'https://nft-cdn.alchemy.com/eth-goerli/db1e8bbd8b6875d72134906ede1bbd98',
      thumbnail: 'https://res.cloudinary.com/alchemyapi/image/upload/thumbnail/eth-goerli/db1e8bbd8b6875d72134906ede1bbd98',
      format: 'png',
      bytes: 381104
    }
  ],
  metadata: {
    image: 'ipfs://bafybeifq7rj3ekf3obkocj2n55pjrfoe3i276cycmasfwvsyrvw544kgra'
  },
  timeLastUpdated: '2023-01-16T18:56:08.048Z',
  contractMetadata: {
    name: 'Test_Warp',
    symbol: 'Twarp',
    tokenType: 'ERC721',
    openSea: { lastIngestedAt: '2023-01-21T14:37:29.000Z' }
  }
}
```

### Thirdweb
Direct Listing Data Structure
```
[
{
  assetContractAddress: '0x9870Da00643AeA2BE9dF89d87efeD0A2fdb5479e',
  buyoutPrice: BigNumber { _hex: '0x2386f26fc10000', _isBigNumber: true },
  currencyContractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  buyoutCurrencyValuePerToken: {
    name: 'Görli Ether',
    symbol: 'GOR',
    decimals: 18,
    value: [BigNumber],
    displayValue: '0.01'
  },
  id: '3',
  tokenId: BigNumber { _hex: '0x0c', _isBigNumber: true },
  quantity: BigNumber { _hex: '0x01', _isBigNumber: true },
  startTimeInSeconds: BigNumber { _hex: '0x63a76964', _isBigNumber: true },
  asset: {
    image: 'https://gateway.ipfscdn.io/ipfs/bafybeifq7rj3ekf3obkocj2n55pjrfoe3i276cycmasfwvsyrvw544kgra',
    id: '12',
    uri: 'ipfs://bafkreibdk5xsank2j7lzzds7ga57ncvthbadncmzuayaphievinu6bk3i4'
  },
  secondsUntilEnd: BigNumber { _hex: '0x63b0a3e4', _isBigNumber: true },
  sellerAddress: '0xbCdbe666a43437333CcC375C1E33461E260B57E6',
  type: 0 // this represents the listing type 0=direct and 1=auction
},
]

```

Auction Data Structure
```
[
  {
    assetContractAddress: '0x9870Da00643AeA2BE9dF89d87efeD0A2fdb5479e',
    buyoutPrice: BigNumber { _hex: '0x6a94d74f430000', _isBigNumber: true },
    currencyContractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    buyoutCurrencyValuePerToken: {
      name: 'Görli Ether',
      symbol: 'GOR',
      decimals: 18,
      value: [BigNumber],
      displayValue: '0.03'
    },
    id: '8',
    tokenId: BigNumber { _hex: '0x01', _isBigNumber: true },
    quantity: BigNumber { _hex: '0x01', _isBigNumber: true },
    startTimeInEpochSeconds: BigNumber { _hex: '0x63b9e530', _isBigNumber: true },
    asset: {
      image: 'https://gateway.ipfscdn.io/ipfs/bafybeifq7rj3ekf3obkocj2n55pjrfoe3i276cycmasfwvsyrvw544kgra',
      id: '1',
      uri: 'ipfs://bafkreibdk5xsank2j7lzzds7ga57ncvthbadncmzuayaphievinu6bk3i4'
    },
    reservePriceCurrencyValuePerToken: {
      name: 'Görli Ether',
      symbol: 'GOR',
      decimals: 18,
      value: [BigNumber],
      displayValue: '0.0'
    },
    reservePrice: BigNumber { _hex: '0x00', _isBigNumber: true },
    endTimeInEpochSeconds: BigNumber { _hex: '0x63c31fb0', _isBigNumber: true },
    sellerAddress: '0xbCdbe666a43437333CcC375C1E33461E260B57E6',
    type: 1
  }
]


```

Offers
```
[
  {
    quantity: undefined,
    pricePerToken: BigNumber { _hex: '0x038d7ea4c68000', _isBigNumber: true },
    currencyContractAddress: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    buyerAddress: '0xbCdbe666a43437333CcC375C1E33461E260B57E6',
    quantityDesired: BigNumber { _hex: '0x01', _isBigNumber: true },
    currencyValue: {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      value: [BigNumber],
      displayValue: '0.001'
    },
    listingId: BigNumber { _hex: '0x05', _isBigNumber: true }
  }
]
```

Token Addresses

```
{
  '1': {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    wrapped: {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      name: 'Wrapped Ether',
      symbol: 'WETH'
    }
  },
  '5': {
    name: 'Görli Ether',
    symbol: 'GOR',
    decimals: 18,
    wrapped: {
      address: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
      name: 'Wrapped Ether',
      symbol: 'WETH'
    }
  },
  '10': {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    wrapped: {
      address: '0x4200000000000000000000000000000000000006',
      name: 'Wrapped Ether',
      symbol: 'WETH'
    }
  },
  '56': {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
    wrapped: {
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      name: 'Wrapped Binance Chain Token',
      symbol: 'WBNB'
    }
  },
  '97': {
    name: 'Binance Chain Native Token',
    symbol: 'TBNB',
    decimals: 18,
    wrapped: {
      address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
      name: 'Wrapped Binance Chain Testnet Token',
      symbol: 'WBNB'
    }
  },
  '137': {
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
    wrapped: {
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      name: 'Wrapped Matic',
      symbol: 'WMATIC'
    }
  },
  '250': {
    name: 'Fantom',
    symbol: 'FTM',
    decimals: 18,
    wrapped: {
      address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
      name: 'Wrapped Fantom',
      symbol: 'WFTM'
    }
  },
  '420': {
    name: 'Goerli Ether',
    symbol: 'ETH',
    decimals: 18,
    wrapped: {
      address: '0x4200000000000000000000000000000000000006',
      name: 'Wrapped Ether',
      symbol: 'WETH'
    }
  },
  '4002': {
    name: 'Fantom',
    symbol: 'FTM',
    decimals: 18,
    wrapped: {
      address: '0xf1277d1Ed8AD466beddF92ef448A132661956621',
      name: 'Wrapped Fantom',
      symbol: 'WFTM'
    }
  },
  '31337': {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    wrapped: {
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      name: 'Wrapped Ether',
      symbol: 'WETH'
    }
  },
  '42161': {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    wrapped: {
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      name: 'Wrapped Ether',
      symbol: 'WETH'
    }
  },
  '43113': {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    wrapped: {
      address: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
      name: 'Wrapped AVAX',
      symbol: 'WAVAX'
    }
  },
  '43114': {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    wrapped: {
      address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      name: 'Wrapped AVAX',
      symbol: 'WAVAX'
    }
  },
  '80001': {
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
    wrapped: {
      address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      name: 'Wrapped Matic',
      symbol: 'WMATIC'
    }
  },
  '421613': {
    name: 'Arbitrum Goerli Ether',
    symbol: 'AGOR',
    decimals: 18,
    wrapped: {
      address: '0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3',
      name: 'Wrapped Ether',
      symbol: 'WETH'
    }
  }
}
```

### Rarible
Fetch the contract royalties
```
Rarible API https://multichain-api.rarible.org/testnet/tag/item-controller#operation/getItemRoyaltiesById
{
  royalties: [
    {
      account: 'ETHEREUM:0xbcdbe666a43437333ccc375c1e33461e260b57e6',
      value: 500
    }
  ]
}

```
