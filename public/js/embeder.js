
var embedBtn = document.querySelectorAll("#embedBtn")

if(embedBtn){
    for (var i = 0; i < embedBtn.length; i++){
      let index = i;
      embedBtn[i].addEventListener("click", async () => {
          code = document.getElementById("embeded"+index).innerHTML;
          embed(code, index);
        });
  
        embedBtn[i].addEventListener("mouseout", async() =>{
            copyNoticeEmbed(index)
        });
    }
  }


function embed(code, i) { 
    navigator.clipboard.writeText(code);
    var copyCode = document.getElementById("embedWeb"+i);
    copyCode.innerHTML = "Copied iframe code for your website"
  }
  
  function copyNoticeEmbed(i){
    var copyAddy = document.getElementById("embedWeb"+i);
    copyAddy.innerHTML = "Copy iframe code";
  }