
var openbtn = document.querySelector("#openbtn");
var closebtn = document.querySelector("#closebtn");
var openbtnM = document.querySelector("#openbtnM");
var closebtnM = document.querySelector("#closebtnM");

if(openbtn){
  openbtn.addEventListener("click", async() => {
      document.querySelector("#mySidepanel").classList.remove("panel-width-0");
      document.querySelector("#mySidepanel").classList.add("panel-width-250");
    });
}

if(closebtn){
  closebtn.addEventListener("click", async() => {
    document.querySelector("#mySidepanel").classList.remove("panel-width-250");
    document.querySelector("#mySidepanel").classList.add("panel-width-0");
  }); 
}

if(openbtnM){
openbtnM.addEventListener("click", async() => {
  document.querySelector("#mySidepanelM").classList.remove("panel-width-0");
  document.querySelector("#mySidepanelM").classList.add("panel-width-250");
});
}

if(closebtnM){
  closebtnM.addEventListener("click", async() => {
    document.querySelector("#mySidepanelM").classList.remove("panel-width-250");
    document.querySelector("#mySidepanelM").classList.add("panel-width-0");
  }); 
}
