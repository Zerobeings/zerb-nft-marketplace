const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('cross-fetch');
require('dotenv').config();
const Privateparty = require('privateparty');
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(process.env.RPC);
const path = require('path');
const favicon = require('serve-favicon');
const { ThirdwebSDK, NATIVE_TOKEN_ADDRESS, ChainId, NATIVE_TOKENS } = require ("@thirdweb-dev/sdk"); //adding thirdweb marketplace contract functions
const gsdk = new ThirdwebSDK("goerli"); //goerli marketplace network
const sdk = new ThirdwebSDK("ethereum"); //mainnet marketplace contract
const party = new Privateparty({
  walletconnect: process.env.INFURA,
});

// set the view engine to ejs
party.app.set('view engine', 'ejs');

// use
party.app.use(express.static('public'));
party.app.use(favicon(path.join('public/images', 'favicon.ico')));
party.app.use(express.json()); // for parsing application/json
party.app.use(express.urlencoded({ extended: true }));
party.app.use(bodyParser.urlencoded({ extended: true }));

//variables
var jsonParser = bodyParser.json();

// Marketplace contracts
// contracts are referenced in three locations in mbox.json for mainnet and gbox.json for goerli,
// the listingsCard and mybids for mainnet and goerli-listingsCard & goerli-mybids in the IPFS site link,
// in the routes for the marketplaces below, and finally the marketfooter files.

// Authorization. For more info and examples go to https://privateparty.dev/
//contract addresses

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

party.add('tinydinos', {
  contracts: {
    tinydinos: {
      address: '0xd9b78a2f1dafc8bb9c60961790d2beefebee56f4', //for tiny dinos 
      rpc: process.env.RPC,
      abi: party.abi.erc721,
    },
  },
  authorize: async (req, account, contracts) => {
    let balance = await contracts.tinydinos.methods.balanceOf(account).call();
    if (balance > 0) return { balance: balance };
    else
      throw new Error(
        "You must own at least one 'tiny dinos'"
      );
  },
});

party.add('freshfrogsNFT', {
  contracts: {
    freshfrogsNFT: {
      address: '0xbe4bef8735107db540de269ff82c7de9ef68c51b', //for freshfrogsNFT
      rpc: process.env.RPC,
      abi: party.abi.erc721,
    },
  },
  authorize: async (req, account, contracts) => {
    let balance = await contracts.freshfrogsNFT.methods.balanceOf(account).call();
    if (balance > 0) return { balance: balance };
    else
      throw new Error(
        "You must own at least one 'FreshFrogsNFT'"
      );
  },
});


//guest login option
party.add('guest');

//To understand response error ---> .then(res => console.log(res))

//////////////////////////////////////////////////////
//                                                  //
//                  Routings                        //
//                                                  //
//////////////////////////////////////////////////////

//login
party.app.get("/login", (req, res) => {
  res.render('pages/login')
})

//////////////////////////////////////////////////////
//                                                  //
//        Zero Beings Marketplace - Mainnet         //
//                                                  //
//////////////////////////////////////////////////////

//Market Home Page
party.app.get('/marketgm', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'],{ redirect: "/login" }), async (req, res, next) => {
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }
  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }
  var contract = '0x8FbA3ebe77D3371406a77EEaf40c89C1Ed55364a'; //initialized with your prefferred collection contract
  const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTsForCollection`;
  const pageCount = 100;
  const withMetadata = true;
  var pageKey = '';
  var pageKeysM = []; 
  var page = req.params.page || 1;
  const fetchURL = `${baseURL}?contractAddress=${contract}&withMetadata=${withMetadata}&startToken=${pageKey}&limit=${pageCount}`;
  const fetchfp = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/getFloorPrice?contractAddress=${contract}`;
  const fetchSumAtt = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/summarizeNFTAttributes?contractAddress=${contract}`;
  const mainnetMarketContract = '0x8F6502Aeae32D3B708236F8cB1eB2aa45429cE34'; //ETH mainnet marketplace contract. Deploy from thirdweb dashboard
  const marketContract = await sdk.getContract(mainnetMarketContract, "marketplace"); //get marketplace contract

  try {
    const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) => data.json());
    const NFTs = nfts.nfts;
    const fp = await fetch(fetchfp, { method: 'GET' }).then((data) => data.json());

    const sumatt = await fetch(fetchSumAtt, { method: 'GET' }).then((data) => data.json());
    const summary = (sumatt.summary || {});

    const totalNFTs = sumatt.totalSupply;
    const pages = Math.ceil(totalNFTs / pageCount);
    pageKeysM = new Array(pages); // GS: creates a new array with length pages
    pageKeysM.fill(0, ''); // GS: fills the array with empty string at the beginning, 0s after that
    pageKeysM[0] = nfts.nextToken;

    contractM = NFTs[0].contract.address;
    IDToken = NFTs[0].id.tokenId;
    const royaltyURL = `https://api.rarible.org/v0.1/items/ETHEREUM:${contractM}:${IDToken}/royalties` //rarible api to fetch royalties
    
    //update listings contract to contractM once released to mainnet
    const listings = await marketContract.getActiveListings({tokenContract: contractM}); //get active listings for contract
    const royalties = await fetch(royaltyURL, {method: 'GET'}).then((data) => data.json()); //get creator royalties for specific listing

    res.render('pages/marketgm', {
      session: req.session,
      nfts,
      NFTs,
      rarity: null,
      pages,
      current: page,
      summary,
      fp,
      sumatt,
      pageKey,
      contract,
      listings,
      contractM,
      pageKeysM,
      royalties,
    });
  } catch (error) {
    // console.log(error);
    res.render('pages/marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pages: null,
      current: null,
      summary:null,
      fp:null,
      sumatt: null,
      pageKey: null,
      contract:null,
      listings:null,
      contractM:null,
      pageKeysM:null,
      royalties:null,
    });
  }
});

//Collection view pagination
party.app.post('/marketgm/:page', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'], { redirect: "/login" }), async (req, res, next) => {
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }

  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }
  var contract = req.body.contractM; //'0x8FbA3ebe77D3371406a77EEaf40c89C1Ed55364a'; //
  var pageKeysM = JSON.parse(req.body.pageKeysM);
  const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTsForCollection`;
  const pageCount = 100;
  const withMetadata = true;
  var page = req.params.page || 1;
  var pageKey = pageKeysM[page - 2];
    
  const fetchURL = `${baseURL}?contractAddress=${contract}&withMetadata=${withMetadata}&startToken=${pageKey}&limit=${pageCount}`;
  const fetchSumAtt = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/summarizeNFTAttributes?contractAddress=${contract}`;
  const fetchfp = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/getFloorPrice?contractAddress=${contract}`;
  const fetchRe = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/reingestContract?contractAddress=${contract}`;
  const mainnetMarketContract = '0x8F6502Aeae32D3B708236F8cB1eB2aa45429cE34'; //ETH mainnet marketplace contract. Deploy from thirdweb dashboard
  const marketContract = await sdk.getContract(mainnetMarketContract, "marketplace"); //get marketplace contract

  try {
    const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) => data.json());
    const sumatt = await fetch(fetchSumAtt, { method: 'GET' }).then((data) => data.json());
    const summary = (sumatt.summary || {});
    const fp = await fetch(fetchfp, { method: 'GET' }).then((data) => data.json());
    const refresh = await fetch(fetchRe, { method: 'GET' }).then((data) => data.json());

    const NFTs = nfts.nfts;
    const totalNFTs = sumatt.totalSupply;
    const pages = Math.ceil(totalNFTs / pageCount);

    if(req.body.collection != null){
      pageKeysM = new Array(pages); // GS: creates a new array with length pages
      pageKeysM.fill(0, ''); // GS: fills the array with empty string at the beginning, 0s after that
      pageKeysM[0] = nfts.nextToken;
    } else {
      pageKeysM[page-1] = nfts.nextToken;
    }

    contractM = NFTs[0].contract.address;
    IDToken = NFTs[0].id.tokenId;
   
    const royaltyURL = `https://api.rarible.org/v0.1/items/ETHEREUM:${contractM}:${IDToken}/royalties` //rarible api to fetch royalties
    const listings = await marketContract.getActiveListings({tokenContract: "0x9870Da00643AeA2BE9dF89d87efeD0A2fdb5479e"}); //get active listings from contract
    const royalties = await fetch(royaltyURL, {method: 'GET'}).then((data) => data.json()); //get creator royalties for specific listing
  
    res.render('pages/marketgm', {
      session: req.session,
      nfts,
      NFTs,
      rarity: null,
      pageKey,
      pages,
      current: page,
      sumatt,
      summary,
      fp,
      refresh,
      contract,
      listings,
      contractM,
      pageKeysM,
      royalties,
    });
  } catch (error) {
    // console.log(error);
    res.render('pages/marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pageKey: null,
      pages: null,
      current: null,
      sumatt:null,
      summary:null,
      fp:null,
      refresh:null,
      contract:null,
      listings:null,
      contractM:null,
      pageKeys:null,
      royalties:null,
    });
  }
});

