"use strict;"

var copyTokenBtn = document.querySelectorAll("#copyToken");
var copyContractBtn = document.querySelectorAll("#copyContract");

if(copyTokenBtn){
  for (var i = 0; i < copyTokenBtn.length; i++){
    let index = i;
    copyTokenBtn[i].addEventListener("click", async () => {
        tokenid = document.getElementById("NFTtokenID"+index).innerHTML;
        copyToken(tokenid, index);
      });

      copyTokenBtn[i].addEventListener("mouseout", async() =>{
        copyNoticeToken(index)
      });
  }
}

if(copyContractBtn){
  for (var i = 0; i < copyContractBtn.length; i++){
    let index = i;
    copyContractBtn[i].addEventListener("click", async () => {
        address = document.getElementById("NFTContractAddr"+index).innerHTML;
        copyAddr(address, index);
      });

      copyContractBtn[i].addEventListener("mouseout", async() =>{
        copyNoticeCon(index)
      });
  }
}

function copyAddr(address, i) { 
  navigator.clipboard.writeText(address);
  var copyAddy = document.getElementById("myTooltipContract"+i);
  copyAddy.innerHTML = "Copied"
}

function copyToken(tokenid, i) { 
  navigator.clipboard.writeText(tokenid);
  var copyAddy = document.getElementById("myTooltipToken"+i);
  copyAddy.innerHTML = "Copied"
}

function copyNoticeToken(i){
  var copyAddy = document.getElementById("myTooltipToken"+i);
  copyAddy.innerHTML = "Copy Token";
}

function copyNoticeCon(i){
  var copyAddy = document.getElementById("myTooltipContract"+i);
  copyAddy.innerHTML = "Copy Contract";
}