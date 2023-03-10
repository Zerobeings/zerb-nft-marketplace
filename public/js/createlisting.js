//
//
//adapted from Skogard's skinnerbox https://github.com/factoria-org/skinnerbox2
//
//
"use strict";
createlistinginput.addEventListener("click", async () => { 
    let c = await fetch("/json/mbox.json").then((r) => {
      return r.json()
    })

    let abi = await fetch("/json/mainnet-marketplace.json").then((r) => {
        return r.json()
    })

    let nftjson = await fetch("/json/approveNFT.json").then((r) => {
        return r.json()
    })

    try {
            let {web3, marketplaceContract, selectedAccount} = await connect(c)
            
            let net = await web3.eth.getChainId()
            let n = {
                1: "",
                4: "rinkeby.",
                5: "goerli."
            }
            let netPrefix = n[net]
            let etherscan = `https://${netPrefix}etherscan.io/address/${c.contract}#code`

            const marketplace = new web3.eth.Contract(abi, marketplaceContract);
            const createlistingform = document.getElementById('listingForm');
            
            createlistingform.addEventListener("submit", async (e) => {
                e.preventDefault(); //prevent default submission behavior
                const data = new FormData(e.target);
                var date = new Date();
                var startSeconds = date.getTime() / 1000;

                var typeID = data.get('typeForm'); // check which listing type has been selected
                var NFTContractAddress = data.get('NFTContractAddressForm'); // the NFT to be listed contract address
                var NFTTokenID = data.get('NFTTokenIDForm'); // the ID of the token
                var SalePrice = (data.get('SalePriceForm') * 1e18).toString(); //buyout price. Must convert from eth to wei
                var SaleDuration = "604800"; //direct our auction are set to 7 days
                var ReservePrice = (data.get('ReservePriceForm') * 1e18).toString() || '10000000000000000'; //reserve price for auctions, if no price is set than 0.01 eth will be default. must pass in wei
                var timeStarter = Math.round(startSeconds).toString();
                const NATIVE_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

                const listingParams = [
                    NFTContractAddress, // assetContract
                    NFTTokenID, // tokenId
                    timeStarter, // startTime
                    SaleDuration, // secondsUntilEndTime
                    "1", // quantityToList. Marketplace designed for sale of 1 token at a time.
                    NATIVE_TOKEN_ADDRESS, // currencyToAccept
                    ReservePrice, // reservePricePerToken
                    SalePrice, // buyoutPricePerToken
                    typeID, // listingType
                ];
                // first transaction approves marketplace contract access to the NFT
                const NFTcontract = new web3.eth.Contract(nftjson, NFTContractAddress);
                const checkApproval = await NFTcontract.methods.isApprovedForAll(`${selectedAccount}`, marketplaceContract).call({from:`${selectedAccount}`});

                if (checkApproval === true){
                    //if nft approval already given create listing
                            try {
                                //for direct listings
                                if (typeID === "0") {
                                    const tx = await marketplace.methods.createListing(listingParams).send({from: `${selectedAccount}`});
                                    document.getElementById("chooseListing").classList.add('hidden')
                                    document.getElementById("marketInfo").classList.add('hidden')
                                    document.getElementById("listingForm").classList.add('hidden')
                                    document.querySelector(".error").innerHTML = "Success! Reload Page to View New Listing"
                                    document.getElementById("createlistinginput").innerHTML = "Connect"
                                    createlistingform.reset();
                                    document.getElementById("overlay").style.display = "none";
                                    return tx;
                                }

                                // for auction listings  
                                if(typeID === "1"){
                                    const tx = await marketplace.methods.createListing(listingParams).send({from: `${selectedAccount}`});
                                    document.getElementById("chooseListing").classList.add('hidden')
                                    document.getElementById("marketInfo").classList.add('hidden')
                                    document.getElementById("listingForm").classList.add('hidden')
                                    document.querySelector(".error").innerHTML = "Success! Reload Page to View New Listing"
                                    document.getElementById("createlistinginput").innerHTML = "Connect"
                                    createlistingform.reset();
                                    document.getElementById("overlay").style.display = "none";
                                    return tx;
                                    }

                            } catch (e) {
                                document.getElementById("chooseListing").classList.add('hidden')
                                document.getElementById("marketInfo").classList.add('hidden')
                                document.getElementById("listingForm").classList.add('hidden')
                                document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
                                document.getElementById("createlistinginput").innerHTML = "Connect"
                                createlistingform.reset();
                                document.getElementById("overlay").style.display = "none";
                            }
                        
                } else { 
                    // approvese the marketplace to access the NFT collection in your wallet, and then creates the lisitng
                    const txNftApprove = await NFTcontract.methods.setApprovalForAll(marketplaceContract, true).send({from: `${selectedAccount}`}); // approve the NFT for sale
                            try {
                                //for direct listings
                                if (typeID === "0") {
                                    const tx = await marketplace.methods.createListing(listingParams).send({from: `${selectedAccount}`});
                                    document.getElementById("chooseListing").classList.add('hidden')
                                    document.getElementById("marketInfo").classList.add('hidden')
                                    document.getElementById("listingForm").classList.add('hidden')
                                    document.querySelector(".error").innerHTML = "Success! Reload Page to View New Listing"
                                    document.getElementById("createlistinginput").innerHTML = "Connect"
                                    createlistingform.reset();
                                    document.getElementById("overlay").style.display = "none";
                                    return [tx, txNftApprove];
                                }

                                // for auction listings  
                                if(typeID === "1"){
                                    const tx = await marketplace.methods.createListing(listingParams).send({from: `${selectedAccount}`});
                                    document.getElementById("chooseListing").classList.add('hidden')
                                    document.getElementById("marketInfo").classList.add('hidden')
                                    document.getElementById("listingForm").classList.add('hidden')
                                    document.querySelector(".error").innerHTML = "Success! Reload Page to View New Listing"
                                    document.getElementById("createlistinginput").innerHTML = "Connect"
                                    createlistingform.reset();
                                    document.getElementById("overlay").style.display = "none";
                                    return [tx, txNftApprove];
                                    }

                            } catch (e) {
                                document.getElementById("chooseListing").classList.add('hidden')
                                document.getElementById("marketInfo").classList.add('hidden')
                                document.getElementById("listingForm").classList.add('hidden')
                                document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
                                document.getElementById("createlistinginput").innerHTML = "Connect"
                                createlistingform.reset();
                                document.getElementById("overlay").style.display = "none";
                            }
                        }
            })
        } catch (e) {
            document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
            document.getElementById("marketInfo").classList.add('hidden')
            document.getElementById("chooseListing").classList.add('hidden')
            document.getElementById("listingForm").classList.add('hidden')
            document.getElementById("createlistinginput").innerHTML = "Connect"
            createlistingform.reset();
            document.getElementById("overlay").style.display = "none";
          }
    })