//Query Collection and Listings 
party.app.post('/marketgm', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'], { redirect: "/login" }), async (req, res, next) => {
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }

  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }
  if(req.body.collection){
    var contract = req.body.collection ;
  } else {
    var contract = req.body.contractM; //'0x8FbA3ebe77D3371406a77EEaf40c89C1Ed55364a'; //
  }
  var page = req.params.page || 1;
  if(req.body.collection || page == 1){ 
    var pageKey = '';
  } else {
    var pageKey = pageKeysM[page - 2];
  }
  if(pageKeysM){
  var pageKeysM = JSON.parse(req.body.pageKeysM);
  }
  const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTsForCollection`;
  const pageCount = 100;
  const withMetadata = true;
  const fetchURL = `${baseURL}?contractAddress=${contract}&withMetadata=${withMetadata}&startToken=${pageKey}&limit=${pageCount}`;
  const fetchSumAtt = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/summarizeNFTAttributes?contractAddress=${contract}`;
  const fetchfp = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/getFloorPrice?contractAddress=${contract}`;
  const fetchRe = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/reingestContract?contractAddress=${contract}`;
  const mainnetMarketContract = '0x8F6502Aeae32D3B708236F8cB1eB2aa45429cE34'; //ETH mainnet marketplace contract. Deploy from thirdweb dashboard
  const marketContract = await sdk.getContract(mainnetMarketContract, "marketplace"); //get marketplace contract
  

  try {
    const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) =>
      data.json()
    );
    
    const sumatt = await fetch(fetchSumAtt, { method: 'GET' }).then((data) => data.json());
    const summary = (sumatt.summary || {});
    const fp = await fetch(fetchfp, { method: 'GET' }).then((data) => data.json());
    const refresh = await fetch(fetchRe, { method: 'GET' }).then((data) => data.json());
    
    const NFTs = nfts.nfts;
    const totalNFTs = sumatt.totalSupply;
    const pages = Math.ceil(totalNFTs / pageCount); //results per page
    pageKeysM = new Array(pages); // GS: creates a new array with length pages
    pageKeysM.fill(0, ''); // GS: fills the array with empty string at the beginning, 0s after that
    pageKeysM[0] = nfts.nextToken;

    contractM = NFTs[0].contract.address;
    IDToken = NFTs[0].id.tokenId;
    const royaltyURL = `https://api.rarible.org/v0.1/items/ETHEREUM:${contractM}:${IDToken}/royalties` //rarible api to fetch royalties
    const listings = await marketContract.getActiveListings({tokenContract: "0x9870Da00643AeA2BE9dF89d87efeD0A2fdb5479e"}); //get active listings from contract
    const royalties = await fetch(royaltyURL, {method: 'GET'}).then((data) => data.json()); //get creator royalties for specific listing
    
    res.render('pages/marketgm', {
      session: req.session,
      nfts,
      NFTs,
      rarity: null,
      pageKey,
      pages,
      current: page,
      sumatt,
      summary,
      fp,
      refresh,
      contract,
      listings,
      contractM,
      pageKeysM,
      royalties,
    });
  } catch (error) {
    //console.log(error);
    res.render('pages/marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pageKey: null,
      pages: null,
      current: null,
      sumatt:null,
      summary:null,
      fp:null,
      refresh:null,
      contract:null,
      listings:null,
      contractM:null,
      pageKeys:null,
      royalties:null,
    });
  }
});

//detail view of collection NFT
party.app.get('/collectiondetails/:collection/:IDToken', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'],{ redirect: "/login" }), async (req, res, next) => {
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }
  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }
  var contract = req.params.collection;
  const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTMetadata`; //alchemy api - get NFT metadata
  var IDToken = req.params.IDToken;
  const fetchURL =`${baseURL}?contractAddress=${contract}&tokenId=${IDToken}&refreshCache=false`;

  try {
    const nft = await fetch(fetchURL, { method: 'GET' }).then((data) => data.json());
    

    res.render('pages/collectiondetails', {
      session: req.session,
      nfts:null,
      contract,
      IDToken,
      nft,
    });
  } catch (error) {
    //console.log(error);
    res.render('pages/marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pages: null,
      current: null,
      summary:null,
      fp:null,
      sumatt: null,
      pageKey: null,
      contract:null,
      listings:null,
      contractM:null,
      IDToken:null,
      pageKeysM:null,
      nft:null,
    });
  }
});

// My Listings page
party.app.get('/myListings', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'],{ redirect: "/login" }), async (req, res, next) => {
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }
  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }
  const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}/getNFTs/`;
  const pageCount = 100;
  var pageKey = ''; 
  var pageKeysP = [];
  var page = req.params.page || 1;
  const fetchURL = `${baseURL}?owner=${wallet}&pageKey=${pageKey}&pageSize=${pageCount}`;
  const mainnetMarketContract = '0x8F6502Aeae32D3B708236F8cB1eB2aa45429cE34'; //ETH mainnet marketplace contract. Deploy from thirdweb dashboard
  const marketContract = await sdk.getContract(mainnetMarketContract, "marketplace"); //get marketplace contract

  try {
    const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) =>
      data.json()
    );
    
    const NFTs = nfts.ownedNfts;
    const totalNFTs = nfts.totalCount;
    const pages = Math.ceil(totalNFTs / pageCount); //results per page
    pageKeysP = new Array(pages); // GS: creates a new array with length pages
    pageKeysP.fill(0, ''); // GS: fills the array with empty string at the beginning, 0s after that
    pageKeysP[0] = nfts.pageKey;

    const listings = await marketContract.getActiveListings({seller: wallet}); //get active listings for a specific wallet address
    const allListings = await marketContract.getActiveListings(); //get all listings, this includes listings sold. This is used to find bids by logged in wallet address
      const bidsListings = [];
      const myBids = [];
      const bids = [];
      const listingsForBids = [];
  
      if(allListings.length > 0) {
        allListings.forEach((alistings,i) => {
            if(alistings.type === 1){
              bidsListings.push(alistings); //push auction based listings to an array
            }
          }
        )};
   
      if(bidsListings != null){
        for (i = 0; i < bidsListings.length; i++) {
          const offers = await marketContract.getOffers(bidsListings[i].id); //get offers for the listing from thirdweb sdk
          myBids.push(offers)  
        };
      }
  
      for (i = 0; i < myBids.length; i++) {
        for(p = 0; p < myBids[i].length; p++){
          if((myBids[i][p].buyerAddress).toLowerCase() === wallet.toLowerCase()){
            bids.push(myBids[i][p]);
            const bidList = await marketContract.getListing(myBids[i][p].listingId); //get the listing connected to the specific offer
            listingsForBids.push(bidList);
          }
        }
      }

    res.render('pages/myListings', {
      session: req.session,
      nfts,
      NFTs,
      rarity: null,
      pages,
      current: page,
      summary: null,
      fp: null,
      sumatt: null,
      pageKey,
      contract:null,
      listings,
      contractM:null,
      pageKeysP,
      bids,
      listingsForBids,
    });
  } catch (error) {
    // console.log(error);
    res.render('pages/marketerror', { //need to create a market specific page for errors
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pages: null,
      current: null,
      summary:null,
      fp:null,
      sumatt: null,
      pageKey: null,
      contract:null,
      listings:null,
      contractM:null,
      pageKeysP:null,
      bids:null,
      listingsForBids:null,
    });
  }
});

