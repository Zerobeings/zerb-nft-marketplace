
gloaderbtn = document.querySelectorAll("#genericLoader");
gloaderbtnM = document.querySelectorAll("#genericLoaderM");
footertLoaderbtn = document.querySelector("#footerLoader");
acceptButton = document.querySelectorAll("#acceptButton");
placeBidBtn = document.querySelector("#placeBid");
paginationBtn = document.querySelectorAll("#paginationBtn");
CreateListingBtn = document.querySelector("#CreateListing");
addressBtn = document.querySelector("#address");
preferencesbtn = document.querySelector("#termly-consent-preferences");

if(preferencesbtn){
  preferencesbtn.addEventListener("click", async() => {
    window.displayPreferenceModal();
    return false;
  });
}

if (addressBtn){
  addressBtn.addEventListener("click", async() => {
    location.href='/login';
  });
}

// originally onLoading()
if (footertLoaderbtn){
  footertLoaderbtn.addEventListener("click", async()=>{ 
    const stopLoading = setTimeout(stopLoader, 5000);
    document.getElementById("overlay").style.display = "block";
    document.querySelector("#mySidepanel").classList.remove("panel-width-250");
    document.querySelector("#mySidepanel").classList.add("panel-width-0");
    return true;
    function stopLoader(){
      document.getElementById("overlay").style.display = "none";
      formsearch = document.getElementById("searchForm");
      formsearch.reset();
    }
  });
}

if (paginationBtn){
  for (var i = 0; i < paginationBtn.length ; i++) { 
    paginationBtn[i].addEventListener("click", async()=>{ 
      const stopLoading = setTimeout(stopLoader, 5000);
      document.getElementById("overlay").style.display = "block";
      return true;
      function stopLoader(){
        document.getElementById("overlay").style.display = "none";
      }
    },
    false);
  }
  }

//originall onLoading2()
if(CreateListingBtn){
  CreateListingBtn.addEventListener("click", async() =>{
    document.getElementById("overlay").style.display = "block";
    return true;
  }, false
  );
}

//originally onLoading3()
if(acceptButton){
for (var i = 0; i < acceptButton.length ; i++) { 
  acceptButton[i].addEventListener("click", async()=>{
    document.getElementById("overlay").style.display = "block";
    return true;
},
false);
}
}

if(placeBidBtn){
placeBidBtn.addEventListener("click", async()=>{
  document.getElementById("overlay").style.display = "block";
  return true;
});
}

//originally onLoading4()
if(gloaderbtnM){
for (var i = 0; i < gloaderbtnM.length ; i++) { 
    gloaderbtnM[i].addEventListener("click", async()=>{
      const stopLoading = setTimeout(stopLoader, 5000);
      document.getElementById("overlay").style.display = "block";
      document.querySelector("#mySidepanelM").classList.remove("panel-width-250");
      document.querySelector("#mySidepanelM").classList.add("panel-width-0");
      return true;
      function stopLoader(){
      document.getElementById("overlay").style.display = "none";
      }
    },
    false);
}
}

//originally onLoading5()
if(gloaderbtn){
for (var i = 0; i < gloaderbtn.length ; i++) { 
  gloaderbtn[i].addEventListener("click", async()=>{
    const stopLoading = setTimeout(stopLoader, 5000);
    document.getElementById("overlay").style.display = "block";
    document.querySelector("#mySidepanel").classList.remove("panel-width-250");
    document.querySelector("#mySidepanel").classList.add("panel-width-0");
    return true;
    function stopLoader(){
      document.getElementById("overlay").style.display = "none";
    }
  },
  false);
}
}