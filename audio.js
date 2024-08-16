const audio1 = new Audio('/assets/buildShip.wav');
const audio2 = new Audio('/assets/cancel.wav');
const audio3 = new Audio('/assets/complete.wav');
const audio4 = new Audio('/assets/unitredy.wav');

const audios = [audio1, audio2, audio3, audio4];

const volumeUpButton = document.getElementById('volume-up');
const volumeDownButton = document.getElementById('volume-down');

volumeUpButton.addEventListener('click', function() {
    // Increase the volume for each audio object
    audios.forEach(audio => {
        audio.volume = Math.min(1, audio.volume + .1);
        console.log(audio.volume);
    });
    console.log('Volume up button clicked');
    
});

volumeDownButton.addEventListener('click', function() {
    // Decrease the volume for each audio object
    audios.forEach(audio => {
        audio.volume = Math.max(0, audio.volume - .1);
        console.log(audio.volume);
    });
    console.log('Volume down button clicked');
    
});
