//
//
//adapted from Skogard's skinnerbox https://github.com/factoria-org/skinnerbox2
//
//
"use strict";
const acceptAnOffer = document.getElementById('accpetForm');

if(acceptAnOffer != null){
    getit.addEventListener("click", async () => { 
        let c = await fetch("/json/mbox.json").then((r) => {
        return r.json()
        })

        let abi = await fetch("/json/mainnet-marketplace.json").then((r) => {
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
                document.getElementById('readOnlyList').classList.add('hidden')
                document.getElementById('acceptOffersList').classList.remove('hidden')
                
                const marketplace = new web3.eth.Contract(abi, marketplaceContract);
                //var buyerAddress = document.getElementById('buyerAddress').innerHTML;
                var olistingId = document.getElementById('theListingID').innerHTML;
                var date = new Date();
                var todayInSeconds = date.getTime() / 1000;
                const _offers = document.getElementById('offersAll').innerHTML;
                const offers = JSON.parse(_offers);
                
                //primary cheeck for expired offerings
                let readOffers = []

                for (let i=0; i < offers.length; i++){
                    const rOffers = await marketplace.methods.offers(olistingId, offers[i].buyerAddress).call({from:`${selectedAccount}`});
                    const count = readOffers.push(rOffers);

                }; 

                // update accept buttons
                console.log('Checking Expiry dates')
                for (let i =0; i< readOffers.length; i++){
                    if (readOffers[i].expirationTimestamp < todayInSeconds){
                        document.getElementById(offers[i].buyerAddress).innerHTML = "Expired";
                        document.getElementById("accept"+offers[i].buyerAddress).style.display = "none";
                    }
                };

                   

                acceptAnOffer.addEventListener("submit", async(e) => { 
                    e.preventDefault();

                    var date = new Date();
                    var todayInSeconds = date.getTime() / 1000;

                    const data = new FormData(e.target);

                    var listingId = data.get('offerListingID');
                    var offeror = data.get('offerBuyerAddress');
                    var currency = data.get('offerCurrencyContractAddress');
                    var pricePerToken = data.get('offerPriceperToken');

                    const gasprice = await web3.eth.getGasPrice();
                    var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                  
                    try {
                        //secondary check if the offer has expired
                        const readOffers = await marketplace.methods.offers(listingId, offeror).call({from:`${selectedAccount}`});

                        if (readOffers.expirationTimestamp > todayInSeconds) {    
                            //estimate gas for transaction
                            const etimateGas = await marketplace.methods.acceptOffer(listingId, offeror, currency, pricePerToken).estimateGas({from: `${selectedAccount}`});
                            var etimate_Gas = Math.round(etimateGas * 1.2); // estimatation based on transaction
                            //transaction to accept
                            const txAccept = await marketplace.methods.acceptOffer(listingId, offeror, currency, pricePerToken).send({from: `${selectedAccount}`, gas:web3.utils.toHex(etimate_Gas), gasPrice:web3.utils.toHex(gas_price)});
                            document.querySelector(".error").innerHTML = "Offer Accepted!"
                            document.getElementById('acceptOffersList').classList.add('hidden')
                            document.getElementById("overlay").style.display = "none";
                            return txAccept;
                        } else {
                            document.querySelector(".error").innerHTML = "This Offer Has Expired"
                            document.getElementById('acceptOffersList').classList.add('hidden')
                            document.getElementById('readOnlyList').classList.remove('hidden')
                            document.getElementById("overlay").style.display = "none";
                        }

                    } catch (e) {
                        document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
                        document.getElementById('acceptOffersList').classList.add('hidden')
                        document.getElementById('readOnlyList').classList.remove('hidden')
                        document.getElementById("overlay").style.display = "none";
                    }

                });
        
            } catch (e) {
                document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
                document.getElementById('acceptOffersList').classList.add('hidden')
                document.getElementById('readOnlyList').classList.remove('hidden')
                document.getElementById("overlay").style.display = "none";
            }


    });

}