//My Listings pages
party.app.post('/myListings/:page', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'], { redirect: "/login" }),
  async (req, res, next) => {
    if(req.session.zerb != undefined){
      var wallet = `${req.session.zerb.account}`;
    }
  
    if(req.session.guest != undefined){
      var wallet = `${req.session.guest.account}`;
    }
    if(req.session.tinydinos != undefined){
      var wallet = `${req.session.tinydinos.account}`;
    }
  
    if(req.session.freshfrogsNFT != undefined){
      var wallet = `${req.session.freshfrogsNFT.account}`; 
    }
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}/getNFTs/`; //alchemy api get NFTs
    const pageCount = 100; //total number of results shown. maximum 100.
    var page = req.params.page;
    var pageKeysP = JSON.parse(req.body.pageKeysP);
    if(page != 1){
    var pageKey = pageKeysP[page - 2];
    } else {
    var pageKey = '';
    } 
    const fetchURL = `${baseURL}?owner=${wallet}&pageKey=${pageKey}&pageSize=${pageCount}`;
    const mainnetMarketContract = '0x8F6502Aeae32D3B708236F8cB1eB2aa45429cE34'; //ETH mainnet marketplace contract. Deploy from thirdweb dashboard
    const marketContract = await sdk.getContract(mainnetMarketContract, "marketplace"); //get marketplace contract

    try {
      const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) =>
        data.json()
      );
       
      const NFTs = nfts.ownedNfts; //fetch all ownedNfts
      const totalNFTs = nfts.totalCount;
      const pages = Math.ceil(totalNFTs / pageCount); //100 results per page
      
      pageKeysP[page-1]=nfts.pageKey

      const listings = await marketContract.getActiveListings({seller: wallet}); //get active listings from an address
      const allListings = await marketContract.getActiveListings(); //get all listings, this includes listings sold. This is used to find bids by logged in wallet address
      const bidsListings = [];
      const myBids = [];
      const bids = [];
      const listingsForBids = [];
  
      if(allListings.length > 0) {
        allListings.forEach((alistings,i) => {
            if(alistings.type === 1){
              bidsListings.push(alistings); //push auction based listings to an array
            }
          }
        )};
   
      if(bidsListings != null){
        for (i = 0; i < bidsListings.length; i++) {
          const offers = await marketContract.getOffers(bidsListings[i].id); //get offers for the listing from thirdweb sdk
          myBids.push(offers)  
        };
      }
  
      for (i = 0; i < myBids.length; i++) {
        for(p = 0; p < myBids[i].length; p++){
          if((myBids[i][p].buyerAddress).toLowerCase() === wallet.toLowerCase()){
            bids.push(myBids[i][p]);
            const bidList = await marketContract.getListing(myBids[i][p].listingId); //get the listing connected to the specific offer
            listingsForBids.push(bidList);
          }
        }
      }

      res.render('pages/myListings', {
        session: req.session,
        nfts,
        NFTs,
        rarity: null,
        pageKey,
        pages,
        current: page,
        sumatt: null,
        summary: null,
        fp: null,
        refresh:null,
        contract:null,
        listings,
        contractM,
        pageKeysP,
        bids,
        listingsForBids,
      });
    } catch (error) {
      // console.log(error);
      res.render('pages/marketerror', {
        session: req.session,
        NFTs: null,
        nfts: null,
        pageKey: null,
        pages: null,
        current: null,
        sumatt:null,
        summary:null,
        fp:null,
        refresh:null,
        contract:null,
        listings:null,
        contractM:null,
        pageKeysP:null,
        bids:null,
        listingsForBids:null,
      });
    }
  }
);

//Page to view a listings details from marketgm page
party.app.get('/listingDetails/:contract/:IDToken', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'],{ redirect: "/login" }), async (req, res, next) => {
  // console.log('fetching NFTs');
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }
  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }
  var contract = req.params.contract;
  var IDToken = req.params.IDToken;
  const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTMetadata`; // alchemy api
  const fetchURL =`${baseURL}?contractAddress=${contract}&tokenId=${IDToken}&refreshCache=false`; //fetchURL for NFT alchemy api
  const mainnetMarketContract = '0x8F6502Aeae32D3B708236F8cB1eB2aa45429cE34'; //ETH mainnet marketplace contract. Deploy from thirdweb dashboard
  const marketContract = await sdk.getContract(mainnetMarketContract, "marketplace"); //get marketplace contract thirdweb sdk
  const wrapper = NATIVE_TOKENS; //from thirdweb sdk. fetchs all networks and associated wrapped tokens. This allow for offers to be made
  const royaltyURL = `https://api.rarible.org/v0.1/items/ETHEREUM:${contract}:${IDToken}/royalties` //rarible api to fetch royalties

  try {
    const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) => data.json()); //get listings with alchemy api
    const listings = await marketContract.getActiveListings({tokenContract: contract, tokenId: IDToken}); //get listing from the contract thirdweb sdk
    const offers = await marketContract.getOffers(listings[0].id); //get offers for the listing from thirdweb sdk
    const royalties = await fetch(royaltyURL, {method: 'GET'}).then((data) => data.json()); //get creator royalties for specific listing

    res.render('pages/listingDetails', {
      session: req.session,
      nfts,
      NFTs:null,
      contract,
      listings,
      IDToken,
      nft:null,
      wrapper,
      offers,
      royalties,
    });
  } catch (error) {
    //console.log(error);
    res.render('pages/marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pages: null,
      current: null,
      summary:null,
      fp:null,
      sumatt: null,
      pageKey: null,
      contract:null,
      listings:null,
      contractM:null,
      IDToken:null,
      pageKeysM:null,
      nft:null,
      wrapper:null,
      offers:null,
      royalties:null,
    });
  }
});

