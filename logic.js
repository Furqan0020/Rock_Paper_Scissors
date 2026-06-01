// DOM Elements
const resultElement = document.querySelector('#result');
const winsElement = document.getElementById('wins');
const lossesElement = document.getElementById('losses');
const tiesElement = document.getElementById('ties');
const winRateElement = document.getElementById('win-rate');
const autoBtn = document.getElementById('auto-btn');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const autoplayControls = document.getElementById('autoplay-controls');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const statsModal = document.getElementById('stats-modal');
const themeBtn = document.getElementById('theme-btn');

// Game State
let score = JSON.parse(localStorage.getItem('score')) || {  
    win: 0,
    losses: 0,
    ties: 0
};

let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
let moveCounts = JSON.parse(localStorage.getItem('moveCounts')) || { Rock: 0, Paper: 0, Scissors: 0 };
let currentStreak = 0;
let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;

// Auto Play Variables
let isAutoPlaying = false;
let intervalId = null;
let autoPlaySpeed = 1000;

// Initialize
updateScoreDisplay();
updateWinRate();
renderHistory();
loadTheme();

// Computer Choice
const computerChoice = () => {
    const choices = ['Rock', 'Paper', 'Scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
};

// Determine Winner
const determineWinner = (userMove, computerMove) => {
    if (userMove === computerMove) {
        return 'Ties';
    }
    
    if (
        (userMove === 'Rock' && computerMove === 'Scissors') ||
        (userMove === 'Paper' && computerMove === 'Rock') ||
        (userMove === 'Scissors' && computerMove === 'Paper')
    ) {
        return 'Win';
    }
    
    return 'Lose';
};

// User Choice Handler
const userChoice = (userMove) => {
    const computerMove = computerChoice();
    const result = determineWinner(userMove, computerMove);
    
    // Update score
    if (result === 'Win') {
        score.win += 1;
        currentStreak++;
        if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
            localStorage.setItem('bestStreak', bestStreak);
        }
    } else if (result === 'Lose') {
        score.losses += 1;
        currentStreak = 0;
    } else {
        score.ties += 1;
    }
    
    // Track move usage
    moveCounts[userMove]++;
    
    // Save to local storage
    localStorage.setItem('score', JSON.stringify(score));
    localStorage.setItem('moveCounts', JSON.stringify(moveCounts));
    
    // Add to history
    addToHistory(userMove, computerMove, result);
    
    // Update display
    displayResult(userMove, computerMove, result);
    updateScoreDisplay();
    updateWinRate();
};

// Display Result
const displayResult = (userMove, computerMove, result) => {
    const resultText = result === 'Win' ? '🎉 You Win!' : 
                       result === 'Lose' ? '😔 You Lose!' : '🤝 It\'s a Tie!';
    
    resultElement.innerHTML = `
        <div>
            <p><strong>You chose:</strong> ${getEmoji(userMove)} ${userMove}</p>
            <p><strong>Computer chose:</strong> ${getEmoji(computerMove)} ${computerMove}</p>
            <p style="font-size: 1.5rem; margin-top: 15px; color: var(--primary-color);">${resultText}</p>
        </div>
    `;
};

// Get Emoji for Move
const getEmoji = (move) => {
    const emojis = {
        'Rock': '🪨',
        'Paper': '📄',
        'Scissors': '✂️'
    };
    return emojis[move] || '';
};

// Update Score Display
const updateScoreDisplay = () => {
    winsElement.textContent = score.win;
    lossesElement.textContent = score.losses;
    tiesElement.textContent = score.ties;
};

// Update Win Rate
const updateWinRate = () => {
    const totalGames = score.win + score.losses + score.ties;
    if (totalGames === 0) {
        winRateElement.textContent = '0%';
        return;
    }
    const winRate = Math.round((score.win / totalGames) * 100);
    winRateElement.textContent = `${winRate}%`;
};

// Add to History
const addToHistory = (userMove, computerMove, result) => {
    const gameEntry = {
        id: Date.now(),
        userMove,
        computerMove,
        result,
        timestamp: new Date().toLocaleString()
    };
    
    gameHistory.unshift(gameEntry);
    if (gameHistory.length > 50) {
        gameHistory.pop();
    }
    
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    renderHistory();
};

