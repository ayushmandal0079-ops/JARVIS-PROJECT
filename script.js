// ---------------- MIC BUTTON ----------------
const mic = document.querySelector(".mic");
mic.addEventListener("click", toggleMic);

// ---------------- ROTATING RING ----------------
const ring = document.querySelector(".ring");
let angle = 0;
function rotateRing() {
    angle += 0.5; // smooth rotation
    ring.style.transform = `rotate(${angle}deg)`;
    requestAnimationFrame(rotateRing);
}
rotateRing();

// ---------------- TYPING ANIMATION ----------------
const status = document.getElementById("status");
const messages = [
    "▌ Welcome, Sir...",
    "▌ Jarvis is online...",
    "▌ Awaiting command..."
];

let msgIndex = 0;
let charIndex = 0;

function typeMessage() {
    if(msgIndex >= messages.length) return;
    let current = messages[msgIndex];
    if(charIndex < current.length){
        status.innerHTML += current.charAt(charIndex);
        charIndex++;
        setTimeout(typeMessage, 60);
    } else {
        status.innerHTML += "<br>";
        msgIndex++;
        charIndex = 0;
        setTimeout(typeMessage, 400);
    }
}
typeMessage();

// ---------------- VOICE INTERACTION ----------------
let audioContext, analyser, microphone, dataArray, animationId;
let recognition;

function toggleMic() {
    mic.classList.toggle("active");
    if(mic.classList.contains("active")){
        startListening();
    } else {
        stopListening();
    }
}

// ---------------- START LISTENING ----------------
function startListening() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Audio for waveform
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            animateWaveform();

            // Speech recognition
            if(!recognition){
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.lang = "en-US";
                recognition.interimResults = false;

                recognition.onresult = function(event) {
                    let command = event.results[0][0].transcript.toLowerCase();
                    handleCommand(command);
                }

                recognition.onend = function(){
                    if(mic.classList.contains("active")) recognition.start();
                }
            }
            recognition.start();
        })
        .catch(err => alert("Microphone access denied"));
}

// ---------------- STOP LISTENING ----------------
function stopListening(){
    cancelAnimationFrame(animationId);
    if(audioContext) audioContext.close();
    if(recognition) recognition.stop();
}

// ---------------- WAVEFORM ANIMATION ----------------
const bars = document.querySelectorAll(".bar");
function animateWaveform(){
    analyser.getByteFrequencyData(dataArray);
    let avg = dataArray.reduce((a,b)=>a+b,0)/dataArray.length;
    bars.forEach(bar => {
        let scale = Math.max(0.3, avg/150);
        bar.style.transform = `scaleY(${scale})`;
    });
    animationId = requestAnimationFrame(animateWaveform);
}

// ---------------- SPEECH SYNTHESIS (Mobile-Friendly) ----------------
function speak(text, lang="en-US"){
    const utter = new SpeechSynthesisUtterance(text);

    function selectVoiceAndSpeak() {
        const voices = window.speechSynthesis.getVoices();
        // Try to find male voice in requested language
        utter.voice = voices.find(v => v.lang === lang && v.name.toLowerCase().includes("male")) || voices[0];
        utter.pitch = 0.8; // slightly deep
        utter.rate = 0.9;  // respectful
        window.speechSynthesis.speak(utter);
    }

    // Wait for voices to load on mobile
    if(!window.speechSynthesis.getVoices().length){
        window.speechSynthesis.onvoiceschanged = selectVoiceAndSpeak;
    } else {
        selectVoiceAndSpeak();
    }
}

// ---------------- COMMAND RECOGNITION ----------------
function handleCommand(command){
    console.log("Command:", command);
    if(command.includes("hello")){
        speak("Hello, Sir", "en-US");
    } else if(command.includes("how are you")){
        speak("I am ready, Sir", "en-US");
    } else if(command.includes("open app")){
        speak("Opening application, Sir", "en-US");
    } else if(command.includes("नमस्ते") || command.includes("हेलो")){
        speak("नमस्ते, सर", "hi-IN");
    } else if(command.includes("कैसे हो")){
        speak("मैं तैयार हूँ, सर", "hi-IN");
    } else {
        speak("Command not recognized, Sir", "en-US");
    }
}