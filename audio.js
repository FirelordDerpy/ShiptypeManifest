window.completeAudio = new Audio('/assets/complete.wav');
window.completeAudio.volume = 0.5;

window.bldaudio = new Audio('/assets/buildShip.wav');
window.bldaudio.volume = 0.5;

window.cancelAudio = new Audio('/assets/cancel.wav');
window.cancelAudio.volume = 0.5;

window.deliverAudio = new Audio('/assets/unitredy.wav');
window.deliverAudio.volume = 0.5;

window.beepslct = new Audio('/assets/beepslct.wav');
window.beepslct.volume = 0.5;

window.bleep11 = new Audio('/assets/bleep11.wav');
window.bleep11.volume = 0.5;

window.bleep12 = new Audio('/assets/bleep12.wav');
window.bleep12.volume = 0.5;

window.bleep13 = new Audio('/assets/bleep13.wav');
window.bleep13.volume = 0.5;

window.bleep17 = new Audio('/assets/bleep17.wav');
window.bleep17.volume = 0.5;

window.bleep6 = new Audio('/assets/bleep6.wav');
window.bleep6.volume = 0.5;

window.bleep9 = new Audio('/assets/bleep9.wav');
window.bleep9.volume = 0.5;

window.eaffirm1 = new Audio('/assets/eaffirm1.wav');
window.eaffirm1.volume = 0.5;

window.eengin1 = new Audio('/assets/eengin1.wav');
window.eengin1.volume = 0.5;

window.fixit1 = new Audio('/assets/fixit1.wav');
window.fixit1.volume = 0.5;

window.keystrok = new Audio('/assets/keystrok.wav');
window.keystrok.volume = 0.5;

window.newtarg1 = new Audio('/assets/newtarg1.wav');
window.newtarg1.volume = 0.5;

window.scoldy1 = new Audio('/assets/scoldy1.wav');
window.scoldy1.volume = 0.5;

window.sonpulse = new Audio('/assets/sonpulse.wav');
window.sonpulse.volume = 0.5;

window.unitredy = new Audio('/assets/unitredy.wav');
window.unitredy.volume = 0.5;

window.nocash1 = new Audio('/assets/nocash1.wav');
window.unitredy.volume = 0.5;

const audios = [
    window.completeAudio, 
    window.bldaudio, 
    window.cancelAudio, 
    window.deliverAudio,
    window.beepslct,
    window.bleep11,
    window.bleep12,
    window.bleep13,
    window.bleep17,
    window.bleep6,
    window.bleep9,
    window.eaffirm1,
    window.eengin1,
    window.fixit1,
    window.keystrok,
    window.newtarg1,
    window.scoldy1,
    window.sonpulse,
    window.unitredy,
    window.nocash1
];


const volumeSlider = document.getElementById('volume-slider');

// Load the volume level from localStorage if it exists, otherwise set to 1
const savedVolume = localStorage.getItem('volume');
volumeSlider.value = savedVolume !== null ? savedVolume : 1;

volumeSlider.addEventListener('input', function() {
    const volume = this.value;
    audios.forEach(audio => {
        audio.volume = volume;
    });
    // Save the volume level to localStorage
    localStorage.setItem('volume', volume);
});

    // <input type="range" min="0" max="1" step="0.01" id="volume-slider">