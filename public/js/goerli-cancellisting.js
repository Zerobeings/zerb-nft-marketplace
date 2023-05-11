//
//
//adapted from Skogard's skinnerbox https://github.com/factoria-org/skinnerbox2
//
//
"use strict";

var canceldirectlistingBtn = document.querySelectorAll("#canceldirectlisting");
var closeAuctionBtn = document.querySelectorAll("#closeAuction");

if(canceldirectlistingBtn){
    for (var i = 0; i < canceldirectlistingBtn.length; i++){
        let index = i;
        canceldirectlistingBtn[i].addEventListener("click", async () => {
            var listID = document.getElementById("directListingId"+index).innerHTML;
            var listingType = "0";
            var addressClose = document.getElementById("assetContractAddress"+index).innerHTML;
            canceldListing(listID, listingType, addressClose);
          });
    }
}

if(closeAuctionBtn){
    for (var i = 0; i < closeAuctionBtn.length; i++){
        let index = i;
        closeAuctionBtn[i].addEventListener("click", async () => {
            var listID = document.getElementById("auctionListingId"+index).innerHTML;
            var listingType = "1";
            var addressClose = document.getElementById("addressClose"+index).innerHTML;
            canceldListing(listID, listingType, addressClose);
          });
    }
}

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

                try {
                    if(listingType === "0" && net === 5){
                        const marketplace = new web3.eth.Contract(abi, marketplaceContract);
                        
                        //Get the current gas price
                        const gasprice = await web3.eth.getGasPrice();
                        var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                        console.log(`Current Gas Price x 1.2: ${gas_price}`);

                        //estimate gas for transaction
                        const estimatedGas = await marketplace.methods.cancelDirectListing(listID).estimateGas({from: `${selectedAccount}`});
                        var estimated_Gas = Math.round(estimatedGas * 1.2); // estimatation based on transaction
                        console.log(`Estimated Gas Required x 1.2: ${estimated_Gas}`);

                        //build transaction
                        const rawTransaction = {
                            from: `${selectedAccount}`,
                            gasPrice: web3.utils.toHex(gas_price),
                            gas: web3.utils.toHex(estimated_Gas),
                            nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                        };

                        const tx = await marketplace.methods.cancelDirectListing(listID).send(rawTransaction);
                        document.getElementById("overlay").style.display = "none";
                        document.querySelector(".error").innerHTML = "Direct Listing Cancelled";
                        return tx;
                    }

                    if(listingType === "1" && net === 5){
                        const marketplace = new web3.eth.Contract(abi, marketplaceContract);

                        //Get the current gas price
                        const gasprice = await web3.eth.getGasPrice();
                        var gas_price = Math.round(gasprice * 1.2); // speed up by 1.2 times
                        console.log(`Current Gas Price x 1.2: ${gas_price}`)

                        //estimate gas for transaction
                        const estimatedGas = await marketplace.methods.closeAuction(listID,addressClose).estimateGas({from: `${selectedAccount}`});
                        var estimated_Gas = Math.round(estimatedGas * 1.2); // estimatation based on transaction
                        console.log(`Estimated Gas Required x 1.2: ${estimated_Gas}`);

                        //build transaction
                        const rawTransaction = {
                            from: `${selectedAccount}`,
                            gasPrice: web3.utils.toHex(gas_price),
                            gas: web3.utils.toHex(estimated_Gas),
                            nonce: web3.utils.toHex(web3.eth.getTransactionCount(`${selectedAccount}`))
                        };

                        const tx = await marketplace.methods.closeAuction(listID,addressClose).send(rawTransaction);
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