// My Auctions to Close Page
party.app.get('/auctions', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'],{ redirect: "/login" }), async (req, res, next) => {
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }
  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }
  const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}/getNFTs/`;
  const pageCount = 1;
  var pageKey = '';
  const fetchURL = `${baseURL}?owner=${wallet}&pageKey=${pageKey}&pageSize=${pageCount}`;
  const mainnetMarketContract = '0x8F6502Aeae32D3B708236F8cB1eB2aa45429cE34'; //ETH mainnet marketplace contract. Deploy from thirdweb dashboard
  const marketContract = await sdk.getContract(mainnetMarketContract, "marketplace"); //get marketplace contract

  try {
    const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) =>
      data.json()
    );
    
    const NFTs = nfts.ownedNfts;
    const allListings = await marketContract.getActiveListings(); //get active listings. This is used to find bids by logged in wallet address
    const everyListing = await marketContract.getAllListings(); // get all active and inactive listing
    
    const bidsListings = []; // all active auction listings
    const myBids = [];
    const bids = [];
    const listingsForBids = [];

    const allAuctionListings = []; //all auction listings
    const nonActiveAuctions = []; //all non-active listings
    const myAuctionsToClose = []; //all my auctions to close

    if(allListings.length > 0) {
      allListings.forEach((alistings,i) => {
          if(alistings.type === 1){
            bidsListings.push(alistings); //push auction based listings to an array
          }
        }
      )};
    
    if(bidsListings != null){
    for (i = 0; i < bidsListings.length; i++) {
     const offers = await marketContract.getOffers(bidsListings[i].id); //get offers for the listing from thirdweb sdk
      myBids.push(offers)  
    };
    }

    for (i = 0; i < myBids.length; i++) {
      for(p = 0; p < myBids[i].length; p++){
        if((myBids[i][p].buyerAddress).toLowerCase() === wallet.toLowerCase()){
          bids.push(myBids[i][p]);
          const bidList = await marketContract.getListing(myBids[i][p].listingId); //get the listing connected to the specific offer
          listingsForBids.push(bidList);
        }
      }
    }

    if(everyListing.length > 0) {
      everyListing.forEach((eListing,i) => {
          if(eListing.type === 1){
            allAuctionListings.push(eListing); //push auction based listings to an array
          }
        }
      )};

    if(allAuctionListings.length > 0) { 
      allAuctionListings.forEach(el1 => {      
        el1IsPresentInArr2 = bidsListings.some(el2 => el2.id === el1.id); 
          if (!el1IsPresentInArr2) { 
            nonActiveAuctions.push(el1);    
          }
      }
    )};

    if(nonActiveAuctions.length > 0) { 
      for (i = 0; i < nonActiveAuctions.length; i++) {
          const myWins = await marketContract.auction.getWinner(nonActiveAuctions[i].id); //get the listing connected to the specific offer
          if(myWins.toLowerCase() === wallet.toLowerCase() || nonActiveAuctions[i].sellerAddress.toLowerCase() === wallet.toLowerCase()){
            myAuctionsToClose.push(nonActiveAuctions[i]);
          }      
      }
    }

    res.render('pages/auctions', {
      session: req.session,
      nfts,
      NFTs,
      rarity: null,
      pages: null,
      current: null,
      summary: null,
      fp: null,
      sumatt: null,
      pageKey:null,
      contract:null,
      listings:null,
      contractM:null,
      pageKeysP:null,
      bids,
      listingsForBids,
      myAuctionsToClose,
    });
  } catch (error) {
    // console.log(error);
    res.render('pages/marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pages: null,
      current: null,
      summary:null,
      fp:null,
      sumatt: null,
      pageKey: null,
      contract:null,
      listings:null,
      contractM:null,
      pageKeysP:null,
      bids:null,
      listingsForBids:null,
      myAuctionsToClose:null,
    });
  }
});

//////////////////////////////////////////////////////
//                                                  //
//        Zero Beings Marketplace - Goerli          //
//                                                  //
//////////////////////////////////////////////////////

// goerli Market Home Page
party.app.get('/goerli-marketgm', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'],{ redirect: "/login" }), async (req, res, next) => {
  
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }

  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }

  var contract = '0x9870Da00643AeA2BE9dF89d87efeD0A2fdb5479e'; //initialized with your prefferred collection contract
  const baseURL = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTsForCollection`;
  const pageCount = 100;
  const withMetadata = true;
  var pageKey = '';
  var pageKeysM = []; 
  var page = req.params.page || 1;
  const fetchURL = `${baseURL}?contractAddress=${contract}&withMetadata=${withMetadata}&startToken=${pageKey}&limit=${pageCount}`;
  //const fetchfp = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getFloorPrice?contractAddress=${contract}`; //not currently supported for testnet
  //const fetchSumAtt = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/summarizeNFTAttributes?contractAddress=${contract}`; //not currently supported for testnet
  const gMarkectContract = '0xC65CE759f006928451343874538A328dFcbAD325'; //goerli marketplace contract. Deploy from thirdweb dashboard.
  const marketContract = await gsdk.getContract(gMarkectContract, "marketplace"); //get marketplace contract

  try {
    const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) => data.json());
    const NFTs = nfts.nfts;
    //const fp = await fetch(fetchfp, { method: 'GET' }).then((data) => data.json()); //not currently supported for testnet

    //const sumatt = await fetch(fetchSumAtt, { method: 'GET' }).then((data) => data.json()); //not currently supported for testnet
    //const summary = (sumatt.summary || {});

    const totalNFTs = 10000 // sumatt.totalSupply; //not currently supported for testnet 10000 assigned as typical qty for a collection
    const pages = Math.ceil(totalNFTs / pageCount);
    pageKeysM = new Array(pages); // GS: creates a new array with length pages
    pageKeysM.fill(0, ''); // GS: fills the array with empty string at the beginning, 0s after that
    pageKeysM[0] = nfts.nextToken;

    contractM = NFTs[0].contract.address;
    IDToken = NFTs[0].id.tokenId;
    const royaltyURL = `https://testnet-api.rarible.org/v0.1/items/ETHEREUM:${contractM}:${IDToken}/royalties` //rarible api to fetch royalties
    
    //update listings contract to contractM once released to mainnet
    const listings = await marketContract.getActiveListings({tokenContract: contractM}); //get active listings for contract
    const royalties = await fetch(royaltyURL, {method: 'GET'}).then((data) => data.json()); //get creator royalties for specific listing

    res.render('pages/goerli-marketgm', {
      session: req.session,
      nfts,
      NFTs,
      rarity: null,
      pages,
      current: page,
      summary:null,
      fp:null,
      sumatt:null,
      pageKey,
      contract,
      listings,
      contractM,
      pageKeysM,
      royalties,
    });
  } catch (error) {
    //console.log(error);
    res.render('pages/goerli-marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pages: null,
      current: null,
      summary:null,
      fp:null,
      sumatt: null,
      pageKey: null,
      contract:null,
      listings:null,
      contractM:null,
      pageKeysM:null,
      royalties:null,
    });
  }
});

// goerli Collection view pagination
party.app.post('/goerli-marketgm/:page', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'], { redirect: "/login" }), async (req, res, next) => {
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }
  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }

  var contract = req.body.contractM;
  var pageKeysM = JSON.parse(req.body.pageKeysM);
  const baseURL = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTsForCollection`;
  const pageCount = 100;
  const withMetadata = true;
  var page = req.params.page || 1;
  var pageKey = pageKeysM[page - 2];
    
  const fetchURL = `${baseURL}?contractAddress=${contract}&withMetadata=${withMetadata}&startToken=${pageKey}&limit=${pageCount}`;
  //const fetchSumAtt = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/summarizeNFTAttributes?contractAddress=${contract}`; //not currently supported for testnet
  //const fetchfp = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getFloorPrice?contractAddress=${contract}`; //not currently supported for testnet
  //const fetchRe = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/reingestContract?contractAddress=${contract}`;
  const gMarkectContract = '0xC65CE759f006928451343874538A328dFcbAD325'; //goerli marketplace contract. Deploy from thirdweb dashboard.
  const marketContract = await gsdk.getContract(gMarkectContract, "marketplace"); //get marketplace contract

  try {
    const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) => data.json());
    //const sumatt = await fetch(fetchSumAtt, { method: 'GET' }).then((data) => data.json());
    //const summary = (sumatt.summary || {});
    //const fp = await fetch(fetchfp, { method: 'GET' }).then((data) => data.json());
    //const refresh = await fetch(fetchRe, { method: 'GET' }).then((data) => data.json());

    const NFTs = nfts.nfts;
    const totalNFTs = 10000; //sumatt.totalSupply; //not currently supported for testnet 10000 assigned as typical qty for a collection
    const pages = Math.ceil(totalNFTs / pageCount);

    if(req.body.collection != null){
      pageKeysM = new Array(pages); // GS: creates a new array with length pages
      pageKeysM.fill(0, ''); // GS: fills the array with empty string at the beginning, 0s after that
      pageKeysM[0] = nfts.nextToken;
    } else {
      pageKeysM[page-1] = nfts.nextToken;
    }

    contractM = NFTs[0].contract.address;
    IDToken = NFTs[0].id.tokenId;
   
    const royaltyURL = `https://testnet-api.rarible.org/v0.1/items/ETHEREUM:${contractM}:${IDToken}/royalties` //rarible api to fetch royalties
    const listings = await marketContract.getActiveListings({tokenContract: contractM}); //get active listings from contract
    const royalties = await fetch(royaltyURL, {method: 'GET'}).then((data) => data.json()); //get creator royalties for specific listing
  
    res.render('pages/goerli-marketgm', {
      session: req.session,
      nfts,
      NFTs,
      rarity: null,
      pageKey,
      pages,
      current: page,
      sumatt:null,
      summary:null,
      fp:null,
      refresh:null,
      contract,
      listings,
      contractM,
      pageKeysM,
      royalties,
    });
  } catch (error) {
    // console.log(error);
    res.render('pages/goerli-marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pageKey: null,
      pages: null,
      current: null,
      sumatt:null,
      summary:null,
      fp:null,
      refresh:null,
      contract:null,
      listings:null,
      contractM:null,
      pageKeys:null,
      royalties:null,
    });
  }
});

