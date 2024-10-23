let blinds = [];
let currentBlindIndex = 0;
let timeRemaining;
let timerInterval;
let isPaused = false;
let blindTimeGlobal;
let startTime;
let gameLog = [];

document.getElementById('startBtn').addEventListener('click', () => {
    // Clear the previous game log when a new game starts
    gameLog = [];

    const blindTime = parseInt(document.getElementById('blindTime').value) * 60; // in Sekunden
    blinds = document.getElementById('blindLevels').value.split(',').map(b => b.trim());
    currentBlindIndex = 0;
    blindTimeGlobal = blindTime;
    startTime = new Date();

    document.getElementById('gameLogContainer').style.display = 'none'; // Hide previous log

    logEvent("Game started at: " + startTime.toLocaleString());

    // Disable input fields after the game starts
    document.getElementById('blindTime').disabled = true;
    document.getElementById('blindLevels').disabled = true;

    // Show and enable Pause, Reset, and End buttons
    document.getElementById('pauseBtn').style.display = 'inline-block';
    document.getElementById('pauseBtn').disabled = false;
    //document.getElementById('resetBtn').style.display = 'inline-block';
    //document.getElementById('resetBtn').disabled = false;
    document.getElementById('endBtn').style.display = 'inline-block';
    document.getElementById('endBtn').disabled = false;

    // Disable the Start button to prevent starting the game again
    document.getElementById('startBtn').disabled = true;

    startBlindTimer(blindTime);
});


document.getElementById('pauseBtn').addEventListener('click', () => {
    if (!isPaused) {
        pauseTimer();
        //logEvent("Game paused");

        // Enable reset and end game buttons during pause
        document.getElementById('resetBtn').disabled = false;
        document.getElementById('endBtn').disabled = false;
    } else {
        resumeTimer();
        //logEvent("Game resumed");

        // Disable reset button while the game is running
        document.getElementById('resetBtn').disabled = true;
    }
});

document.getElementById('resetBtn').addEventListener('click', resetTimer);

document.getElementById('endBtn').addEventListener('click', () => {
    endGame();
    //logEvent("Game ended");

    // Re-enable inputs for a new game
    document.getElementById('blindTime').disabled = false;
    document.getElementById('blindLevels').disabled = false;
    
    // Hide and disable pause, reset, and end buttons
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('endBtn').style.display = 'none';

    // Re-enable start button for a new game
    document.getElementById('startBtn').disabled = false;
});

document.getElementById('downloadLogBtn').addEventListener('click', downloadGameLog);

function startBlindTimer(blindTime) {
    if (blinds.length === 0) return;

    updateBlindDisplay();
    timeRemaining = blindTime;
    isPaused = false;

    clearInterval(timerInterval); // Stoppe vorherigen Timer
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeRemaining--;
            updateTimeDisplay();

            if (timeRemaining === 30) {
                document.getElementById('timeRemaining').classList.add('warning');
                playWarningSound();
            }

            if (timeRemaining <= 0) {
                currentBlindIndex++;
                logEvent("Blind level changed to: " + blinds[currentBlindIndex]);

                if (currentBlindIndex < blinds.length) {
                    timeRemaining = blindTimeGlobal;
                    document.getElementById('timeRemaining').classList.remove('warning');
                    updateBlindDisplay();
                } else {
                    clearInterval(timerInterval);
                    document.getElementById('currentBlind').textContent = "Tournament Over";
                    document.getElementById('timeRemaining').textContent = "-";
                }
            }
        }
    }, 1000); // Jede Sekunde aktualisieren
}

function pauseTimer() {
    isPaused = true;
    document.getElementById('pauseBtn').textContent = "Resume";
    clearInterval(timerInterval);
    logEvent("Game paused");
}

function resumeTimer() {
    isPaused = false;
    document.getElementById('pauseBtn').textContent = "Pause";
    startBlindTimer(timeRemaining);
    logEvent("Game resumed");
}

function resetTimer() {
    isPaused = false;
    document.getElementById('pauseBtn').textContent = "Pause";
    timeRemaining = blindTimeGlobal;
    updateTimeDisplay();
    logEvent("Timer reset");

    // Disable reset button after resetting
    document.getElementById('resetBtn').disabled = true;
}

function endGame() {
    clearInterval(timerInterval);
    logEvent("Game ended at: " + new Date().toLocaleString());
    logEvent("Final Blind: " + blinds[currentBlindIndex - 1 +1]);

    // Display game log and offer download
    document.getElementById('gameLogContainer').style.display = 'block';
    document.getElementById('gameLog').textContent = gameLog.join("\n");

    // Disable all action buttons
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;
    document.getElementById('endBtn').disabled = true;
}

function updateBlindDisplay() {
    document.getElementById('currentBlind').textContent = `Current Blind: ${blinds[currentBlindIndex]}`;
}

function updateTimeDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timeRemaining').textContent = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function playWarningSound() {
    const audio = new Audio('warning.mp3');
    audio.play();
}

function logEvent(event) {
    const timestamp = new Date().toLocaleTimeString();
    gameLog.push(`[${timestamp}] ${event}`);
}

function downloadGameLog() {
    const logContent = gameLog.join("\n");
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-log.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
