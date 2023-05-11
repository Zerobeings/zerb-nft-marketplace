//
//
//adapted from Skogard's skinnerbox https://github.com/factoria-org/skinnerbox2
//
//
"use strict";
const makeOffer = document.getElementById('offer');
const buyitnow = document.getElementById('buyButton');
const buyListing = document.getElementById('theListingID').innerHTML;
const buyAtAmount = document.getElementById('buybuybuy').innerHTML;
const timeExpiry = document.getElementById('referenceTime').innerHTML;
const listingType = document.getElementById('listingType').innerHTML;

if(makeOffer != null){
    getit.addEventListener("click", async () => { //add connection to creat listing button
        let c = await fetch("/json/sbox.json").then((r) => {
        return r.json()
        })

        let abi = await fetch("/json/marketplace.json").then((r) => {
            return r.json()
        })

        //Sepolia WETH
        let sepWeth = await fetch("/json/sepolia-weth.json").then((r) => {
            return r.json()
        })

        try {
                let {web3, marketplaceContract, selectedAccount} = await connect(c)
                let net = await web3.eth.getChainId()

            if (net != 11155111) {
                document.getElementById('offer').classList.add('hidden');
                document.getElementById('offer').style.display = 'none';
                document.getElementById('buyButton').classList.add('hidden')
                document.getElementById('buyButton').style.display = 'none';
                document.querySelector(".error").innerHTML = 'Please connect to Sepolia network';
                document.getElementById("overlay").style.display = "none";
                location.reload();
            } else {
                let spendApproved = false;

                document.getElementById('offer').classList.remove('hidden')
                document.getElementById('offer').style.display = 'inline';
                document.getElementById('buyButton').classList.remove('hidden')
                document.getElementById('buyButton').style.display = 'inline';

                const marketplace = new web3.eth.Contract(abi, marketplaceContract);

                if(buyitnow != null && buyListing !=null && buyAtAmount !=null && net === 11155111){
                    buyitnow.addEventListener("click", async (e) => { 
                        document.getElementById("overlay").style.display = "block";
                        document.querySelector(".error").innerHTML = "Awaiting Buy/Buyout Transaction"

                        var listingID = buyListing;
                        var buyAmount = buyAtAmount;
                        var finalPrice = web3.utils.toHex(buyAmount);
                        const NATIVE_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
                        var _quantityWanted = "1";
                        var _expirationTimestamp = Math.round(timeExpiry).toString();

                    
                        if (listingType === "0" && net === 11155111){
                            try {
                                document.querySelector(".error").innerHTML = "Initiating Direct Listing Buy Transaction";
                                 //Get the current gas price
                                 const gasprice = await web3.eth.getGasPrice();
                                 var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                                 console.log(`Current Gas Price x 1.2: ${gas_price}`);

                                //estimate gas for transaction
                                const estimatedGas = await marketplace.methods.buy(listingID,`${selectedAccount}`,_quantityWanted,NATIVE_TOKEN_ADDRESS,buyAmount).estimateGas({from: `${selectedAccount}`, value:finalPrice});
                                var estimated_Gas = Math.round(estimatedGas * 1.2); // estimatation based on transaction
                                console.log(`Estimated Gas Required x 1.2: ${estimated_Gas}`)

                                //build the transaciton
                                const rawTransaction = {
                                    from: `${selectedAccount}`,
                                    gasPrice: web3.utils.toHex(gas_price),
                                    gas: web3.utils.toHex(estimated_Gas),
                                    value: finalPrice,
                                    nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                                };

                                const buyTx = await marketplace.methods.buy(listingID,`${selectedAccount}`,_quantityWanted,NATIVE_TOKEN_ADDRESS,buyAmount).send(rawTransaction);
                                document.getElementById('offer').classList.add('hidden');
                                document.getElementById('offer').style.display = 'none';
                                document.getElementById('buyButton').classList.add('hidden')
                                document.getElementById('buyButton').style.display = 'none';
                                document.querySelector(".error").innerHTML = "Congrats! NFT purchased!"
                                document.getElementById("overlay").style.display = "none";
                                return buyTx;
                            } catch (e) {
                                document.getElementById('offer').classList.add('hidden');
                                document.getElementById('offer').style.display = 'none';
                                document.getElementById('buyButton').classList.add('hidden')
                                document.getElementById('buyButton').style.display = 'none';
                                document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
                                document.getElementById("overlay").style.display = "none";
                            }
                        } else if (listingType === "1" && net === 11155111) {
                            try {
                                document.querySelector(".error").innerHTML = "Initiating Auction Buyout Transaction";

                                //Get the current gas price
                                const gasprice = await web3.eth.getGasPrice();
                                var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                                console.log(`Current Gas Price x 1.2: ${gas_price}`);

                                //estimate gas for transaction
                                const estimatedGas = await marketplace.methods.offer(listingID, _quantityWanted, NATIVE_TOKEN_ADDRESS, buyAmount, _expirationTimestamp).estimateGas({from: `${selectedAccount}`, value:finalPrice});
                                var estimated_Gas = Math.round(estimatedGas * 1.2); // estimatation based on transaction
                                console.log(`Estimated Gas Required x 1.2: ${estimated_Gas}`)

                                //build the transaciton
                                const rawTransaction = {
                                    from: `${selectedAccount}`,
                                    gasPrice: web3.utils.toHex(gas_price),
                                    gas: web3.utils.toHex(estimated_Gas),
                                    value: finalPrice,
                                    nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                                };

                                const buyTx = await marketplace.methods.offer(listingID, _quantityWanted, NATIVE_TOKEN_ADDRESS, buyAmount, _expirationTimestamp).send(rawTransaction);
                                document.getElementById('offer').classList.add('hidden');
                                document.getElementById('offer').style.display = 'none';
                                document.getElementById('buyButton').classList.add('hidden')
                                document.getElementById('buyButton').style.display = 'none';
                                document.querySelector(".error").innerHTML = "Congrats! NFT purchased!"
                                document.getElementById("overlay").style.display = "none";
                                return buyTx;
                            } catch (e) {
                                document.getElementById('offer').classList.add('hidden');
                                document.getElementById('offer').style.display = 'none';
                                document.getElementById('buyButton').classList.add('hidden')
                                document.getElementById('buyButton').style.display = 'none';
                                document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
                                document.getElementById("overlay").style.display = "none";
                            }
                        } else {
                            document.getElementById('offer').classList.add('hidden');
                            document.getElementById('offer').style.display = 'none';
                            document.getElementById('buyButton').classList.add('hidden')
                            document.getElementById('buyButton').style.display = 'none';
                            document.querySelector(".error").innerHTML = 'Please connect to Sepolia network';
                            document.getElementById("overlay").style.display = "none";
                            location.reload();
                        }
                    });
                } else {
                    document.getElementById('offer').classList.add('hidden');
                    document.getElementById('offer').style.display = 'none';
                    document.getElementById('buyButton').classList.add('hidden')
                    document.getElementById('buyButton').style.display = 'none';
                    document.querySelector(".error").innerHTML = 'Please connect to Sepolia network';
                    document.getElementById("overlay").style.display = "none";
                    location.reload();
                }
            
                makeOffer.addEventListener("submit", async (e) => { 
                        e.preventDefault(); //prevent default submission behavior

                        document.getElementById("overlay").style.display = "block";
                        document.querySelector(".error").innerHTML = "Awaiting Offer/Bid Transaction"

                        const _wrapper = document.getElementById('wrapper').innerHTML;
                        const NATIVE_TOKENS = JSON.parse(_wrapper);
                        const data = new FormData(e.target);
                        var date = new Date();
                        var startSeconds = date.getTime() / 1000;
                        var listID = data.get('listingsId').toString();
                        var _quantityWanted = "1";
                        var pricePerToken = (data.get('offerForm') * 1e18).toString(); //bid price in wei
                        var valuetokenPrice = web3.utils.toHex(pricePerToken);
                        var WETH = NATIVE_TOKENS[net.toString()]['wrapped']['address'];
                        var _expirationTimestamp = Math.round(timeExpiry).toString(); //All offers last to end of sale period
                        

                    if(listingType === "0" && net === 11155111) {    
                        try {
                            const s_WETH_contract = new web3.eth.Contract(sepWeth, WETH);
                            //check if wallet has laready approved the spend limit
                            var checkSpendLimit = await s_WETH_contract.methods.allowance(`${selectedAccount}`, marketplaceContract).call({from:`${selectedAccount}`});
                            const wethBalance = await s_WETH_contract.methods.balanceOf(`${selectedAccount}`).call({from:`${selectedAccount}`});
                            console.log("Your WETH Balance",wethBalance)
                            console.log("Your Spend Limit", checkSpendLimit)
                            console.log("Your Offer", pricePerToken)

                            if(checkSpendLimit >= pricePerToken && wethBalance >= pricePerToken){
                                try {
                                    //Get the current gas price
                                    const gasprice = await web3.eth.getGasPrice();
                                    var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                                    console.log(`Current Gas Price x 1.2: ${gas_price}`);

                                    //estimate gas for transaction
                                    const estimatedGas = await marketplace.methods.offer(listID, _quantityWanted, WETH, pricePerToken, _expirationTimestamp).estimateGas({from: `${selectedAccount}`});
                                    var estimated_Gas = Math.round(estimatedGas * 1.2); // estimatation based on transaction
                                    console.log(`Estimated Gas Required x 1.2: ${estimated_Gas}`)

                                    //build the transaciton
                                    const rawTransaction = {
                                        from: `${selectedAccount}`,
                                        gasPrice: web3.utils.toHex(gas_price),
                                        gas: web3.utils.toHex(estimated_Gas),
                                        nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                                    };

                                    const tx = await marketplace.methods.offer(listID, _quantityWanted, WETH, pricePerToken, _expirationTimestamp).send(rawTransaction);
                                    document.getElementById('offer').classList.add('hidden');
                                    document.getElementById('offer').style.display = 'none';
                                    document.getElementById('buyButton').classList.add('hidden')
                                    document.getElementById('buyButton').style.display = 'none';
                                    document.querySelector(".error").innerHTML = "Offer Sent to Owner!";
                                    document.getElementById("overlay").style.display = "none";
                                    makeOffer.reset();
                                    return tx;
                                } catch (e) {
                                    document.getElementById('offer').classList.add('hidden');
                                    document.getElementById('offer').style.display = 'none';
                                    document.getElementById('buyButton').classList.add('hidden')
                                    document.getElementById('buyButton').style.display = 'none';
                                    document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
                                    document.getElementById("overlay").style.display = "none";
                                    makeOffer.reset();
                                }

                            } else {
                                //first transaction approves the spend limit for the amount a WETH
                                //Get the current gas price
                                const gasprice = await web3.eth.getGasPrice();
                                var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                                console.log(`Current Gas Price x 1.2: ${gas_price}`);

                                //estimate gas for transaction
                                const estimatedGasApprove = await s_WETH_contract.methods.approve(marketplaceContract, pricePerToken).estimateGas({from: `${selectedAccount}`});
                                var estimated_GasApprove = Math.round(estimatedGasApprove * 1.2); // estimatation based on transaction
                                console.log(`Estimated Gas Required x 1.2: ${estimated_GasApprove}`)

                                //build the transaciton
                                const approveTxn = {
                                    from: `${selectedAccount}`,
                                    gasPrice: web3.utils.toHex(gas_price),
                                    gas: web3.utils.toHex(estimated_GasApprove),
                                    nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                                };

                                const txApprove = await s_WETH_contract.methods.approve(marketplaceContract, pricePerToken).send(approveTxn);

                                let spendApproved = true; // set spend approval to true
                                var checkSpendLimit = await s_WETH_contract.methods.allowance(`${selectedAccount}`, marketplaceContract).call({from:`${selectedAccount}`});
                                console.log("Your New Spend Limit", checkSpendLimit)
                                document.getElementById('offer').classList.add('hidden');
                                document.getElementById('offer').style.display = 'none';
                                document.getElementById('buyButton').classList.add('hidden')
                                document.getElementById('buyButton').style.display = 'none';
                                document.querySelector(".error").innerHTML = "Approved WETH Spend Limit";

                                if(spendApproved === true && net === 11155111){
                                    // second transaction approves the offer to be made.
                                    try {
                                        //Get the current gas price
                                        const gasprice = await web3.eth.getGasPrice();
                                        var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                                        console.log(`Current Gas Price x 1.2: ${gas_price}`);

                                        //estimate gas for transaction
                                        const estimatedGas = await marketplace.methods.offer(listID, _quantityWanted, WETH, pricePerToken, _expirationTimestamp).estimateGas({from: `${selectedAccount}`});
                                        var estimated_Gas = Math.round(estimatedGas * 1.2); // estimatation based on transaction
                                        console.log(`Estimated Gas Required x 1.2: ${estimated_Gas}`)

                                        //build the transaction
                                        const rawTransaction = {
                                            from: `${selectedAccount}`,
                                            gasPrice: web3.utils.toHex(gas_price),
                                            gas: web3.utils.toHex(estimated_Gas),
                                            nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                                        };

                                        const tx = await marketplace.methods.offer(listID, _quantityWanted, WETH, pricePerToken, _expirationTimestamp).send(rawTransaction);
                                        document.getElementById('offer').classList.add('hidden');
                                        document.getElementById('offer').style.display = 'none';
                                        document.getElementById('buyButton').classList.add('hidden')
                                        document.getElementById('buyButton').style.display = 'none';
                                        document.querySelector(".error").innerHTML = "Offer Sent to Owner!";
                                        document.getElementById("overlay").style.display = "none";
                                        makeOffer.reset();
                                        return [tx, txApprove];
                                    } catch (e) {
                                        document.getElementById('offer').classList.add('hidden');
                                        document.getElementById('offer').style.display = 'none';
                                        document.getElementById('buyButton').classList.add('hidden')
                                        document.getElementById('buyButton').style.display = 'none';
                                        document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
                                        document.getElementById("overlay").style.display = "none";
                                        makeOffer.reset();
                                    }
                                }
                            }

                        } catch (e) {
                            document.getElementById('offer').classList.add('hidden');
                            document.getElementById('offer').style.display = 'none';
                            document.getElementById('buyButton').classList.add('hidden')
                            document.getElementById('buyButton').style.display = 'none';
                            document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
                            document.getElementById("overlay").style.display = "none";
                            makeOffer.reset();
                        }
                    } else if (listingType === "1" && net === 11155111) {

                        try {
                            const NATIVE_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

                            //Get the current gas price
                            const gasprice = await web3.eth.getGasPrice();
                            var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                            console.log(`Current Gas Price x 1.2: ${gas_price}`);

                            //estimate gas for transaction
                            const estimatedGas = await marketplace.methods.offer(listID, _quantityWanted, NATIVE_TOKEN_ADDRESS, pricePerToken, _expirationTimestamp).estimateGas({from: `${selectedAccount}`, value:valuetokenPrice});
                            var estimated_Gas = Math.round(estimatedGas * 1.2); // estimatation based on transaction
                            console.log(`Estimated Gas Required x 1.2: ${estimated_Gas}`)

                            //build transaction
                            const rawTransaction = {
                                from: `${selectedAccount}`,
                                value:valuetokenPrice,
                                gasPrice: web3.utils.toHex(gas_price),
                                gas: web3.utils.toHex(estimated_Gas),
                                nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                            };

                            const tx = await marketplace.methods.offer(listID, _quantityWanted, NATIVE_TOKEN_ADDRESS, pricePerToken, _expirationTimestamp).send(rawTransaction);
                            document.getElementById("overlay").style.display = "none";
                            document.getElementById('offer').classList.add('hidden');
                            document.getElementById('offer').style.display = 'none';
                            document.getElementById('buyButton').classList.add('hidden')
                            document.getElementById('buyButton').style.display = 'none';
                            document.querySelector(".error").innerHTML = "Bid Sent to Owner!";
                            makeOffer.reset();
                            return tx;

                        } catch (e) {
                            document.getElementById('offer').classList.add('hidden');
                            document.getElementById('offer').style.display = 'none';
                            document.getElementById('buyButton').classList.add('hidden')
                            document.getElementById('buyButton').style.display = 'none';
                            document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
                            document.getElementById("overlay").style.display = "none";
                            makeOffer.reset();
                        }
                    }
                });
            }

        } catch (e) {
            document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
            document.getElementById("overlay").style.display = "none";
        }
    });
}

        