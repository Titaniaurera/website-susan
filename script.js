document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const happyBirthdayContainer = document.querySelector(".happy-birthday-container");
  const redirectButton = document.querySelector(".button");
  const birthdayAudio = document.getElementById('birthdayAudio');
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;

  // Play the birthday audio after interaction
  function playBirthdayAudio() {
    birthdayAudio.play();
  }

  // Function to update the candle count
  function updateCandleCount() {
    const activeCandles = candles.filter(candle => !candle.classList.contains("out")).length;
    candleCountDisplay.textContent = activeCandles;
  }

  // Function to add a candle on the cake
  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
    
    // Play audio when candle is added
    playBirthdayAudio();
  }

  // Event listener for adding candles on the cake when clicking
  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  // Function to check if the user is blowing on the microphone
  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 40; // Adjust the threshold for detecting blowing
  }

  // Function to simulate blowing out candles
  function blowOutCandles() {
    let blownOut = 0;

    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.3) { // Lowered randomness to increase likelihood of extinguishing
          candle.classList.add("out");
          blownOut++;
        }
      });
    }

    if (blownOut > 0) {
      updateCandleCount();
    }

    checkAllCandlesBlownOut();
  }

  // Function to check if all candles are blown out and trigger celebration
  function checkAllCandlesBlownOut() {
    const activeCandles = candles.filter(candle => !candle.classList.contains('out')).length;
    if (activeCandles === 0) {
      showCelebration();
    }
  }

  // Function to show the celebration (Happy Birthday text only)
  function showCelebration() {
    happyBirthdayContainer.classList.add('show');
  }

  // Microphone access and audio analysis setup
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200); // Adjust the interval if needed
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }

  // Redirect to 2.html when the button is clicked
  redirectButton.addEventListener("click", function () {
    window.location.href = "2.html";
  });
});
