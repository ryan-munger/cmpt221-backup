// detects spacebar press and calls nav functoin
document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        // console.log('Space pressed')
        navigateSite(0, "home");
    }
})

// detects if a mobile/tablet user clicks with 2 fingers
document.addEventListener('touchstart', function (e) {
    if (e.touches.length == 2) {
        // console.log('Two Finger Press');
        navigateSite(0, "home");
    }
});


// credit: this code was adapted from W3 schools
function fadeInAndOut() {
    const element = document.getElementById('elementToFade');
  
    if (element.style.opacity === '0' || element.style.opacity === '') {
      element.style.opacity = '1';
    } else {
      element.style.opacity = '0';
    }
  }
  
// Call the fadeInAndOut function at regular intervals (e.g., every 2 seconds)
setInterval(fadeInAndOut, 1000);