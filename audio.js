// window.audio1 = new Audio('/assets/buildShip.wav');
// window.audio2 = new Audio('/assets/cancel.wav');
// window.audio3 = new Audio('/assets/complete.wav');
// window.audio4 = new Audio('/assets/unitredy.wav');

// const audios = [window.audio1, window.audio2, window.audio3, window.audio4];



// const volumeSlider = document.getElementById('volume-slider');
// volumeSlider.addEventListener('input', function() {
//     const volume = this.value;
//     audios.forEach(audio => {
//         audio.volume = volume;
//     });
// });

// window.onload = function() {
//     volumeSlider.value = 1;
// };
    // <input type="range" min="0" max="1" step="0.01" id="volume-slider">

    window.completeAudio = new Audio('/assets/complete.wav'); completeAudio.volume = 0.5;    
    window.bldaudio = new Audio('/assets/buildShip.wav'); bldaudio.volume = 0.5;
    window.cancelAudio = new Audio('/assets/cancel.wav');cancelAudio.volume = 0.5;
    window.deliverAudio = new Audio('/assets/unitredy.wav');deliverAudio.volume = 0.5;
    