// goerli Query Collection and Listings 
party.app.post('/goerli-marketgm', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'], { redirect: "/login" }), async (req, res, next) => {
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }

  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }

  if(req.body.collection){
    var contract = req.body.collection ;
  } else {
    var contract = req.body.contractM;
  }
  var page = req.params.page || 1;
  if(req.body.collection || page == 1){ 
    var pageKey = '';
  } else {
    var pageKey = pageKeysM[page - 2];
  }
  if(pageKeysM){
  var pageKeysM = JSON.parse(req.body.pageKeysM);
  }
  const baseURL = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTsForCollection`;
  const pageCount = 100;
  const withMetadata = true;
  const fetchURL = `${baseURL}?contractAddress=${contract}&withMetadata=${withMetadata}&startToken=${pageKey}&limit=${pageCount}`;
  //const fetchSumAtt = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/summarizeNFTAttributes?contractAddress=${contract}`; //not currently supported for testnet
  //const fetchfp = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getFloorPrice?contractAddress=${contract}`; //not currently supported for testnet
  //const fetchRe = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/reingestContract?contractAddress=${contract}`;
  const gMarkectContract = '0xC65CE759f006928451343874538A328dFcbAD325'; //goerli marketplace contract. Deploy from thirdweb dashboard.
  const marketContract = await gsdk.getContract(gMarkectContract, "marketplace"); //get marketplace contract
  

  try {
    const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) =>
      data.json()
    );
    
    // const sumatt = await fetch(fetchSumAtt, { method: 'GET' }).then((data) => data.json());
    // const summary = (sumatt.summary || {});
    // const fp = await fetch(fetchfp, { method: 'GET' }).then((data) => data.json());
    //const refresh = await fetch(fetchRe, { method: 'GET' }).then((data) => data.json());
    
    const NFTs = nfts.nfts;
    const totalNFTs = 10000;//sumatt.totalSupply; //not currently supported for testnet 10000 assigned as typical qty for a collection
    const pages = Math.ceil(totalNFTs / pageCount); //results per page
    pageKeysM = new Array(pages); // GS: creates a new array with length pages
    pageKeysM.fill(0, ''); // GS: fills the array with empty string at the beginning, 0s after that
    pageKeysM[0] = nfts.nextToken;

    contractM = NFTs[0].contract.address;
    IDToken = NFTs[0].id.tokenId;
    const royaltyURL = `https://testnet-api.rarible.org/v0.1/items/ETHEREUM:${contractM}:${IDToken}/royalties` //rarible api to fetch royalties
    const listings = await marketContract.getActiveListings({tokenContract: contractM}); //get active listings from contract
    const royalties = await fetch(royaltyURL, {method: 'GET'}).then((data) => data.json()); //get creator royalties for specific listing
    
    res.render('pages/goerli-marketgm', {
      session: req.session,
      nfts,
      NFTs,
      rarity: null,
      pageKey,
      pages,
      current: page,
      sumatt:null,
      summary:null,
      fp:null,
      refresh:null,
      contract,
      listings,
      contractM,
      pageKeysM,
      royalties,
    });
  } catch (error) {
    //console.log(error);
    res.render('pages/goerli-marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pageKey: null,
      pages: null,
      current: null,
      sumatt:null,
      summary:null,
      fp:null,
      refresh:null,
      contract:null,
      listings:null,
      contractM:null,
      pageKeys:null,
      royalties:null,
    });
  }
});

// goerli detail view of collection NFT
party.app.get('/goerli-collectiondetails/:collection/:IDToken', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'],{ redirect: "/login" }), async (req, res, next) => {
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }

  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }

  var contract = req.params.collection;
  const baseURL = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTMetadata`; //alchemy api - get NFT metadata
  var IDToken = req.params.IDToken;
  const fetchURL =`${baseURL}?contractAddress=${contract}&tokenId=${IDToken}&refreshCache=false`;

  try {
    const nft = await fetch(fetchURL, { method: 'GET' }).then((data) => data.json());
    

    res.render('pages/goerli-collectiondetails', {
      session: req.session,
      nfts:null,
      contract,
      IDToken,
      nft,
    });
  } catch (error) {
    //console.log(error);
    res.render('pages/goerli-marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pages: null,
      current: null,
      summary:null,
      fp:null,
      sumatt: null,
      pageKey: null,
      contract:null,
      listings:null,
      contractM:null,
      IDToken:null,
      pageKeysM:null,
      nft:null,
    });
  }
});

// goerli My Listings page
party.app.get('/goerli-myListings', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'],{ redirect: "/login" }), async (req, res, next) => {
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }

  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }

  const baseURL = `https://eth-goerli.alchemyapi.io/v2/${process.env.API_KEY}/getNFTs/`;
  const pageCount = 100;
  var pageKey = ''; 
  var pageKeysP = [];
  var page = req.params.page || 1;
  const fetchURL = `${baseURL}?owner=${wallet}&pageKey=${pageKey}&pageSize=${pageCount}`;
  const gMarkectContract = '0xC65CE759f006928451343874538A328dFcbAD325'; //goerli marketplace contract. Deploy from thirdweb dashboard.
  const marketContract = await gsdk.getContract(gMarkectContract, "marketplace"); //get marketplace contract

  try {
    const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) =>
      data.json()
    );
    
    const NFTs = nfts.ownedNfts;
    const totalNFTs = nfts.totalCount;
    const pages = Math.ceil(totalNFTs / pageCount); //results per page
    pageKeysP = new Array(pages); // GS: creates a new array with length pages
    pageKeysP.fill(0, ''); // GS: fills the array with empty string at the beginning, 0s after that
    pageKeysP[0] = nfts.pageKey;

    const listings = await marketContract.getActiveListings({seller: wallet}); //get active listings for a specific wallet address
    const allListings = await marketContract.getActiveListings(); //get all listings, this includes listings sold. This is used to find bids by logged in wallet address
    const bidsListings = []; // Active Listings
    const myBids = [];
    const bids = [];
    const listingsForBids = [];

    if(allListings.length > 0) {
      allListings.forEach((alistings,i) => {
          if(alistings.type === 1){
            bidsListings.push(alistings); //push auction based listings to an array
          }
        }
      )};
    
    if(bidsListings != null){
    for (i = 0; i < bidsListings.length; i++) {
     const offers = await marketContract.getOffers(bidsListings[i].id); //get offers for the listing from thirdweb sdk
      myBids.push(offers)  
    };
    }

    for (i = 0; i < myBids.length; i++) {
      for(p = 0; p < myBids[i].length; p++){
        if((myBids[i][p].buyerAddress).toLowerCase() === wallet.toLowerCase()){
          bids.push(myBids[i][p]);
          const bidList = await marketContract.getListing(myBids[i][p].listingId); //get the listing connected to the specific offer
          listingsForBids.push(bidList);
        }
      }
    }

    res.render('pages/goerli-myListings', {
      session: req.session,
      nfts,
      NFTs,
      rarity: null,
      pages,
      current: page,
      summary: null,
      fp: null,
      sumatt: null,
      pageKey,
      contract:null,
      listings,
      contractM:null,
      pageKeysP,
      bids,
      listingsForBids,
    });
  } catch (error) {
    // console.log(error);
    res.render('pages/goerli-marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pages: null,
      current: null,
      summary:null,
      fp:null,
      sumatt: null,
      pageKey: null,
      contract:null,
      listings:null,
      contractM:null,
      pageKeysP:null,
      bids:null,
      listingsForBids:null,
    });
  }
});

