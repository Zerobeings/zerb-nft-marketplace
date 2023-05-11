//
//
//adapted from Skogard's skinnerbox https://github.com/factoria-org/skinnerbox2
//
//
"use strict";
createlistinginput.addEventListener("click", async () => { 
    let c = await fetch("/json/sbox.json").then((r) => {
      return r.json()
    })

    let abi = await fetch("/json/marketplace.json").then((r) => {
        return r.json()
    })

    let nftjson = await fetch("/json/approveNFT.json").then((r) => {
        return r.json()
    })

    try {
            let {web3, marketplaceContract, selectedAccount} = await connect(c)
            
            let net = await web3.eth.getChainId()
        if(net != 11155111){
            document.getElementById("marketInfo").classList.add('hidden');
            document.querySelector(".error").innerHTML = 'Please connect to Sepolia network';
            location.reload();
            
        } else {
            document.getElementById("chooseListing").classList.remove('hidden');
            const marketplace = new web3.eth.Contract(abi, marketplaceContract);
            const createlistingform = document.getElementById('listingForm');
            
            
            createlistingform.addEventListener("submit", async (e) => {
                if (net === 11155111){
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

                    if (checkApproval === true && net === 11155111){
                        // if NFT collection already approved, approves the creation of the listing on the marketplace
                                try {
                                    //for direct listings
                                    if (typeID === "0" && net === 11155111) {

                                        //Get the current gas price
                                        const gasprice = await web3.eth.getGasPrice();
                                        var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                                        console.log(`Current Gas Price x 1.2: ${gas_price}`)

                                        //Estimate gas for the transaction
                                        const estimatedGas = await marketplace.methods.createListing(listingParams).estimateGas({from: `${selectedAccount}`});
                                        var estimated_Gas = Math.round(estimatedGas * 1.2);
                                        console.log(`Estimated Gas Required x 1.2: ${estimated_Gas}`)
                                        
                                        //Build Transaction
                                        const rawTransaction = {
                                            from: `${selectedAccount}`,
                                            gasPrice: web3.utils.toHex(gas_price),
                                            gas: web3.utils.toHex(estimated_Gas),
                                            nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                                        };
                                        

                                        const tx = await marketplace.methods.createListing(listingParams).send(rawTransaction);
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
                                    if(typeID === "1" && net === 11155111){
                                       //Get the current gas price
                                       const gasprice = await web3.eth.getGasPrice();
                                       var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                                       console.log(`Current Gas Price x 1.2: ${gas_price}`);

                                       //Estimate gas for the transaction
                                       const estimatedGas = await marketplace.methods.createListing(listingParams).estimateGas({from: `${selectedAccount}`});
                                       var estimated_Gas = Math.round(estimatedGas * 1.2);
                                       console.log(`Estimated Gas Required x 1.2: ${estimated_Gas}`)
                                       
                                       //Build Transaction
                                       const rawTransaction = {
                                           from: `${selectedAccount}`,
                                           gasPrice: web3.utils.toHex(gas_price),
                                           gas: web3.utils.toHex(estimated_Gas),
                                           nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                                       };
                                       

                                       const tx = await marketplace.methods.createListing(listingParams).send(rawTransaction);
                                        document.getElementById("chooseListing").classList.add('hidden')
                                        document.getElementById("marketInfo").classList.add('hidden')
                                        document.getElementById("listingForm").classList.add('hidden')
                                        document.querySelector(".error").innerHTML = "Success! Reload Page to View New Auction Listing"
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
                        const gasprice = await web3.eth.getGasPrice();
                        var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                        console.log(`Current Gas Price x 1.2: ${gas_price}`);

                        //estimate gas for approval
                        const estimateGasApproval = await NFTcontract.methods.setApprovalForAll(marketplaceContract, true).estimateGas({from: `${selectedAccount}`});
                        var estimate_GasApproval = Math.round(estimateGasApproval * 1.2); // estimatation based on transaction
                        console.log(`Estimated Gas Required x 1.2: ${estimate_GasApproval}`)

                        //Build Transaction
                        const approveTxn = {
                            from: `${selectedAccount}`,
                            gas:web3.utils.toHex(estimate_GasApproval),
                            gasPrice:web3.utils.toHex(gas_price),
                            nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                        };

                        // approve the NFT for sale
                        const txNftApprove = await NFTcontract.methods.setApprovalForAll(marketplaceContract, true).send(approveTxn);
                                try {
                                    //for direct listings
                                    if (typeID === "0" && net === 11155111) {
                                        //Get the current gas price
                                        const gasprice = await web3.eth.getGasPrice();
                                        var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                                        console.log(`Current Gas Price x 1.2: ${gas_price}`)

                                        //Estimate gas for the transaction
                                        const estimatedGas = await marketplace.methods.createListing(listingParams).estimateGas({from: `${selectedAccount}`});
                                        var estimated_Gas = Math.round(estimatedGas * 1.2);
                                        console.log(`Estimated Gas Required x 1.2: ${estimated_Gas}`)
                                        
                                        //Build Transaction
                                        const rawTransaction = {
                                            from: `${selectedAccount}`,
                                            gasPrice: web3.utils.toHex(gas_price),
                                            gas: web3.utils.toHex(estimated_Gas),
                                            nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                                        };
                                        

                                        const tx = await marketplace.methods.createListing(listingParams).send(rawTransaction);
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
                                    if(typeID === "1" && net === 11155111){
                                        //Get the current gas price
                                        const gasprice = await web3.eth.getGasPrice();
                                        var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                                        console.log(`Current Gas Price x 1.2: ${gas_price}`)

                                        //Estimate gas for the transaction
                                        const estimatedGas = await marketplace.methods.createListing(listingParams).estimateGas({from: `${selectedAccount}`});
                                        var estimated_Gas = Math.round(estimatedGas * 1.2);
                                        console.log(`Estimated Gas Required x 1.2: ${estimated_Gas}`)
                                        
                                        //Build Transaction
                                        const rawTransaction = {
                                            from: `${selectedAccount}`,
                                            gasPrice: web3.utils.toHex(gas_price),
                                            gas: web3.utils.toHex(estimated_Gas),
                                            nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                                        };
                                        

                                        const tx = await marketplace.methods.createListing(listingParams).send(rawTransaction);
                                        document.getElementById("chooseListing").classList.add('hidden')
                                        document.getElementById("marketInfo").classList.add('hidden')
                                        document.getElementById("listingForm").classList.add('hidden')
                                        document.querySelector(".error").innerHTML = "Success! Reload Page to View New Auction Listing"
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
                } else {
                    document.getElementById("marketInfo").classList.add('hidden');
                    document.querySelector(".error").innerHTML = 'Please connect to Sepolia network';
                    location.reload();
                }

                })
            }
        } catch (e) {
            document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
            document.getElementById("marketInfo").classList.add('hidden')
            document.getElementById("chooseListing").classList.add('hidden')
            document.getElementById("listingForm").classList.add('hidden')
            document.getElementById("createlistinginput").innerHTML = "Connect"
            document.getElementById("overlay").style.display = "none";
          }
    })