// Render History
const renderHistory = () => {
    if (gameHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No games played yet</p>';
        return;
    }
    
    historyList.innerHTML = gameHistory.map(game => `
        <div class="history-item ${game.result.toLowerCase()}">
            <div>
                <strong>${getEmoji(game.userMove)} vs ${getEmoji(game.computerMove)}</strong>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">${game.timestamp}</div>
            </div>
            <div style="font-weight: bold;">
                ${game.result === 'Win' ? '✅' : game.result === 'Lose' ? '❌' : '🤝'}
            </div>
        </div>
    `).join('');
};

// Toggle History Panel
const toggleHistory = () => {
    historyPanel.classList.toggle('active');
};

// Clear History
const clearHistory = () => {
    gameHistory = [];
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    renderHistory();
};

// Show Stats Modal
const showStats = () => {
    const totalGames = score.win + score.losses + score.ties;
    
    let winRate = 0, lossRate = 0, tieRate = 0;
    if (totalGames > 0) {
        winRate = Math.round((score.win / totalGames) * 100);
        lossRate = Math.round((score.losses / totalGames) * 100);
        tieRate = Math.round((score.ties / totalGames) * 100);
    }
    
    // Find most used move
    let mostUsedMove = '-';
    let maxCount = 0;
    for (const [move, count] of Object.entries(moveCounts)) {
        if (count > maxCount) {
            maxCount = count;
            mostUsedMove = `${getEmoji(move)} ${move} (${count})`;
        }
    }
    
    document.getElementById('total-games').textContent = totalGames;
    document.getElementById('stat-win-rate').textContent = `${winRate}%`;
    document.getElementById('stat-loss-rate').textContent = `${lossRate}%`;
    document.getElementById('stat-tie-rate').textContent = `${tieRate}%`;
    document.getElementById('most-used-move').textContent = mostUsedMove;
    document.getElementById('best-streak').textContent = bestStreak;
    
    statsModal.classList.add('active');
};

// Close Stats Modal
const closeStats = () => {
    statsModal.classList.remove('active');
};

// Reset Button
const resetButton = () => {
    score = { win: 0, losses: 0, ties: 0 };
    moveCounts = { Rock: 0, Paper: 0, Scissors: 0 };
    currentStreak = 0;
    bestStreak = 0;
    gameHistory = [];
    
    localStorage.setItem('score', JSON.stringify(score));
    localStorage.setItem('moveCounts', JSON.stringify(moveCounts));
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    localStorage.setItem('bestStreak', 0);
    
    updateScoreDisplay();
    updateWinRate();
    renderHistory();
    resultElement.innerHTML = 'Choose your weapon!';
    
    // Stop auto play if running
    if (isAutoPlaying) {
        autoPlay();
    }
};

// Auto Play Function
const autoPlay = () => {
    if (!isAutoPlaying) {
        isAutoPlaying = true;
        autoBtn.innerHTML = '⏸️ Pause';
        autoBtn.style.background = 'linear-gradient(135deg, #fdcb6e, #f39c12)';
        autoplayControls.style.display = 'block';
        
        intervalId = setInterval(() => {
            const randomMove = computerChoice();
            userChoice(randomMove);
        }, autoPlaySpeed);
    } else {
        clearInterval(intervalId);
        isAutoPlaying = false;
        autoBtn.innerHTML = '▶️ Auto Play';
        autoBtn.style.background = '';
        autoplayControls.style.display = 'none';
    }
};

// Speed Slider Handler
if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
        autoPlaySpeed = parseInt(e.target.value);
        const seconds = (autoPlaySpeed / 1000).toFixed(1);
        speedValue.textContent = `${seconds}s`;
        
        // Restart auto play with new speed if running
        if (isAutoPlaying) {
            clearInterval(intervalId);
            intervalId = setInterval(() => {
                const randomMove = computerChoice();
                userChoice(randomMove);
            }, autoPlaySpeed);
        }
    });
}

// Theme Toggle
const toggleTheme = () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
};

// Load Theme
const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeBtn.textContent = '☀️ Light Mode';
    }
};

// Close modal when clicking outside
statsModal.addEventListener('click', (e) => {
    if (e.target === statsModal) {
        closeStats();
    }
});
