let blinds = [];
let currentBlindIndex = 0;
let timeRemaining;
let timerInterval;
let isPaused = false;
let blindTimeGlobal;
let startTime;
let gameLog = [];
let wakeLock = null;
let soundEnabled = false; // Standardmäßig sind Töne deaktiviert

async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock active');
    } catch (err) {
        console.error('Wake Lock error:', err);
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release()
            .then(() => {
                wakeLock = null;
                console.log('Wake Lock release');
            });
    }
}

document.getElementById('startBtn').addEventListener('click', () => {
    gameLog = [];
    const blindTime = parseInt(document.getElementById('blindTime').value) * 60;
    blinds = document.getElementById('blindLevels').value.split(',').map(b => b.trim());
    currentBlindIndex = 0;
    blindTimeGlobal = blindTime;
    startTime = Date.now(); // Speichere die Startzeit für die Zeitberechnung
    timeRemaining = blindTimeGlobal;
    startBlindTimer(blindTime);
    playStartSound();
    
    document.getElementById('gameLogContainer').style.display = 'none';
    logEvent("Game started at: " + new Date(startTime).toLocaleString());

    document.getElementById('blindTime').disabled = true;
    document.getElementById('blindLevels').disabled = true;
    document.getElementById('pauseBtn').style.display = 'inline-block';
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('endBtn').style.display = 'inline-block';
    document.getElementById('endBtn').disabled = false;
    document.getElementById('startBtn').disabled = true;

    requestWakeLock();
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    if (!isPaused) {
        pauseTimer();
        document.getElementById('pauseBtn').textContent = "Resume";
        document.getElementById('resetBtn').disabled = false;
        document.getElementById('endBtn').disabled = false;
    } else {
        resumeTimer();
        document.getElementById('pauseBtn').textContent = "Pause";
        document.getElementById('resetBtn').disabled = true;
    }
});

document.getElementById('resetBtn').addEventListener('click', resetTimer);

document.getElementById('endBtn').addEventListener('click', () => {
    endGame();
    document.getElementById('blindTime').disabled = false;
    document.getElementById('blindLevels').disabled = false;
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('endBtn').style.display = 'none';
    document.getElementById('startBtn').disabled = false;
    releaseWakeLock();
});

document.getElementById('downloadLogBtn').addEventListener('click', downloadGameLog);

function startBlindTimer(blindTime) {
    if (blinds.length === 0) return;
    
    updateBlindDisplay();
    timeRemaining = blindTime;
    isPaused = false;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeRemaining--;
            updateTimeDisplay();

            if (timeRemaining === 10) {
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
    }, 1000);
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timerInterval);
    logEvent("Game paused");
}

function resumeTimer() {
    isPaused = false;
    startTime = Date.now(); // Setze Startzeit neu
    startBlindTimer(timeRemaining); // Fahre fort
    logEvent("Game resumed");
}

function resetTimer() {
    isPaused = false;
    timeRemaining = blindTimeGlobal;
    logEvent("Timer reset");
    startBlindTimer(timeRemaining);
    document.getElementById('resetBtn').disabled = true;
}

function endGame() {
    clearInterval(timerInterval);
    logEvent("Game ended at: " + new Date().toLocaleString());
    logEvent("Final Blind: " + blinds[currentBlindIndex - 1 + 1]);

    document.getElementById('gameLogContainer').style.display = 'block';
    document.getElementById('gameLog').textContent = gameLog.join("\n");
    
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
    if (!soundEnabled) return; // Spiele den Ton nur ab, wenn Sound aktiviert ist
    const audio = new Audio('warning.mp3');
    audio.play();
}

function playStartSound() {
    if (!soundEnabled) return; // Spiele den Ton nur ab, wenn Sound aktiviert ist
    const audio = new Audio('startsingal.mp3');
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

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        //pauseTimer();
    } else if (isPaused) {
        //resumeTimer();
    }

    logEvent("visibility changed");

})

// Event-Listener für die Sound-Checkbox
document.getElementById('soundToggle').addEventListener('change', (event) => {
    soundEnabled = event.target.checked; // Aktualisiere den Sound-Status
    logEvent(`Sound ${soundEnabled ? 'enabled' : 'disabled'}`);
});



;
