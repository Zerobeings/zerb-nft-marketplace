//
//
//adapted from Skogard's skinnerbox https://github.com/factoria-org/skinnerbox2
//
//
"use strict";
async function canceldListing(listID, listingType, addressClose){ 
    let c = await fetch("/json/gbox.json").then((r) => {
      return r.json()
    })

    let abi = await fetch("/json/marketplace.json").then((r) => {
        return r.json()
    })

    try {
            let {web3, marketplaceContract, selectedAccount} = await connect(c)
            
            let net = await web3.eth.getChainId()
            
            if(net === 5){
                document.getElementById("overlay").style.display = "block";
                document.getElementById("chooseListing").classList.add('hidden')
                document.querySelector(".error").innerHTML = "Awaiting Transaction"
                const gasprice = await web3.eth.getGasPrice();
                var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times

                try {
                    if(listingType === "0" && net === 5){
                        const marketplace = new web3.eth.Contract(abi, marketplaceContract);
                        //estimate gas for transaction
                        const etimateGas = await marketplace.methods.cancelDirectListing(listID).estimateGas({from: `${selectedAccount}`});
                        var etimate_Gas = Math.round(etimateGas * 1.2); // estimatation based on transaction

                        const tx = await marketplace.methods.cancelDirectListing(listID).send({from: `${selectedAccount}`, gas: web3.utils.toHex(etimate_Gas), gasPrice:  web3.utils.toHex(gas_price)});
                        document.getElementById("overlay").style.display = "none";
                        document.querySelector(".error").innerHTML = "Direct Listing Cancelled";
                        return tx;
                    }

                    if(listingType === "1" && net === 5){
                        const marketplace = new web3.eth.Contract(abi, marketplaceContract);
                        //estimate gas for transaction
                        const etimateGas = await marketplace.methods.closeAuction(listID,addressClose).estimateGas({from: `${selectedAccount}`});
                        var etimate_Gas = Math.round(etimateGas * 1.2); // estimatation based on transaction

                        const tx = await marketplace.methods.closeAuction(listID,addressClose).send({from: `${selectedAccount}`, gas: web3.utils.toHex(etimate_Gas), gasPrice:  web3.utils.toHex(gas_price)});
                        document.getElementById("overlay").style.display = "none";
                        document.querySelector(".error").innerHTML = "Auction Closed";
                        return tx;
                    }
                } catch (e) {
                    document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
                    document.getElementById("overlay").style.display = "none";
                }
            } else {
                document.getElementById("marketInfo").classList.add('hidden');
                document.querySelector(".error").innerHTML = 'Please connect to Goerli network';
                location.reload();
            }
        } catch (e) {
            document.querySelector(".error").innerHTML = `${e.message.toLowerCase()}`
            document.getElementById("overlay").style.display = "none";
        }

};
