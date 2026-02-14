// ===============================
// SPEECH RECOGNITION SETUP
// ===============================

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-IN";
recognition.continuous = false;
recognition.interimResults = false;


// ===============================
// MIC START
// ===============================

function startListening() {
    try {
        recognition.start();
        console.log("Listening...");
    } catch (e) {
        console.log("Mic already running");
    }
}


// ===============================
// WHEN MIC STARTS
// ===============================

recognition.onstart = () => {
    console.log("Mic Started");
};


// ===============================
// WHEN SPEECH DETECTED
// ===============================

recognition.onresult = (event) => {

    let text = event.results[0][0].transcript.toLowerCase();

    console.log("You said:", text);

    jarvisReply(text);
};


// ===============================
// ERROR HANDLING
// ===============================

recognition.onerror = (event) => {
    console.log("Speech Error:", event.error);
};


// ===============================
// JARVIS REPLY LOGIC
// ===============================

function jarvisReply(text){

    let reply = "Sorry, I did not understand.";

    // English Commands
    if(text.includes("hello") || text.includes("hi")){
        reply = "Hello. I am Jarvis. I am ready for your command.";
    }

    else if(text.includes("how are you")){
        reply = "I am working perfectly. Thank you for asking.";
    }

    else if(text.includes("time")){
        let time = new Date().toLocaleTimeString();
        reply = "Current time is " + time;
    }

    // Hindi Commands
    else if(text.includes("namaste")){
        reply = "Namaste. Main Jarvis hoon. Main aapki madad ke liye ready hoon.";
    }

    else if(text.includes("kaise ho")){
        reply = "Main bilkul theek hoon.";
    }

    speak(reply);
}


// ===============================
// SPEAK FUNCTION
// ===============================

function speak(message){

    let speech = new SpeechSynthesisUtterance();

    speech.text = message;
    speech.lang = "en-IN";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


// ===============================
// MIC BUTTON CONNECTION
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    let micBtn = document.getElementById("mic");

    if(micBtn){
        micBtn.addEventListener("click", () => {
            startListening();
        });
    }

});