// goerli My Listings pages
party.app.post('/goerli-myListings/:page', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'], { redirect: "/login" }),
  async (req, res, next) => {
    if(req.session.zerb != undefined){
      var wallet = `${req.session.zerb.account}`;
    }
  
    if(req.session.guest != undefined){
      var wallet = `${req.session.guest.account}`;
    }

    if(req.session.tinydinos != undefined){
      var wallet = `${req.session.tinydinos.account}`;
    }
  
    if(req.session.freshfrogsNFT != undefined){
      var wallet = `${req.session.freshfrogsNFT.account}`; 
    }

    const baseURL = `https://eth-goerli.alchemyapi.io/v2/${process.env.API_KEY}/getNFTs/`; //alchemy api get NFTs
    const pageCount = 100; //total number of results shown. maximum 100.
    var page = req.params.page;
    var pageKeysP = JSON.parse(req.body.pageKeysP);
    if(page != 1){
    var pageKey = pageKeysP[page - 2];
    } else {
    var pageKey = '';
    } 
    const fetchURL = `${baseURL}?owner=${wallet}&pageKey=${pageKey}&pageSize=${pageCount}`;
    const gMarkectContract = '0xC65CE759f006928451343874538A328dFcbAD325'; //goerli marketplace contract. Deploy from thirdweb dashboard.
    const marketContract = await gsdk.getContract(gMarkectContract, "marketplace"); //get marketplace contract

    try {
      const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) =>
        data.json()
      );
       
      const NFTs = nfts.ownedNfts; //fetch all ownedNfts
      const totalNFTs = nfts.totalCount;
      const pages = Math.ceil(totalNFTs / pageCount); //100 results per page
      
      pageKeysP[page-1]=nfts.pageKey

      const listings = await marketContract.getActiveListings({seller: wallet}); //get active listings from an address
      const allListings = await marketContract.getActiveListings(); //get all listings, this includes listings sold. This is used to find bids by logged in wallet address
      const bidsListings = [];
      const myBids = [];
      const bids = [];
      const listingsForBids = [];
  
      if(allListings.length > 0) {
        allListings.forEach((alistings,i) => {
            if(alistings.type === 1){
              bidsListings.push(alistings); //push auction based listings to an array
            }
          }
        )};
   
        if(bidsListings != null){
          for (i = 0; i < bidsListings.length; i++) {
           const offers = await marketContract.getOffers(bidsListings[i].id); //get offers for the listing from thirdweb sdk
            myBids.push(offers)  
          };
        }
  
      for (i = 0; i < myBids.length; i++) {
        for(p = 0; p < myBids[i].length; p++){
          if((myBids[i][p].buyerAddress).toLowerCase() === wallet.toLowerCase()){
            bids.push(myBids[i][p]);
            const bidList = await marketContract.getListing(myBids[i][p].listingId); //get the listing connected to the specific offer
            listingsForBids.push(bidList);
          }
        }
      }

      res.render('pages/goerli-myListings', {
        session: req.session,
        nfts,
        NFTs,
        rarity: null,
        pageKey,
        pages,
        current: page,
        sumatt: null,
        summary: null,
        fp: null,
        refresh:null,
        contract:null,
        listings,
        contractM,
        pageKeysP,
        bids,
        listingsForBids,
      });
    } catch (error) {
      // console.log(error);
      res.render('pages/goerli-marketerror', {
        session: req.session,
        NFTs: null,
        nfts: null,
        pageKey: null,
        pages: null,
        current: null,
        sumatt:null,
        summary:null,
        fp:null,
        refresh:null,
        contract:null,
        listings:null,
        contractM:null,
        pageKeysP:null,
        bids:null,
        listingsForBids:null,
      });
    }
  }
);

// goerli Page to view a listings details from marketgm page
party.app.get('/goerli-listingDetails/:contract/:IDToken', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'],{ redirect: "/login" }), async (req, res, next) => {
  // console.log('fetching NFTs');
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }

  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }

  var contract = req.params.contract;
  var IDToken = req.params.IDToken;
  const baseURL = `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTMetadata`; // alchemy api
  const fetchURL =`${baseURL}?contractAddress=${contract}&tokenId=${IDToken}&refreshCache=false`; //fetchURL for NFT alchemy api
  const gMarkectContract = '0xC65CE759f006928451343874538A328dFcbAD325'; //goerli marketplace contract. Deploy from thirdweb dashboard.
  const marketContract = await gsdk.getContract(gMarkectContract, "marketplace"); //get marketplace contract thirdweb sdk
  const wrapper = NATIVE_TOKENS; //from thirdweb sdk. fetchs all networks and associated wrapped tokens. This allow for offers to be made
  const royaltyURL = `https://testnet-api.rarible.org/v0.1/items/ETHEREUM:${contract}:${IDToken}/royalties` //rarible api to fetch royalties

  try {
    const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) => data.json()); //get listings with alchemy api
    const listings = await marketContract.getActiveListings({tokenContract: contract, tokenId: IDToken}); //get listing from the contract thirdweb sdk
    const offers = await marketContract.getOffers(listings[0].id); //get offers for the listing from thirdweb sdk
    const royalties = await fetch(royaltyURL, {method: 'GET'}).then((data) => data.json()); //get creator royalties for specific listing

    res.render('pages/goerli-listingDetails', {
      session: req.session,
      nfts,
      NFTs:null,
      contract,
      listings,
      IDToken,
      nft:null,
      wrapper,
      offers,
      royalties,
    });
  } catch (error) {
    //console.log(error);
    res.render('pages/goerli-marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pages: null,
      current: null,
      summary:null,
      fp:null,
      sumatt: null,
      pageKey: null,
      contract:null,
      listings:null,
      contractM:null,
      IDToken:null,
      pageKeysM:null,
      nft:null,
      wrapper:null,
      offers:null,
      royalties:null,
    });
  }
});

// goerli My Auctions to Close Page
party.app.get('/goerli-auctions', party.protect(['zerb', 'guest', 'tinydinos', 'freshfrogsNFT'],{ redirect: "/login" }), async (req, res, next) => {
  if(req.session.zerb != undefined){
    var wallet = `${req.session.zerb.account}`;
  }

  if(req.session.guest != undefined){
    var wallet = `${req.session.guest.account}`;
  }

  if(req.session.tinydinos != undefined){
    var wallet = `${req.session.tinydinos.account}`;
  }

  if(req.session.freshfrogsNFT != undefined){
    var wallet = `${req.session.freshfrogsNFT.account}`; 
  }

  const baseURL = `https://eth-goerli.alchemyapi.io/v2/${process.env.API_KEY}/getNFTs/`;
  const pageCount = 1;
  var pageKey = '';
  const fetchURL = `${baseURL}?owner=${wallet}&pageKey=${pageKey}&pageSize=${pageCount}`;
  const gMarkectContract = '0xC65CE759f006928451343874538A328dFcbAD325'; //goerli marketplace contract. Deploy from thirdweb dashboard.
  const marketContractGoerli = await gsdk.getContract(gMarkectContract, "marketplace"); //get marketplace contract
  

  try {
    const nfts = await fetch(fetchURL, { method: 'GET' }).then((data) =>
      data.json()
    );
    
    const NFTs = nfts.ownedNfts;

    const allListingsGoerli = await marketContractGoerli.getActiveListings(); //get active listings. This is used to find bids by logged in wallet address
    const everyListingGoerli = await marketContractGoerli.getAllListings(); // get all active and inactive listing

    const bidsListingsGoerli = []; // all active auction listings
    const myBidsGoerli = [];
    const allAuctionListingsGoerli = []; //all auction listings
    const nonActiveAuctionsGoerli = []; //all non-active listings
    
    const bids = [];
    const listingsForBids = [];
    const myAuctionsToClose = []; //all my auctions to close

    if(allListingsGoerli.length > 0) {
      allListingsGoerli.forEach((alistings,i) => {
          if(alistings.type === 1){
            bidsListingsGoerli.push(alistings); //push auction based listings to an array
          }
        }
      )};
          
    if(bidsListingsGoerli != null){
      for (i = 0; i < bidsListingsGoerli.length; i++) {
      const offersGoerli = await marketContractGoerli.getOffers(bidsListingsGoerli[i].id); //get offers for the listing from thirdweb sdk
        myBidsGoerli.push(offersGoerli)  
      }
    };
      
    if(everyListingGoerli.length > 0) {
      everyListingGoerli.forEach((eListing,i) => {
          if(eListing.type === 1){
            allAuctionListingsGoerli.push(eListing); //push auction based listings to an array
          }
        }
      )};

    if(allAuctionListingsGoerli.length > 0) { 
      allAuctionListingsGoerli.forEach(el1 => {      
        el1IsPresentInArr2 = bidsListingsGoerli.some(el2 => el2.id === el1.id); 
          if (!el1IsPresentInArr2) { 
            nonActiveAuctionsGoerli.push(el1);    
          }
      }
    )};

    for (i = 0; i < myBidsGoerli.length; i++) {
      for(p = 0; p < myBidsGoerli[i].length; p++){
        if((myBidsGoerli[i][p].buyerAddress).toLowerCase() === wallet.toLowerCase()){
          bids.push(myBidsGoerli[i][p]);
          const bidList = await marketContractGoerli.getListing(myBidsGoerli[i][p].listingId); //get the listing connected to the specific offer
          listingsForBids.push(bidList);
        }
      }
    }

    if(nonActiveAuctionsGoerli.length > 0) { 
      for (i = 0; i < nonActiveAuctionsGoerli.length; i++) {
          const myWins = await marketContractGoerli.auction.getWinner(nonActiveAuctionsGoerli[i].id); //get the listing connected to the specific offer
          if(myWins.toLowerCase() === wallet.toLowerCase() || nonActiveAuctionsGoerli[i].sellerAddress.toLowerCase() === wallet.toLowerCase()){
            myAuctionsToClose.push(nonActiveAuctionsGoerli[i]);
          }      
      }
    }

    res.render('pages/goerli-auctions', {
      session: req.session,
      nfts,
      NFTs,
      rarity: null,
      pages: null,
      current: null,
      summary: null,
      fp: null,
      sumatt: null,
      pageKey:null,
      contract:null,
      listings:null,
      contractM:null,
      pageKeysP:null,
      bids,
      listingsForBids,
      myAuctionsToClose,
    });
  } catch (error) {
    // console.log(error);
    res.render('pages/goerli-marketerror', {
      session: req.session,
      NFTs: null,
      nfts: null,
      rarity: null,
      pages: null,
      current: null,
      summary:null,
      fp:null,
      sumatt: null,
      pageKey: null,
      contract:null,
      listings:null,
      contractM:null,
      pageKeysP:null,
      bids:null,
      listingsForBids:null,
      myAuctionsToClose:null,
    });
  }
});

