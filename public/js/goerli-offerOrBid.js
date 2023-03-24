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
        let c = await fetch("/json/gbox.json").then((r) => {
        return r.json()
        })

        let abi = await fetch("/json/marketplace.json").then((r) => {
            return r.json()
        })

        //goerli WETH
        let gWETH = await fetch("/json/goerli-weth.json").then((r) => {
            return r.json()
        })

        try {
                let {web3, marketplaceContract, selectedAccount} = await connect(c)
                let net = await web3.eth.getChainId()

            if (net != 5) {
                document.getElementById('offer').classList.add('hidden');
                document.getElementById('offer').style.display = 'none';
                document.getElementById('buyButton').classList.add('hidden')
                document.getElementById('buyButton').style.display = 'none';
                document.querySelector(".error").innerHTML = 'Please connect to Goerli network';
                document.getElementById("overlay").style.display = "none";
                location.reload();
            } else {
                let spendApproved = false;

                document.getElementById('offer').classList.remove('hidden')
                document.getElementById('offer').style.display = 'inline';
                document.getElementById('buyButton').classList.remove('hidden')
                document.getElementById('buyButton').style.display = 'inline';

                const marketplace = new web3.eth.Contract(abi, marketplaceContract);

                const gasprice = await web3.eth.getGasPrice();
                var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times

                if(buyitnow != null && buyListing !=null && buyAtAmount !=null && net === 5){
                    buyitnow.addEventListener("click", async (e) => { 
                        document.getElementById("overlay").style.display = "block";
                        document.querySelector(".error").innerHTML = "Awaiting Buy/Buyout Transaction"

                        var listingID = buyListing;
                        var buyAmount = buyAtAmount;
                        var finalPrice = web3.utils.toHex(buyAmount);
                        const NATIVE_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
                        var _quantityWanted = "1";
                        var _expirationTimestamp = Math.round(timeExpiry).toString();

                    
                        if (listingType === "0" && net === 5){
                            try {
                                document.querySelector(".error").innerHTML = "Initiating Direct Listing Buy Transaction";
                                //estimate gas for transaction
                                const etimateGas = await marketplace.methods.buy(listingID,`${selectedAccount}`,_quantityWanted,NATIVE_TOKEN_ADDRESS,buyAmount).estimateGas({from: `${selectedAccount}`, value:finalPrice});
                                var etimate_Gas = Math.round(etimateGas * 1.2); // estimatation based on transaction

                                const buyTx = await marketplace.methods.buy(listingID,`${selectedAccount}`,_quantityWanted,NATIVE_TOKEN_ADDRESS,buyAmount).send({from:`${selectedAccount}`, value:finalPrice, gas:web3.utils.toHex(etimate_Gas), gasPrice:web3.utils.toHex(gas_price)});
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
                        } else if (listingType === "1" && net === 5) {
                            try {
                                document.querySelector(".error").innerHTML = "Initiating Auction Buyout Transaction";
                                //estimate gas for transaction
                                const etimateGas = await marketplace.methods.offer(listingID, _quantityWanted, NATIVE_TOKEN_ADDRESS, buyAmount, _expirationTimestamp).estimateGas({from: `${selectedAccount}`, value:finalPrice});
                                var etimate_Gas = Math.round(etimateGas * 1.2); // estimatation based on transaction

                                const buyTx = await marketplace.methods.offer(listingID, _quantityWanted, NATIVE_TOKEN_ADDRESS, buyAmount, _expirationTimestamp).send({from:`${selectedAccount}`, value:finalPrice, gas:web3.utils.toHex(etimate_Gas), gasPrice:web3.utils.toHex(gas_price)});
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
                            document.querySelector(".error").innerHTML = 'Please connect to Goerli network';
                            document.getElementById("overlay").style.display = "none";
                            location.reload();
                        }
                    });
                } else {
                    document.getElementById('offer').classList.add('hidden');
                    document.getElementById('offer').style.display = 'none';
                    document.getElementById('buyButton').classList.add('hidden')
                    document.getElementById('buyButton').style.display = 'none';
                    document.querySelector(".error").innerHTML = 'Please connect to Goerli network';
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
                        

                    if(listingType === "0" && net === 5) {    
                        try {
                            const g_WETH_contract = new web3.eth.Contract(gWETH, WETH);
                            //check if wallet has laready approved the spend limit
                            var checkSpendLimit = await g_WETH_contract.methods.allowance(`${selectedAccount}`, marketplaceContract).call({from:`${selectedAccount}`});
                            const wethBalance = await g_WETH_contract.methods.balanceOf(`${selectedAccount}`).call({from:`${selectedAccount}`});
                            console.log("Your WETH Balance",wethBalance)
                            console.log("Your Spend Limit", checkSpendLimit)
                            console.log("Your Offer", pricePerToken)

                            if(checkSpendLimit >= pricePerToken && wethBalance >= pricePerToken){
                                try {
                                    //estimate gas for transaction
                                    const etimateGas = await marketplace.methods.offer(listID, _quantityWanted, WETH, pricePerToken, _expirationTimestamp).estimateGas({from: `${selectedAccount}`});
                                    var etimate_Gas = Math.round(etimateGas * 1.2); // estimatation based on transaction

                                    const tx = await marketplace.methods.offer(listID, _quantityWanted, WETH, pricePerToken, _expirationTimestamp).send({from:`${selectedAccount}`, gas:web3.utils.toHex(etimate_Gas), gasPrice:web3.utils.toHex(gas_price)});
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
                                //estimate gas for transaction
                                    
                                const etimateGasApprove = await g_WETH_contract.methods.approve(marketplaceContract, pricePerToken).estimateGas({from: `${selectedAccount}`});
                                var etimate_GasApprove = Math.round(etimateGasApprove * 1.2); // estimatation based on transaction

                                const txApprove = await g_WETH_contract.methods.approve(marketplaceContract, pricePerToken).send({from:`${selectedAccount}`, gas:web3.utils.toHex(etimate_GasApprove), gasPrice:web3.utils.toHex(gas_price)});
                                let spendApproved = true; // set spend approval to true
                                var checkSpendLimit = await g_WETH_contract.methods.allowance(`${selectedAccount}`, marketplaceContract).call({from:`${selectedAccount}`});
                                console.log("Your New Spend Limit", checkSpendLimit)
                                document.getElementById('offer').classList.add('hidden');
                                document.getElementById('offer').style.display = 'none';
                                document.getElementById('buyButton').classList.add('hidden')
                                document.getElementById('buyButton').style.display = 'none';
                                document.querySelector(".error").innerHTML = "Approved WETH Spend Limit";

                                if(spendApproved === true && net === 5){
                                    // second transaction approves the offer to be made.
                                    try {
                                        //estimate gas for transaction
                                        const etimateGas = await marketplace.methods.offer(listID, _quantityWanted, WETH, pricePerToken, _expirationTimestamp).estimateGas({from: `${selectedAccount}`});
                                        var etimate_Gas = Math.round(etimateGas * 1.2); // estimatation based on transaction

                                        const tx = await marketplace.methods.offer(listID, _quantityWanted, WETH, pricePerToken, _expirationTimestamp).send({from:`${selectedAccount}`, gas:web3.utils.toHex(etimate_Gas), gasPrice:web3.utils.toHex(gas_price)});
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
                    } else if (listingType === "1" && net === 5) {

                        try {
                            const NATIVE_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
                            //estimate gas for transaction
                            const etimateGas = await marketplace.methods.offer(listID, _quantityWanted, NATIVE_TOKEN_ADDRESS, pricePerToken, _expirationTimestamp).estimateGas({from: `${selectedAccount}`, value:valuetokenPrice});
                            var etimate_Gas = Math.round(etimateGas * 1.2); // estimatation based on transaction

                            const tx = await marketplace.methods.offer(listID, _quantityWanted, NATIVE_TOKEN_ADDRESS, pricePerToken, _expirationTimestamp).send({from:`${selectedAccount}`, value:valuetokenPrice, gas:web3.utils.toHex(etimate_Gas), gasPrice:web3.utils.toHex(gas_price)});
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

        