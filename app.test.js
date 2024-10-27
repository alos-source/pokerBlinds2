// app.test.js

import { startBlindTimer, pauseTimer, resumeTimer, logEvent } from './app.js';

test('should start timer with correct blind time', () => {
    timeRemaining = 60; // z.B. 60 Sekunden
    startBlindTimer(timeRemaining);

    expect(timeRemaining).toBeGreaterThan(0);
});

test('should pause the timer', () => {
    isPaused = false;
    pauseTimer();
    expect(isPaused).toBe(true);
});

test('should log start event correctly', () => {
    logEvent("Game started");
    expect(gameLog).toContain("Game started");
});
