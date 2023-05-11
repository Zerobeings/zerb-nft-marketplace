
    var nftSelectionBtn = document.querySelectorAll("#nftSelectionBtn");
   
    if(nftSelectionBtn){
        for (var i = 0; i < nftSelectionBtn.length; i++){
            let index = i;
            nftSelectionBtn[i].addEventListener("click", async () => {
                var mediaData = document.getElementById("nftMediaGateway"+index).innerHTML;
                var catchphraseData = document.getElementById("nftCatchphraseBtn"+index).innerHTML;
                var idData = document.getElementById("id" + index).innerHTML;
                selectNFTp(mediaData,catchphraseData);
                selectNFT(idData);
            });
        } 
        
    }

    //Select NFts
    function selectNFTp(proImage, catchPhrase){
        let img = document.querySelector("#profileImg");
        let modImg = document.querySelector("#modImg");
        let modPhrase = document.querySelector("#modPhrase");
        img.setAttribute('src', proImage);
        modImg.setAttribute('src', proImage);
        modPhrase.innerHTML = catchPhrase;
    }

    // Get the modal
    var modal = document.getElementById("myModal");
    
    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        document.querySelector("#nftMaze").classList.remove("hidden")
        modal.style.display = "block";
        initGame();
    }
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
        smoothScroll(document.getElementById('canvasDiv'))
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        smoothScroll(document.getElementById('canvasDiv'))
        }
    }
    
    
    //Smooth Scroll
    window.smoothScroll = function(target) {
        var scrollContainer = target;
        do { //find scroll container
            scrollContainer = scrollContainer.parentNode;
            if (!scrollContainer) return;
            scrollContainer.scrollTop += 1;
        } while (scrollContainer.scrollTop == 0);
        
        var targetY = 0;
        do { //find the top of target relatively to the container
            if (target == scrollContainer) break;
            targetY += target.offsetTop;
        } while (target = target.offsetParent);
        
        scroll = function(c, a, b, i) {
            i++; if (i > 30) return;
            c.scrollTop = a + (b - a) / 30 * i;
            setTimeout(function(){ scroll(c, a, b, i); }, 20);
        }
        // start scrolling
        scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
    }
    
    document.getElementById('up').addEventListener('click', () => {
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'w'}));
    });
    
    document.getElementById('left').addEventListener('click', () => {
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'a'}));
    });
    
    document.getElementById('right').addEventListener('click', () => {
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'd'}));
    });
    
    document.getElementById('down').addEventListener('click', () => {
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': 's'}));
    });
