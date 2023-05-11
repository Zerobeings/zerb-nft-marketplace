//adapted from https://www.w3schools.com/howto/howto_js_slideshow.asp

document.addEventListener("DOMContentLoaded", async() => {

  let slideIndex = 1;
  showSlides1(slideIndex);
  showSlides2(slideIndex);
  showSlides3(slideIndex);
  showSlides4(slideIndex);
  
  var plusSlides1Btn = document.querySelector("#plusSlides1Minus");
  var plusSlides1BtnPlus = document.querySelector("#plusSlides1Plus");
  var plusSlides2Btn = document.querySelector("#plusSlides2Minus");
  var plusSlides2BtnPlus = document.querySelector("#plusSlides2Plus");
  var plusSlides3Btn = document.querySelector("#plusSlides3Minus");
  var plusSlides3BtnPlus = document.querySelector("#plusSlides3Plus");
  var plusSlides4Btn = document.querySelector("#plusSlides4Minus");
  var plusSlides4BtnPlus = document.querySelector("#plusSlides4Plus");
  // Next/previous controls

  plusSlides1Btn.addEventListener("click", async() => {
    let n = -1;
    showSlides1(slideIndex += n);
  });
  
  plusSlides1BtnPlus.addEventListener("click", async() => {
    let n = 1;
    showSlides1(slideIndex += n);
  });

  plusSlides2Btn.addEventListener("click", async() => {
    let n = -1;
    showSlides2(slideIndex += n);
  });
  
  plusSlides2BtnPlus.addEventListener("click", async() => {
    let n = 1;
    showSlides2(slideIndex += n);
  });

  plusSlides3Btn.addEventListener("click", async() => {
    let n = -1;
    showSlides3(slideIndex += n);
  });
  
  plusSlides3BtnPlus.addEventListener("click", async() => {
    let n = 1;
    showSlides3(slideIndex += n);
  });

  plusSlides4Btn.addEventListener("click", async() => {
    let n = -1;
    showSlides4(slideIndex += n);
  });
  
  plusSlides4BtnPlus.addEventListener("click", async() => {
    let n = 1;
    showSlides4(slideIndex += n);
  });
  
  // Thumbnail image controls
  function currentSlide1(n) {
    showSlides1(slideIndex = n);
  }
  function currentSlide2(n) {
      showSlides2(slideIndex = n);
  }
  function currentSlide3(n) {
  showSlides3(slideIndex = n);
  }
  function currentSlide4(n) {
  showSlides4(slideIndex = n);
    }
  
  function showSlides1(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides1");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
  }
  
  function showSlides2(n) {
      let i;
      let slides = document.getElementsByClassName("mySlides2");
      if (n > slides.length) {slideIndex = 1}
      if (n < 1) {slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slides[slideIndex-1].style.display = "block";
    }
  
    function showSlides3(n) {
      let i;
      let slides = document.getElementsByClassName("mySlides3");
      if (n > slides.length) {slideIndex = 1}
      if (n < 1) {slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slides[slideIndex-1].style.display = "block";
    }
  
    function showSlides4(n) {
      let i;
      let slides = document.getElementsByClassName("mySlides4");
      if (n > slides.length) {slideIndex = 1}
      if (n < 1) {slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slides[slideIndex-1].style.display = "block";
    }

  })