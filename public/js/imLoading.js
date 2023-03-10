function onLoading() {
  const stopLoading = setTimeout(stopLoader, 5000);
  document.getElementById("overlay").style.display = "block";
  document.getElementById("mySidepanelM").style.width = "0";
  return true;
  function stopLoader(){
    document.getElementById("overlay").style.display = "none";
    formsearch = document.getElementById("searchForm");
    formsearch.reset();
  }
}

function onLoading2() {
  document.getElementById("overlay").style.display = "block";
  return true;
}

function onLoading3() {
  document.getElementById("overlay").style.display = "block";
  return true;
  }

function onLoading4() {
  const stopLoading = setTimeout(stopLoader, 5000);
  document.getElementById("overlay").style.display = "block";
  document.getElementById("mySidepanelM").style.width = "0";
  return true;
  function stopLoader(){
    document.getElementById("overlay").style.display = "none";
  }
}