//////////////////////////////////////////////////////
//                                                  //
//                     Port                         //
//                                                  //
//////////////////////////////////////////////////////
party.app.listen(8080); // 8080 required for deploying on digital ocean
console.log('Server is listening on port 8080');

//////////////////////////////////////////////////////
//                                                  //
//         Alchemy data Structure                   //
//                                                  //
//////////////////////////////////////////////////////

//nfts array structure
// nfts:{
//   contract: { address: '0x8fba3ebe77d3371406a77eeaf40c89c1ed55364a' },
//   id: {
//     tokenId: '0x00000000000000000000000000000000000000000000000000000000000000e2',
//     tokenMetadata: [Object]
//   },
//   balance: '1',
//   title: 'Zero Beings #226',
//   description: '2022 Zero Beings',
//   tokenUri: {
//     raw: 'ipfs://bafybeidc4mw5k3iyzfz6msc37emanpdocar2dbfwkqmz5xrh7ctcs2htyi/226.json',
//     gateway: 'https://ipfs.io/ipfs/bafybeidc4mw5k3iyzfz6msc37emanpdocar2dbfwkqmz5xrh7ctcs2htyi/226.json'
//   },
//   media: [{
//     bytes: 220522,
//     format: "png",
//     gateway: "https://res.cloudinary.com/alchemyapi/image/upload/mainnet/3e61df4989b790d9957e7095cb643cc1.png",
//     raw: "ipfs://bafybeihvhk34lgwoh42qjkvz6obyeyls3236s5gojjukw3sq6ommg2eaye/00103.png",
//     thumbnail: "https://res.cloudinary.com/alchemyapi/image/upload/w_256,h_256/mainnet/3e61df4989b790d9957e7095cb643cc1.png",
//   }],
//   metadata: {
//     name: 'Zero Beings #226',
//     description: '2022 Zero Beings',
//     image: 'ipfs://bafybeidb57yyynti3qad3zcp2h4i4xj7ycabbvn4wnmsxwor7nxmagthna/00226.png',
//     attributes: [Array]
//   },
//   timeLastUpdated: '2022-08-19T17:10:35.128Z',
//   contractMetadata: { name: 'Zero Beings', symbol: 'ZERB', tokenType: 'ERC721' }
//   },


//Collection Array Structure

// {
//   "contract": {
//     "address": "0x8fba3ebe77d3371406a77eeaf40c89c1ed55364a"
//   },
//   "id": {
//     "tokenId": "0x0000000000000000000000000000000000000000000000000000000000000003",
//     "tokenMetadata": {
//       "tokenType": "ERC721"
//     }
//   },
//   "title": "Zero Beings #3",
//   "description": "2022 Zero Beings",
//   "tokenUri": {
//     "raw": "ipfs://bafybeidp7mzzgvcnedwqjw3vw3fljdk3zyjtfwvln3gmzahucytcx4wgme/3.json",
//     "gateway": "https://alchemy.mypinata.cloud/ipfs/bafybeidp7mzzgvcnedwqjw3vw3fljdk3zyjtfwvln3gmzahucytcx4wgme/3.json"
//   },
//   "media": [
//     {
//       "raw": "ipfs://bafybeihvhk34lgwoh42qjkvz6obyeyls3236s5gojjukw3sq6ommg2eaye/00003.png",
//       "gateway": "https://nft-cdn.alchemy.com/eth-mainnet/d4b09a580a837a5332c9cc56c5648a7c",
//       "thumbnail": "https://res.cloudinary.com/alchemyapi/image/upload/thumbnail/eth-mainnet/d4b09a580a837a5332c9cc56c5648a7c",
//       "format": "png",
//       "bytes": 501379
//     }
//   ],
//   "metadata": {
//     "name": "Zero Beings #3",
//     "description": "2022 Zero Beings",
//     "image": "ipfs://bafybeihvhk34lgwoh42qjkvz6obyeyls3236s5gojjukw3sq6ommg2eaye/00003.png",
//     "attributes": [
//       {
//         "value": "Rainbow",
//         "trait_type": "The Underground"
//       },
//       {
//         "value": "Black",
//         "trait_type": "Background Space"
//       },
//       {
//         "value": "Orange",
//         "trait_type": "Zero Being"
//       },
//       {
//         "value": "Purple",
//         "trait_type": "Goggles"
//       },
//       {
//         "value": "Kepler-1229b",
//         "trait_type": "Home Planet"
//       },
//       {
//         "value": "Atomic",
//         "trait_type": "House"
//       },
//       {
//         "value": "Two",
//         "trait_type": "Rocket Type"
//       },
//       {
//         "value": "Ludicrous",
//         "trait_type": "Mode"
//       },
//       {
//         "value": "Rolly Polly Ace",
//         "trait_type": "Catchphrase"
//       }
//     ]
//   },
//   "timeLastUpdated": "2022-12-31T19:45:44.361Z",
//   "contractMetadata": {
//     "name": "Zero Beings",
//     "symbol": "ZERB",
//     "tokenType": "ERC721",
//     "openSea": {
//       "floorPrice": 0.009,
//       "collectionName": "Zero Beings",
//       "safelistRequestStatus": "not_requested",
//       "imageUrl": "https://i.seadn.io/gcs/files/e223850b2d8848137a1ac957563d8cf2.gif?w=500&auto=format",
//       "description": "Phase 2 :: Series 2 (2022) | cc0 NFT collection | The Zero Beings are coming! Zero Beings work hard at having fun, doing good research, bringing utility, and public good to their community. Which being are you?",
//       "externalUrl": "https://www.zerobeings.xyz/",
//       "twitterUsername": "Zero_beings",
//       "discordUrl": "https://discord.gg/dWm4mw9Wkx",
//       "lastIngestedAt": "2022-12-28T11:38:46.000Z"
//     }
//   }
// },

// Alchemy individual nft data
// {
//   contract: { address: '0x9870da00643aea2be9df89d87efed0a2fdb5479e' },
//   id: { tokenId: '12', tokenMetadata: { tokenType: 'ERC721' } },
//   title: '',
//   description: '',
//   tokenUri: {
//     raw: 'ipfs://bafkreibdk5xsank2j7lzzds7ga57ncvthbadncmzuayaphievinu6bk3i4',
//     gateway: 'https://alchemy.mypinata.cloud/ipfs/bafkreibdk5xsank2j7lzzds7ga57ncvthbadncmzuayaphievinu6bk3i4'
//   },
//   media: [
//     {
//       raw: 'ipfs://bafybeifq7rj3ekf3obkocj2n55pjrfoe3i276cycmasfwvsyrvw544kgra',
//       gateway: 'https://nft-cdn.alchemy.com/eth-goerli/db1e8bbd8b6875d72134906ede1bbd98',
//       thumbnail: 'https://res.cloudinary.com/alchemyapi/image/upload/thumbnail/eth-goerli/db1e8bbd8b6875d72134906ede1bbd98',
//       format: 'png',
//       bytes: 381104
//     }
//   ],
//   metadata: {
//     image: 'ipfs://bafybeifq7rj3ekf3obkocj2n55pjrfoe3i276cycmasfwvsyrvw544kgra'
//   },
//   timeLastUpdated: '2023-01-16T18:56:08.048Z',
//   contractMetadata: {
//     name: 'Test_Warp',
//     symbol: 'Twarp',
//     tokenType: 'ERC721',
//     openSea: { lastIngestedAt: '2023-01-21T14:37:29.000Z' }
//   }
// }

