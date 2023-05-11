"use strict";
document.addEventListener("DOMContentLoaded", async () => {
    var frames = window.frames;
    for (var i = 0; i < frames.length; i++) { 
    var sounds = frames[i].document.getElementsByTagName('audio');
    var videos = frames[i].document.getElementsByTagName('video');
    for(j=0; j<sounds.length; j++){
      sounds[j].pause();
      videos[j].pause();
      }
    } 
  });