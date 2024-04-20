const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const voiceButton = document.getElementById('voice-button');
const imageUpload = document.getElementById('image-upload');
const videoElement = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let videoStream;
let signLanguageEnabled = false;

// Function to append a message to the chat box
function appendMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', sender === 'user' ? 'user-message' : 'bot-message');
  messageElement.innerHTML = `<p>${message}</p>`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to process user input
function processUserInput(input) {
  const userMessage = input.trim();
  if (userMessage !== '') {
    stopCamera();
    appendMessage(userMessage, 'user');
    // You can replace this part with your logic to respond to the user's message
    // For now, let's just respond with a dummy message
    setTimeout(() => {
      const response = 'I am just a demo bot. I am still learning!';
      appendMessage(response, 'bot');
    }, 500);
    userInput.value = '';
  }
}

// Event listener for user text input
userInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    processUserInput(userInput.value);
  }
});

// Event listener for voice button
voiceButton.addEventListener('click', function () {
  recognizeSpeech();
});

// Function to handle speech recognition
function recognizeSpeech() {
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();
  recognition.onresult = function(event) {
    const speechResult = event.results[0][0].transcript;
    processUserInput(speechResult);
  }
}

// Event listener for image upload
imageUpload.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    stopCamera();
    const reader = new FileReader();
    reader.onload = function (e) {
      const image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        recognizeImage(image);
      }
    };
    reader.readAsDataURL(file);
  }
});

// Function to recognize image using MobileNet model
async function recognizeImage(image) {
  const model = await mobilenet.load();
  const predictions = await model.classify(image);
  let message = 'I think this is ';
  predictions.forEach((prediction, index) => {
    if (index > 0) {
      message += ', or ';
    }
    message += `${prediction.className} (${Math.round(prediction.probability * 100)}% confident)`;
  });
  appendMessage(message, 'bot');
}

// Start camera and handpose model
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      videoStream = stream;
      videoElement.srcObject = stream;
    })
    .catch(function (err) {
      console.log("An error occurred: " + err);
    });
}

// Stop camera
function stopCamera() {
  if (videoStream) {
    const tracks = videoStream.getTracks();
    tracks.forEach(track => track.stop());
  }
}

// Toggle sign language recognition
function toggleSignLanguage() {
  signLanguageEnabled = !signLanguageEnabled;
  if (signLanguageEnabled) {
    startCamera();
  } else {
    stopCamera();
  }
}

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 1, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.6, // confidence threshold
};

// Load the handpose model
handpose.load().then(model => {
  setInterval(runDetection, 100);
  async function runDetection() {
    if (signLanguageEnabled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      videoElement.width = 640;
      videoElement.height = 480;
      canvas.width = videoElement.width;
      canvas.height = videoElement.height;
      ctx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
      const predictions = await model.estimateHands(videoElement);
      if (predictions.length > 0) {
        const fingersUp = getFingersUp(predictions[0].landmarks);
        const sign = getSign(fingersUp);
        appendMessage(sign, 'bot');
      }
    }
  }
});

// Get fingers up based on hand landmarks
function getFingersUp(landmarks) {
  const fingersUp = [];
  // Thumb
  if (landmarks[4][1] > landmarks[5][1]) {
    fingersUp.push(1);
  } else {
    fingersUp.push(0);
  }
  // Index
  if (landmarks[8][1] > landmarks[6][1]) {
    fingersUp.push(1);
  } else {
    fingersUp.push(0);
  }
  // Middle
  if (landmarks[12][2] < landmarks[10][2]) {
    fingersUp.push(1);
  } else {
    fingersUp.push(0);
  }
  // Ring
  if (landmarks[16][2] < landmarks[14][2]) {
    fingersUp.push(1);
  } else {
    fingersUp.push(0);
  }
  // Pinky
  if (landmarks[20][2] < landmarks[18][2]) {
    fingersUp.push(1);
  } else {
    fingersUp.push(0);
  }
  return fingersUp;
}

// Get sign based on fingers position
// Get sign based on fingers position
function getSign(fingersUp) {
  if (fingersUp.toString() === '10000') {
    return 'A';
  } else if (fingersUp.toString() === '11000') {
    return 'B';
  } else if (fingersUp.toString() === '11100') {
    return 'C';
  } else if (fingersUp.toString() === '11110') {
    return 'D';
  } else if (fingersUp.toString() === '11111') {
    return 'E';
  } else if (fingersUp.toString() === '10001') {
    return 'F';
  } else if (fingersUp.toString() === '10010') {
    return 'G';
  } else if (fingersUp.toString() === '10100') {
    return 'H';
  } else if (fingersUp.toString() === '10110') {
    return 'I';
  } else if (fingersUp.toString() === '10111') {
    return 'J';
  } else if (fingersUp.toString() === '11001') {
    return 'K';
  } else if (fingersUp.toString() === '11010') {
    return 'L';
  } else if (fingersUp.toString() === '11100') {
    return 'M';
  } else if (fingersUp.toString() === '11101') {
    return 'N';
  } else if (fingersUp.toString() === '11000') {
    return 'O';
  } else if (fingersUp.toString() === '11001') {
    return 'P';
  } else if (fingersUp.toString() === '11010') {
    return 'Q';
  } else if (fingersUp.toString() === '11011') {
    return 'R';
  } else if (fingersUp.toString() === '11100') {
    return 'S';
  } else if (fingersUp.toString() === '11101') {
    return 'T';
  } else if (fingersUp.toString() === '11110') {
    return 'U';
  } else if (fingersUp.toString() === '11111') {
    return 'V';
  } else if (fingersUp.toString() === '100000') {
    return 'W';
  } else if (fingersUp.toString() === '100001') {
    return 'X';
  } else if (fingersUp.toString() === '100010') {
    return 'Y';
  } else if (fingersUp.toString() === '100011') {
    return 'Z';
  } else {
    return 'Unknown sign';
  }
}