// Adapted from Skogards Skinnerbox connect script

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
  
  console.log("Market gm initialized")
  document.getElementById("createlistinginput").innerHTML = selectedAccount
  document.getElementById("marketInfo").classList.add('hidden')
  return { web3, marketplaceContract, selectedAccount }
}