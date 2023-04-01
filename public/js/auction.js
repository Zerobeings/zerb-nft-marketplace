//
//
//adapted from Skogard's skinnerbox https://github.com/factoria-org/skinnerbox2
//
//
"use strict";
const connect = async (config) => {
    localStorage.removeItem('walletconnect')
    localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE')
    document.querySelector(".error").innerHTML = ''
    
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const selectedAccount = accounts[0];
    const marketplaceContract = config.contract;
    
    console.log("Close Auction Initialized")
    document.getElementById("createlistinginput").innerHTML = selectedAccount
    return { web3, marketplaceContract, selectedAccount }
  }