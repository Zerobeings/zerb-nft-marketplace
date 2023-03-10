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
    
    let n = {
      rinkeby: "rinkeby",
      main: 'eip155:1', //"mainnet",
      goerli: 'eip155:5' //"goerli"
    }
  
    const projectId = config.projectId;
  
    const web3Modal = new Web3Modal.default({
      projectId: projectId,
      standaloneChains: [n[config.network]],
    });
  
    let provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const selectedAccount = accounts[0];
    const marketplaceContract = config.contract;
    
    console.log("i want that! initialized")
    document.getElementById("getit").innerHTML = selectedAccount
    return { web3, marketplaceContract, selectedAccount }
  }