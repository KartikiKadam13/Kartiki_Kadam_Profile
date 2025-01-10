// Function to initialize SpeechSynthesisUtterance with a specific voice
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices[2]; // Index 1 corresponds to the second voice
    window.speechSynthesis.speak(utterance);
}

// Function to introduce the assistant and ask for questions
function introduceAndAsk() {
    const intro = "Hello, I'm Kartiki. How can I assist you today?";
    speakText(intro);

    // Wait for 2 seconds after the introduction
    setTimeout(function() {
        const questionPrompt = "Do you have any questions?";
        speakText(questionPrompt);
    }, 2000);
}

// Function to handle user's question
function handleQuestion(question) {
    let answer;

    // Convert the question to lowercase for case-insensitive matching
    question = question.toLowerCase();

    // Check for keywords in the question to determine the appropriate response
    if (question.includes('name')) {
        answer = "My name is Kartiki.";
    } else if (question.includes('how are you')) {
        answer = "I'm doing well, thank you.";
    } else if (question.includes('time')) {
        answer = "It's currently " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else if (question.includes('introduce')) {
        answer = "Hello, I'm Kartiki. Welcome to my profile page. To begin with my introduction, I would like to say that, I am a passionate developer immersed in the world of software development, specializing in both frontend and backend development. In my journey as a developer, I've had the privilege of working on a diverse range of projects, from building responsive and user-friendly interfaces, to architecting robust and scalable backend systems. I'm genuinely excited about the opportunity to collaborate with passionate teams, and contribute my skills to meaningful projects that make a real impact. Thank you for considering my candidacy, and I look forward to the opportunity to discuss how I can bring value to your team.";
    } else {
        answer = "I'm sorry, I cannot answer that question.";
    }

    speakText(answer);

    // Ask if the user has any more questions after providing the answer
    setTimeout(function() {
        speakText("Do you have any more questions?");
        // Start speech recognition after asking the question
        setTimeout(startSpeechRecognition); // Wait for 7 seconds after asking the question
    }, 5000);
}

// Enhanced function to handle speech recognition
function startSpeechRecognition() {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    let questionAsked = false; // Flag to track if the question has been asked

    // Function to start recognition
    function startRecognition() {
        recognition.start();
        console.log('Speech recognition started.');
    }

    // Event listener for recognizing when the question is asked
    document.addEventListener('DOMContentLoaded', function() {
        const questionElement = document.getElementById('question'); // Replace 'question' with the ID of the question element
        questionElement.addEventListener('click', function() {
            questionAsked = true;
            console.log('Question asked: Do you have any questions?');
            startRecognition(); // Start recognition after the question is asked
        });
    });

    recognition.onresult = function(event) {
        if (!questionAsked) return; // Exit if the question hasn't been asked yet

        let result = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            result += event.results[i][0].transcript;
        }
        result = result.trim(); // Trim to remove leading/trailing spaces
        console.log('Recognized:', result);
        handleQuestion(result);
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
    };
}

// Event listener for button click
document.getElementById('speakButton').addEventListener('click', function() {
    introduceAndAsk();
    setTimeout(startSpeechRecognition, 7000); // Wait for 7 seconds after the introduction to allow time for the user to respond
});

