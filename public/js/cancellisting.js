//
//
//adapted from Skogard's skinnerbox https://github.com/factoria-org/skinnerbox2
//
//
"use strict";
async function canceldListing(listID, listingType, addressClose){ 
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
            document.getElementById("overlay").style.display = "block";
            document.getElementById("chooseListing").classList.add('hidden')
            document.querySelector(".error").innerHTML = "Awaiting Transaction"

            try {
                if(listingType === "0"){
                    const marketplace = new web3.eth.Contract(abi, marketplaceContract);
                    const tx = await marketplace.methods.cancelDirectListing(listID).send({from: `${selectedAccount}`});
                    document.getElementById("overlay").style.display = "none";
                    document.querySelector(".error").innerHTML = "Direct Listing Cancelled";
                    return tx;
                }

                if(listingType === "1"){

                    const marketplace = new web3.eth.Contract(abi, marketplaceContract);
                    const tx = await marketplace.methods.closeAuction(listID,addressClose).send({from: `${selectedAccount}`});
                    document.getElementById("overlay").style.display = "none";
                    document.querySelector(".error").innerHTML = "Auction Closed";
                    return tx;
                }
            } catch (e) {
                document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
                document.getElementById("overlay").style.display = "none";
            }
        
        } catch (e) {
            document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
            document.getElementById("overlay").style.display = "none";
        }

};