//////////////////////////////////////////////////////
//                                                  //
//         Thirdweb data structure                  //
//                                                  //
//////////////////////////////////////////////////////

//[
// {
//   assetContractAddress: '0x9870Da00643AeA2BE9dF89d87efeD0A2fdb5479e',
//   buyoutPrice: BigNumber { _hex: '0x2386f26fc10000', _isBigNumber: true },
//   currencyContractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
//   buyoutCurrencyValuePerToken: {
//     name: 'Görli Ether',
//     symbol: 'GOR',
//     decimals: 18,
//     value: [BigNumber],
//     displayValue: '0.01'
//   },
//   id: '3',
//   tokenId: BigNumber { _hex: '0x0c', _isBigNumber: true },
//   quantity: BigNumber { _hex: '0x01', _isBigNumber: true },
//   startTimeInSeconds: BigNumber { _hex: '0x63a76964', _isBigNumber: true },
//   asset: {
//     image: 'https://gateway.ipfscdn.io/ipfs/bafybeifq7rj3ekf3obkocj2n55pjrfoe3i276cycmasfwvsyrvw544kgra',
//     id: '12',
//     uri: 'ipfs://bafkreibdk5xsank2j7lzzds7ga57ncvthbadncmzuayaphievinu6bk3i4'
//   },
//   secondsUntilEnd: BigNumber { _hex: '0x63b0a3e4', _isBigNumber: true },
//   sellerAddress: '0xbCdbe666a43437333CcC375C1E33461E260B57E6',
//   type: 0 // this represents the listing type 0=direct and 1=auction
// },
//]

// Thirweb auction listings data structure
// [
//   {
//     assetContractAddress: '0x9870Da00643AeA2BE9dF89d87efeD0A2fdb5479e',
//     buyoutPrice: BigNumber { _hex: '0x6a94d74f430000', _isBigNumber: true },
//     currencyContractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
//     buyoutCurrencyValuePerToken: {
//       name: 'Görli Ether',
//       symbol: 'GOR',
//       decimals: 18,
//       value: [BigNumber],
//       displayValue: '0.03'
//     },
//     id: '8',
//     tokenId: BigNumber { _hex: '0x01', _isBigNumber: true },
//     quantity: BigNumber { _hex: '0x01', _isBigNumber: true },
//     startTimeInEpochSeconds: BigNumber { _hex: '0x63b9e530', _isBigNumber: true },
//     asset: {
//       image: 'https://gateway.ipfscdn.io/ipfs/bafybeifq7rj3ekf3obkocj2n55pjrfoe3i276cycmasfwvsyrvw544kgra',
//       id: '1',
//       uri: 'ipfs://bafkreibdk5xsank2j7lzzds7ga57ncvthbadncmzuayaphievinu6bk3i4'
//     },
//     reservePriceCurrencyValuePerToken: {
//       name: 'Görli Ether',
//       symbol: 'GOR',
//       decimals: 18,
//       value: [BigNumber],
//       displayValue: '0.0'
//     },
//     reservePrice: BigNumber { _hex: '0x00', _isBigNumber: true },
//     endTimeInEpochSeconds: BigNumber { _hex: '0x63c31fb0', _isBigNumber: true },
//     sellerAddress: '0xbCdbe666a43437333CcC375C1E33461E260B57E6',
//     type: 1
//   }
// ]

// {
//   '1': {
//     name: 'Ether',
//     symbol: 'ETH',
//     decimals: 18,
//     wrapped: {
//       address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
//       name: 'Wrapped Ether',
//       symbol: 'WETH'
//     }
//   },
//   '5': {
//     name: 'Görli Ether',
//     symbol: 'GOR',
//     decimals: 18,
//     wrapped: {
//       address: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
//       name: 'Wrapped Ether',
//       symbol: 'WETH'
//     }
//   },
//   '10': {
//     name: 'Ether',
//     symbol: 'ETH',
//     decimals: 18,
//     wrapped: {
//       address: '0x4200000000000000000000000000000000000006',
//       name: 'Wrapped Ether',
//       symbol: 'WETH'
//     }
//   },
//   '56': {
//     name: 'Binance Chain Native Token',
//     symbol: 'BNB',
//     decimals: 18,
//     wrapped: {
//       address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
//       name: 'Wrapped Binance Chain Token',
//       symbol: 'WBNB'
//     }
//   },
//   '97': {
//     name: 'Binance Chain Native Token',
//     symbol: 'TBNB',
//     decimals: 18,
//     wrapped: {
//       address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
//       name: 'Wrapped Binance Chain Testnet Token',
//       symbol: 'WBNB'
//     }
//   },
//   '137': {
//     name: 'Matic',
//     symbol: 'MATIC',
//     decimals: 18,
//     wrapped: {
//       address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
//       name: 'Wrapped Matic',
//       symbol: 'WMATIC'
//     }
//   },
//   '250': {
//     name: 'Fantom',
//     symbol: 'FTM',
//     decimals: 18,
//     wrapped: {
//       address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
//       name: 'Wrapped Fantom',
//       symbol: 'WFTM'
//     }
//   },
//   '420': {
//     name: 'Goerli Ether',
//     symbol: 'ETH',
//     decimals: 18,
//     wrapped: {
//       address: '0x4200000000000000000000000000000000000006',
//       name: 'Wrapped Ether',
//       symbol: 'WETH'
//     }
//   },
//   '4002': {
//     name: 'Fantom',
//     symbol: 'FTM',
//     decimals: 18,
//     wrapped: {
//       address: '0xf1277d1Ed8AD466beddF92ef448A132661956621',
//       name: 'Wrapped Fantom',
//       symbol: 'WFTM'
//     }
//   },
//   '31337': {
//     name: 'Ether',
//     symbol: 'ETH',
//     decimals: 18,
//     wrapped: {
//       address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
//       name: 'Wrapped Ether',
//       symbol: 'WETH'
//     }
//   },
//   '42161': {
//     name: 'Ether',
//     symbol: 'ETH',
//     decimals: 18,
//     wrapped: {
//       address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
//       name: 'Wrapped Ether',
//       symbol: 'WETH'
//     }
//   },
//   '43113': {
//     name: 'Avalanche',
//     symbol: 'AVAX',
//     decimals: 18,
//     wrapped: {
//       address: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
//       name: 'Wrapped AVAX',
//       symbol: 'WAVAX'
//     }
//   },
//   '43114': {
//     name: 'Avalanche',
//     symbol: 'AVAX',
//     decimals: 18,
//     wrapped: {
//       address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
//       name: 'Wrapped AVAX',
//       symbol: 'WAVAX'
//     }
//   },
//   '80001': {
//     name: 'Matic',
//     symbol: 'MATIC',
//     decimals: 18,
//     wrapped: {
//       address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
//       name: 'Wrapped Matic',
//       symbol: 'WMATIC'
//     }
//   },
//   '421613': {
//     name: 'Arbitrum Goerli Ether',
//     symbol: 'AGOR',
//     decimals: 18,
//     wrapped: {
//       address: '0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3',
//       name: 'Wrapped Ether',
//       symbol: 'WETH'
//     }
//   }
// }

// Thirdweb offers

// [
//   {
//     quantity: undefined,
//     pricePerToken: BigNumber { _hex: '0x038d7ea4c68000', _isBigNumber: true },
//     currencyContractAddress: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
//     buyerAddress: '0xbCdbe666a43437333CcC375C1E33461E260B57E6',
//     quantityDesired: BigNumber { _hex: '0x01', _isBigNumber: true },
//     currencyValue: {
//       name: 'Wrapped Ether',
//       symbol: 'WETH',
//       decimals: 18,
//       value: [BigNumber],
//       displayValue: '0.001'
//     },
//     listingId: BigNumber { _hex: '0x05', _isBigNumber: true }
//   }
// ]

//////////////////////////////////////////////////////
//                                                  //
//         Rarible data structure                   //
//                                                  //
//////////////////////////////////////////////////////


// Rarible API https://multichain-api.rarible.org/testnet/tag/item-controller#operation/getItemRoyaltiesById
// {
//   royalties: [
//     {
//       account: 'ETHEREUM:0xbcdbe666a43437333ccc375c1e33461e260b57e6',
//       value: 500
//     }
//   ]
// }
