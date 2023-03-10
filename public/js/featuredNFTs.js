//source https://www.w3schools.com/howto/howto_js_slideshow.asp

let slideIndex = 1;
showSlides1(slideIndex);
showSlides2(slideIndex);
showSlides3(slideIndex);
showSlides4(slideIndex);

// Next/previous controls
function plusSlides1(n) {
  showSlides1(slideIndex += n);
}
function plusSlides2(n) {
    showSlides2(slideIndex += n);
}
function plusSlides3(n) {
showSlides3(slideIndex += n);
}
function plusSlides4(n) {
showSlides4(slideIndex += n);
}

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