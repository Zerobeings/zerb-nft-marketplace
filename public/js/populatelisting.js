
localStorage.clear();
localStorage.setItem('toList', 'none');
localStorage.setItem('listType', 'none');
const checkScreen = window.matchMedia('(max-width: 1000px)');
var populateListingBtn = document.querySelectorAll("#populateListing");

if(populateListingBtn){
    for (var i = 0; i < populateListingBtn.length; i++){
        let index = i;
        populateListingBtn[i].addEventListener("click", async () => {
            nca = document.getElementById("NFTContractAddr"+index).innerHTML;
            idt = document.getElementById("NFTtokenID"+index).innerHTML;
            sls = "selectedListing"+index;
            populateListing(nca, idt, sls);
        })
    }
}

function populateListing(nca, idt, sls){
    document.getElementById('NFTContractAddress').value = nca;
    document.getElementById('NFTTokenID').value = idt;
    
    var toList = localStorage.getItem('toList');

    if (toList === "none") {
      localStorage.setItem('toList',sls);
      document.getElementById(sls).classList.add('borderSelectedListing');
    } else {
      document.getElementById(toList).classList.remove('borderSelectedListing');
      document.getElementById(sls).classList.add('borderSelectedListing');
      localStorage.setItem('toList',sls);
    }

      if(checkScreen.matches){
        smoothScroll(document.getElementById('market1'));
      }
    
  }